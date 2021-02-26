import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import Item from "./item";

const KeepAlive: React.FC = () => {
  const list = ["A", "B", "C", "D", "E", "F", "G"];
  const [active, setActive] = useState<string>("A");
  const [already, setAlready] = useState<string[]>([]);

  useEffect(() => {
    if (!already.includes(active)) {
      setAlready([...already, active]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className={styles.keepalive}>
      {/* keep-alive */}
      <div>
        测试用数组实现的组件 keep-alive，原理 list.map + 判断条件，还有 display:
        none
      </div>
      <div className={styles.router}>
        点击切换路由：
        {list.map((item) => (
          <span onClick={() => setActive(item)}>{item}</span>
        ))}
      </div>
      <div>
        具体组件：
        {list.map((item) => {
          if (already.includes(item)) {
            return (
              <div style={{ display: item === active ? "block" : "none" }}>
                <Item key={item} flag={item} />
              </div>
            );
          } else {
            return (
              <>
                {item === active && (
                  <div>
                    <Item key={item} flag={item} />
                  </div>
                )}
              </>
            );
          }
        })}
      </div>
    </div>
  );
};

export default KeepAlive;
