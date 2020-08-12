import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';

interface ITest {
  data: number
}

const Test: React.FC<ITest> = (props) => {
  const [data, setData] = useState(props.data)

  useEffect(() => {
    console.log(`初始化：${data}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.test}>
      {data}
      <button onClick={() => {setData(data * 10)}}>点我</button>
    </div>
  );
}

export default Test;
