/*
 * @Author: your name
 * @Date: 2021-03-07 17:05:23
 * @LastEditTime: 2021-03-17 22:10:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \reactblog\src\views\test-page\index.tsx
 */
import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import KNN from "./knn";
import VirtualScroll from "./virtual-scroll";
import KeepAlive from "./keep-alive";

const TestPage: React.FC = () => {
  const list = ["knn", "keep-alive", "virtual-scroll"];
  const [active, setActive] = useState<string>("virtual-scroll");

  const Component = () => {
    const map: any = {
      knn: KNN,
      "virtual-scroll": VirtualScroll,
      "keep-alive": KeepAlive,
    };
    const Comp = map[active];
    return <Comp />;
  };

  return (
    <div className={`${styles.testPage} ScrollBar`}>
      <div>测试页</div>
      <div className={styles.router}>
        {list.map((item) => (
          <span onClick={() => setActive(item)}>{item}</span>
        ))}
      </div>
      {active && <Component />}
    </div>
  );
};

export default TestPage;
