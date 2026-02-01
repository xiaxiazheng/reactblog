import React from "react";
import { Modal, Tooltip } from "antd";
import styles from "./index.module.scss";
import MaskloadImage from "@/components/mask-load-image";
import ModalWrapper from "@/components/modal-wrapper";
import { ImageType, handleComputedFileSize } from "@xiaxiazheng/blog-libs";
import { QuestionCircleOutlined } from "@ant-design/icons";

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
            <ModalWrapper
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
                                        {handleComputedFileSize(Number(image?.size))}
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
            </ModalWrapper>
        </div>
    );
};

export default PreviewImage;
