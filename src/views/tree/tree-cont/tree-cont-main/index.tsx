import React from 'react';
import styles from './index.module.scss';

const TreeContMain: React.FC = () => {

  return (
    <div className={styles.treecontmain}>
      使用 & 查看须知：
      <br />
      理论类的东西容易分门别类，这些一般放到知识树，可以系统的整理。
      <br />
      至于日志就放实践类的东西，容易整理成一篇文章，攻略或指南。
    </div>
  );
}

export default TreeContMain;
