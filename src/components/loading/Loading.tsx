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

  return (
    <div className={styles.loading} style={{width: width ? `${width}px` : ''}}>
      <img src={loadingImg} alt="loading" />
    </div>
  )
}

export default Loading;