import React, { useRef } from 'react';
import styles from './LazyloadImage.module.scss';
import { default as imgPlaceHolder } from '@/assets/loading.svg';

interface PropsType {
  imageName: string;
  imageUrl: string;
};

/** 图片懒加载 */
const LazyloadImage: React.FC<PropsType> = (props) => {
  const imgRef = useRef(null);

  const {
    imageName,
    imageUrl,
  } = props;

  const changeRealSrc = () => {
    const imgdom: any = imgRef.current;
    if (imgdom.src !== imageUrl) {
      imgdom.src = imageUrl;
    }
  }

  return (
    <img
      ref={imgRef}
      className={styles.lazyloadImage}
      src={imgPlaceHolder}
      data-src={imageUrl}
      alt={imageName}
      title={imageName}
      onLoad={changeRealSrc}
    />
  );
}

export default LazyloadImage;