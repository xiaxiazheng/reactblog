import React, { useState } from 'react';
import styles from './UploadImage.module.scss';

interface PropsType {
  // otherId?: string;  // 跟这个图片要插入的地方有关联的记录 id
  // type: string;  // 图片在该系统中的类型的类型
  // imageId?: string;  // 若有图片则有 id
  // imageName?: string;
  // imageFileName?: string;
  // imageUrl: string;  // 完整的 url 的路径，若为 '' 则该组件需提供上传，不为 '' 则提供大图或删除图片
  // initImgList: Function;  // 用于上传成功或删除后的图片列表初始化
  // width?: string;  // 可以传递宽高给组件
};

const UploadImage: React.FC<PropsType> = (props) => {
  return (
    <div className={styles.uplodaImage}>
      <input type="file"></input>
    </div>
  )
}

export default UploadImage;