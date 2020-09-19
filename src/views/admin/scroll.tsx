import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

const boxHeight = 300;
const itemHeight = 50;
const total = 100;
const itemNum = Math.floor(boxHeight / itemHeight) + 1;

const Scroll: React.FC = () => {
  const [list, setlist] = useState<number[]>([]);
  const [showList, setShowList] = useState<number[]>([]);
  const [paddingTop, setPaddingTop] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState<number>(0);

  useEffect(() => {
    const l = [];
    for (let i = 0; i < total; i++) {
      l.push(i);
    }
    setlist(l);
    setShowList(l.slice(0, itemNum));
    setPaddingBottom((total - itemNum) * itemHeight);
  }, []);

  const handleScroll = (e: any) => {
    const top = e.target.scrollTop;
    // 顶部已经看不见了的 item 的个数
    const topNum = Math.floor(top / itemHeight);
    setPaddingTop(topNum * itemHeight);
    setPaddingBottom((total - itemNum - topNum) * itemHeight);
    setShowList(list.slice(topNum + 1, topNum + 1 + itemNum));

    console.dir(e.target.scrollTop);
    console.log("list", list.slice(topNum + 1, topNum + 1 + itemNum));
  };

  return (
    <div
      className={styles.scroll}
      style={{
        height: boxHeight,
      }}
      onScroll={handleScroll}
    >
      <div
        className={styles.scrollBox}
        style={{
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
        }}
      >
        {showList.map((item) => {
          return (
            <div
              key={item}
              className={styles.scrollItem}
              style={{ height: itemHeight }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scroll;
