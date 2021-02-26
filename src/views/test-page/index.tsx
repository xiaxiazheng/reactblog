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
    <div className={styles.testPage}>
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
