import React from "react";
import { Modal, Tooltip } from "antd";
import styles from "./index.module.scss";
import MaskloadImage from "@/components/mask-load-image";
import { ImageType } from "@xiaxiazheng/blog-libs";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { handleSize } from "../file-image-handle/utils";

interface PropsType {
    isPreview: boolean;
    image: ImageType | undefined;
    imageUrl: string;
    closePreview: Function;
}

// 图片预览
const PreviewImage: React.FC<PropsType> = (props) => {
    const { isPreview, image, imageUrl, closePreview } = props;

    return (
        <div>
            <Modal
                wrapClassName={styles.previewImgBoxWrapper}
                className={styles.previewImgBox}
                open={isPreview}
                footer={null}
                centered
                title={
                    <>
                        {image?.imgname}{" "}
                        <Tooltip
                            title={
                                <div>
                                    <div>名称：{image?.imgname}</div>
                                    <div>创建时间：{image?.cTime}</div>
                                    <div>
                                        文件大小：
                                        {handleSize(Number(image?.size))}
                                    </div>
                                </div>
                            }
                        >
                            <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                            />
                        </Tooltip>
                    </>
                }
                onCancel={(e) => {
                    e.stopPropagation();
                    closePreview();
                }}
            >
                {isPreview && (
                    <MaskloadImage
                        imageUrl={imageUrl}
                        imageName={image?.imgname || ""}
                    />
                )}
            </Modal>
        </div>
    );
};

export default PreviewImage;
