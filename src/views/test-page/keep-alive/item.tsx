import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

interface IItem {
  flag: string;
}

const Item: React.FC<IItem> = (props) => {
  const { flag } = props;

  const [data, setData] = useState<number>();

  useEffect(() => {
    console.log(`初始化：${data}`);
    setData(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.test}>
      {flag}：{data}
      <button
        onClick={() => {
          setData((data || 0) + 1);
        }}
      >
        点我 + 1
      </button>
    </div>
  );
};

export default Item;
