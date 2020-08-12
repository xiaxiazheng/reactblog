import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import Test from "./test-keep-alive";

const TreeContMain: React.FC = () => {
  const [list, setList] = useState([1, 2, 3, 4, 5, 6]);
  const [active, setActive] = useState(1);
  const [already, setAlready] = useState<number[]>([]);

  useEffect(() => {
    if (!already.includes(active)) {
      setAlready([...already, active]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className={styles.treecontmain}>
      {/* 知识树逐步废弃，转移到日志去吧 */}
      <div>知识树逐步废弃，转移到日志去吧</div>
      <br />
      <div>测试用数组实现的组件 keep-alive</div>
      {list.map((item) => (
        <div onClick={() => setActive(item)}>{item}</div>
      ))}
      {list.map((item) => {
        if (already.includes(item)) {
          return (
            <div style={{ display: item === active ? "block" : "none" }}>
              <Test key={item} data={item} />
            </div>
          );
        } else {
          return (
            <>
              {item === active && (
                <div>
                  <Test key={item} data={item} />
                </div>
              )}
            </>
          );
        }
      })}
    </div>
  );
};

export default TreeContMain;
