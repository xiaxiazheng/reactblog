import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import ImageBox from "@/components/image-box";

interface ImgType {
  cTime: string;
  filename: string;
  img_id: string;
  imgname: string;
  other_id: string;
  type: string;
  imageUrl: string;
  has_min: "0" | "1";
  imageMinUrl: string;
}

interface IProps {
  type: string
  imgList: ImgType[]
  other_id: string
  initImgList: Function
}

// 图片管理
const ImgManage: React.FC<IProps> = (props) => {
  const { type, imgList, other_id, initImgList } = props

  return (
    <div className={styles.ImgManage}>
      <ImageBox
        otherId={other_id}
        type={type}
        imageUrl=""
        imageMinUrl=""
        initImgList={initImgList}
      />
      {imgList.map((item: ImgType) => {
        return (
          <ImageBox
            key={item.img_id}
            type={type}
            imageId={item.img_id}
            imageName={item.imgname}
            imageFileName={item.filename}
            imageUrl={item.imageUrl}
            imageMinUrl={item.imageMinUrl}
            initImgList={initImgList}
          />
        );
      })}
    </div>
  );
};

export default ImgManage;
