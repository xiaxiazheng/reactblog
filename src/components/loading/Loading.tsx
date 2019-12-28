import React from 'react';
import styles from './Loading.module.scss'
import { default as loadingImg } from '../../assets/loading.svg';

interface LoadingType {
  width?: number;
}

const Loading: React.FC<LoadingType> = (props) => {

  const {
    width
  } = props;

  // let loadingImg: any = sessionStorage.getItem('loadingImg');
  // if (!loadingImg) {
  //   loadingImg = new Image();
  //   loadingImg.src = require('../../assets/loading.svg');
  //   console.log(loadingImg)
  //   console.log(typeof loadingImg)
  //   loadingImg.onload = () => {
  //     sessionStorage.setItem('loadingImg', loadingImg)
  //   }
  // }

  return (
    <div className={styles.loading} style={{width: width ? `${width}px` : ''}}>
      <img src={loadingImg} alt="loading" />
    </div>
  )
}

export default Loading;