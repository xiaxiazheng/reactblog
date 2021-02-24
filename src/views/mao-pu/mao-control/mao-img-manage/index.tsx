import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import ImageBox from "@/components/image-box";
import { ImgType } from '@/client/ImgHelper'

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
        width="150px"
        imageData={{}}
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
            width="150px"
            imageData={item}
          />
        );
      })}
    </div>
  );
};

export default ImgManage;
