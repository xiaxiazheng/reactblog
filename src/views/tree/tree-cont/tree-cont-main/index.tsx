import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import TestKeepAlive from "./test-keep-alive";
import TestVirtualScroll from './test-virtual-scroll'

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
      {/* keep-alive */}
      <div>测试用数组实现的组件 keep-alive</div>
      <div>
        {list.map((item) => (
          <div onClick={() => setActive(item)}>{item}</div>
        ))}
        {list.map((item) => {
          if (already.includes(item)) {
            return (
              <div style={{ display: item === active ? "block" : "none" }}>
                <TestKeepAlive key={item} data={item} />
              </div>
            );
          } else {
            return (
              <>
                {item === active && (
                  <div>
                    <TestKeepAlive key={item} data={item} />
                  </div>
                )}
              </>
            );
          }
        })}
      </div>
      <br />
      {/* 虚拟滚动 */}
      <div>测试虚拟滚动 virtual scroll</div>
      <TestVirtualScroll />
    </div>
  );
};

export default TreeContMain;
