import React, { useState, useEffect } from "react";
import { message, Modal, Space, Tooltip } from "antd";
import {
    CopyOutlined,
    EyeOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { staticUrl } from "@/env_config";
import { ImageType, ImgType, deleteImg } from "@/client/ImgHelper";
import PreviewImage from "@/components/preview-image";
import { handleSize, copyUrl } from "../utils";

interface IType {
    type: string;
    imageList: ImageType[];
    iconRender?: (item: ImgType) => any; // 用于渲染在操作台上进行操作的 antd 的 icon
    refresh: Function;
    width?: string;
    isOnlyShow?: boolean;
}

const ImageListBox: React.FC<IType> = (props) => {
    const { type, imageList, iconRender, refresh, width, isOnlyShow } = props;

    // 拼好 img 的 url
    const list: ImgType[] = imageList.map((item) => {
        return {
            ...item,
            imageUrl: `${staticUrl}/img/${type}/${item.filename}`, // 图片地址
            imageMinUrl:
                item.has_min === "1"
                    ? `${staticUrl}/min-img/${item.filename}`
                    : "", // 缩略图地址
        };
    });

    return (
        <Space size={10}>
            {list.map((item) => {
                return (
                    <ImageBox
                        key={item.img_id}
                        type={type}
                        imageId={item.img_id}
                        imageName={item.imgname}
                        imageFileName={item.filename}
                        imageUrl={item.imageUrl}
                        imageMinUrl={item.imageMinUrl}
                        initImgList={refresh}
                        imageData={item}
                        iconRender={() => iconRender && iconRender(item)}
                        width={width}
                        isOnlyShow={isOnlyShow}
                    />
                );
            })}
        </Space>
    );
};

interface PropsType {
    type: string; // 图片在该系统中的类型的类型
    imageId?: string; // 若有图片则有 id
    imageName?: string;
    imageFileName?: string;
    imageMinUrl: string; // 缩略图地址，没有的话是''
    imageUrl: string; // 完整的 url 的路径，若为 '' 则该组件需提供上传，不为 '' 则提供大图或删除图片
    initImgList: Function; // 用于上传成功或删除后的图片列表初始化
    width?: string; // 可以传递宽高给组件
    imageData: ImgType | {}; // 从接口拿的图片原始信息
    iconRender?: any; // 用于渲染在操作台上进行操作的 antd 的 icon
    isOnlyShow?: boolean;
}

const ImageBox: React.FC<PropsType> = (props) => {
    const {
        type,
        imageId,
        imageName = "一张图片",
        imageFileName,
        imageUrl,
        imageMinUrl,
        initImgList,
        width = "170px",
        imageData,
        iconRender,
        isOnlyShow = false,
    } = props;

    const { confirm } = Modal;

    // 图片的 ref，用于交叉观察
    const imgRef: any = React.createRef();
    // 交叉观察器加载图片
    useEffect(() => {
        let observer = new IntersectionObserver((entries) => {
            entries.forEach((item) => {
                if (item.isIntersecting) {
                    const img: any = item.target;
                    if (encodeURI(img["dataset"]["src"]) !== img["src"]) {
                        img["src"] = img["dataset"]["src"];
                    }
                }
            });
        });
        imgRef.current !== null && observer.observe(imgRef.current);
    }, [imgRef]);

    const [isHover, setIsHover] = useState(false);

    const [isPreview, setIsPreview] = useState(false);
    const deleteImage = async () => {
        confirm({
            title: `你将删除"${imageName}"`,
            content: "Are you sure？",
            centered: true,
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                const params = {
                    type: type,
                    img_id: imageId,
                    filename: imageFileName,
                };
                const res = await deleteImg(params);
                if (res) {
                    message.success("删除成功");
                    await initImgList();
                } else {
                    message.error("删除失败");
                }
            },
            onCancel() {
                message.info("已取消删除", 1);
            },
        });
    };

    return (
        <div
            className={styles.imageBox}
            style={{
                width: `${width}`,
                height: `${width}`,
            }}
            onMouseLeave={(e) => {
                e.stopPropagation();
                setIsHover(false);
            }}
        >
            {/* 展示缩略图或图片名称 */}
            {imageMinUrl && imageMinUrl !== "" ? (
                <img
                    ref={imgRef}
                    className={styles.shower}
                    onMouseEnter={(e) => {
                        e.stopPropagation();
                        setIsHover(true);
                    }}
                    data-src={imageMinUrl}
                    alt={imageName}
                />
            ) : (
                <div
                    className={styles.shower}
                    onMouseEnter={(e) => {
                        e.stopPropagation();
                        setIsHover(true);
                    }}
                >
                    {imageName}
                </div>
            )}
            {/* hover 显示操作 */}
            {isHover && (
                <div
                    className={styles.Icons}
                    title={`${(imageData as ImgType).imgname}\n${handleSize(
                        Number((imageData as ImgType).size || 0)
                    )}\n${(imageData as ImgType).cTime}`}
                >
                    <div>
                        <Tooltip title="复制图片链接">
                            <CopyOutlined
                                className={styles.iconBoxIcon}
                                title="复制图片链接"
                                onClick={copyUrl.bind(null, imageUrl)}
                            />
                        </Tooltip>

                        <Tooltip title="预览图片">
                            <EyeOutlined
                                className={styles.iconBoxIcon}
                                title="预览图片"
                                onClick={() => setIsPreview(true)}
                            />
                        </Tooltip>
                        {!isOnlyShow && (
                            <Tooltip title="删除图片">
                                <DeleteOutlined
                                    className={styles.iconBoxIcon}
                                    title="删除图片"
                                    onClick={deleteImage}
                                />
                            </Tooltip>
                        )}
                        <Tooltip
                            title={
                                <>
                                    <div className={styles.name}>
                                        图片名称：
                                        {(imageData as ImgType).imgname}
                                    </div>
                                    <div className={styles.size}>
                                        图片大小：
                                        {handleSize(
                                            Number(
                                                (imageData as ImgType).size || 0
                                            )
                                        )}
                                    </div>
                                    <div className={styles.time}>
                                        更新时间：{(imageData as ImgType).cTime}
                                    </div>
                                </>
                            }
                            placement="bottom"
                        >
                            <InfoCircleOutlined
                                className={styles.iconBoxIcon}
                                title="图片详细信息"
                            />
                        </Tooltip>
                        {iconRender || <></>}
                    </div>
                </div>
            )}
            {/* 图片预览 */}
            <PreviewImage
                isPreview={isPreview}
                imageName={imageName}
                imageUrl={imageUrl}
                closePreview={() => setIsPreview(false)}
            />
        </div>
    );
};

export default ImageListBox;
