import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import { ImageType } from "@xiaxiazheng/blog-libs";
import FileImageUpload from "@/components/file-image-handle/file-image-upload";

interface IProps {
    type: string;
    imageList: ImageType[];
    other_id: string;
    initImgList: Function;
    isShowUpload?: boolean;
    width?: string;
    style?: any;
    margin?: string;
}

// 图片管理
const ImgManage: React.FC<IProps> = (props) => {
    const {
        type,
        imageList,
        other_id,
        initImgList,
        isShowUpload = true,
        width = "150px",
        style,
        margin,
    } = props;

    return (
        <div className={styles.ImgManage} style={{ margin }}>
            {isShowUpload && (
                <FileImageUpload
                    type={type}
                    other_id={other_id}
                    width={width}
                    refresh={initImgList}
                />
            )}
            {/* 图片列表 */}
            <ImageListBox
                type={type}
                refresh={initImgList}
                width={width}
                imageList={imageList}
                style={style}
            />
        </div>
    );
};

export default ImgManage;
