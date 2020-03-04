import React, { useEffect } from 'react';
import styles from './index.module.scss';
import LogList from './log-list';
import TagList from './tag-list';

interface PropsType {
  
};

const Log: React.FC<PropsType> = () => {

  return (
    <div className={styles.log}>
      <div className={styles.logLeft}>
        <TagList />
      </div>
      <div className={styles.logRight}>
        {/* 日志列表 */}
        <LogList />
      </div>
    </div>
  );
}

export default Log;