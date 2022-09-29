import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import { ImageType } from "@/client/ImgHelper";
import FileImageUpload from "@/components/file-image-handle/file-image-upload";

interface IProps {
    type: string;
    imageList: ImageType[];
    other_id: string;
    initImgList: Function;
    isShowUpload?: boolean;
}

// 图片管理
const ImgManage: React.FC<IProps> = (props) => {
    const {
        type,
        imageList,
        other_id,
        initImgList,
        isShowUpload = true,
    } = props;

    return (
        <div className={styles.ImgManage}>
            {isShowUpload && (
                <FileImageUpload
                    type={type}
                    other_id={other_id}
                    width="150px"
                    refresh={initImgList}
                />
            )}
            {/* 图片列表 */}
            <ImageListBox
                type={type}
                refresh={initImgList}
                width="150px"
                imageList={imageList}
            />
        </div>
    );
};

export default ImgManage;
