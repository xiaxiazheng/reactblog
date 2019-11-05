import React, { useContext } from 'react';
import styles from './Loading.module.scss'
import { Icon } from 'antd'
import classnames from 'classnames';
import { ThemeContext } from '../../context/ThemeContext'

interface LoadingType {
  fontSize?: number;
}

const Loading: React.FC<LoadingType> = (props) => {
  const { theme } = useContext(ThemeContext);

  const {
    fontSize
  } = props;

  const className = classnames({
    [styles.loading]: true,
    [styles.lightLoading]: theme === 'light'
  })

  return (
    <div className={className} style={{fontSize: fontSize ? `${fontSize}px` : '20px'}}>
      <Icon type="loading"/>
      &nbsp;loading
    </div>
  )
}

export default Loading;