import React from 'react';
import styles from './Loading.module.scss'
import { Icon } from 'antd'

interface LoadingType {
  fontSize?: number;
}

const Loading: React.FC<LoadingType> = (props) => {
  const {
    fontSize
  } = props;

  return (
    <div className={styles.loading} style={{fontSize: fontSize ? `${fontSize}px` : '20px'}}>
      <Icon type="loading"/>
      loading
    </div>
  )
}

export default Loading;