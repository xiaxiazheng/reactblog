import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import echarts from "echarts";

const Knn: React.FC = () => {
  const ring = useRef(null);

  const initRing = (list1: any, list2: any) => {
    const myring: any = ring.current;
    const myChart = echarts.init(myring);

    const colorMap = {
      I类: "black",
      II类: "orange",
      III类: "red",
    };

    const options = {
      xAxis: {},
      yAxis: {},

      series: [
        {
          symbolSize: 20,
          data: list1
            .filter((item: any) => item.type === "I类")
            .map((item: any) => [item.x, item.y]),
          color: colorMap["I类"],
          type: "scatter",
        },
        {
          symbolSize: 20,
          data: list1
            .filter((item: any) => item.type === "II类")
            .map((item: any) => [item.x, item.y]),
          color: colorMap["II类"],
          type: "scatter",
        },
        {
          symbolSize: 20,
          data: list1
            .filter((item: any) => item.type === "III类")
            .map((item: any) => [item.x, item.y]),
          color: colorMap["III类"],
          type: "scatter",
        },
        {
          symbolSize: 20,
          data: list2
            .filter((item: any) => item.type === "I类")
            .map((item: any) => [item.x, item.y]),
          color: 'transparent',
          type: "scatter",
          itemStyle: {
            borderColor: colorMap["I类"],
            borderWidth: 3
          }
        },
        {
          symbolSize: 20,
          data: list2
            .filter((item: any) => item.type === "II类")
            .map((item: any) => [item.x, item.y]),
            color: 'transparent',
          type: "scatter",
          itemStyle: {
            borderColor: colorMap["II类"],
            borderWidth: 3
          }
        },
        {
          symbolSize: 20,
          data: list2
            .filter((item: any) => item.type === "III类")
            .map((item: any) => [item.x, item.y]),
            color: 'transparent',
          type: "scatter",
          itemStyle: {
            borderColor: colorMap["III类"],
            borderWidth: 3
          }
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(options);
  };

  // 计算欧氏距离
  const getDistance = (x1: any, y1: any, x2: any, y2: any) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // 数值归一化
  const getMean = (x: any, min: any, max: any) => {
    return Math.floor(((x - min) / (max - min)) * 10000) / 10000;
  };

  // 获取随机 X
  const getX = () => {
    return Math.floor(Math.random() * 100);
  };

  // 获取随机 Y
  const getY = () => {
    return Math.floor(Math.random() * 80);
  };

  // 训练数据数量
  const [count, setCount] = useState(20)
  // 生成训练数据
  const getRandomList = () => {
    const list = [];
    const map = ["I类", "II类", "III类"];
    for (let i = 0; i < count; i++) {
      list.push({
        x: getX(),
        y: getY(),
        type: map[i % map.length],
      });
    }
    return list;
  };

  // 交叉验证，取值 1 - 20
  const testBestK = (list: any) => {
    const length = Math.floor(list.length / 5);
    // 保存每一个 k 值的正确率
    const kList = [];
    // k 值遍历 1 - 20
    for (let k = 1; k <= 20; k = k + 2) {
      // 正确率
      const rightRate = [];
      // 五折
      for (let i = 0; i < 5; i++) {
        const myList = [...list];
        // 切分测试集，剩余的是训练集
        const testList = myList.splice(i * length, length);
        // 保存正确的个数
        let right = 0;
        testList.forEach((item) => {
          // 分类正确正确个数 +1
          item.type === knn(myList, k, item.x, item.y) && right++;
        });
        rightRate.push(right / (i === 4 ? list.length - 4 * length : length));
      }
      let sum = 0;
      rightRate.forEach((item) => {
        sum += item;
      });
      // 正确率平均值
      kList.push(sum / 5);
      console.log(`k = ${k} 的正确率: ${sum / 5}`);
    }
    let max = 0,
      maxK = 0;
    kList.forEach((item, index) => {
      if (item > max) {
        max = item;
        maxK = 2 * index + 1;
      }
    });
    return maxK;
  };

  // 数据归一化
  const getMeanList = (list1: any, list2: any) => {
    let myList = [...list1, ...list2];
    let maxX = Number.MIN_VALUE;
    let minX = Number.MAX_VALUE;
    let maxY = Number.MIN_VALUE;
    let minY = Number.MAX_VALUE;
    myList.forEach((item) => {
      item.x > maxX && (maxX = item.x);
      item.y > maxY && (maxY = item.y);
      item.x < minX && (minX = item.x);
      item.y < minY && (minY = item.y);
    });
    list1 = list1.map((item: any) => {
      return {
        ...item,
        x: getMean(item.x, minX, maxX),
        y: getMean(item.y, minY, maxY),
      };
    });
    list2 = list2.map((item: any) => {
      return {
        ...item,
        x: getMean(item.x, minX, maxX),
        y: getMean(item.y, minY, maxY),
      };
    });
    return {
      meanRandomList: list1,
      meanTestList: list2,
    };
  };

  // 1.计算距离
  const calculate = (randomList: any, x: any, y: any) => {
    let mylist = [...randomList];
    mylist.forEach((item) => {
      item.distance = getDistance(item.x, item.y, x, y);
    });
    return mylist;
  };

  // 4.获取分类最大的类型
  const getMaxType = (distanceList: any) => {
    // console.log("distanceList", distanceList);

    // 老方法：按出现频次算
    // const map = {};
    // distanceList.forEach((item) => {
    //   if (map[item.type]) {
    //     map[item.type]++;
    //   } else {
    //     map[item.type] = 1;
    //   }
    // });
    // let maxType = "";
    // let max = 0;
    // Object.keys(map).forEach((item) => {
    //   if (map[item] > max) {
    //     max = map[item];
    //     maxType = item;
    //   }
    // });
    // // console.log("map", map);
    // return maxType;

    // 优化方法，按距离权重
    const map: any = {};
    distanceList.forEach((item: any) => {
      if (map[item.type]) {
        map[item.type] += 1 / (item.distance + 1);
      } else {
        map[item.type] = 1 / (item.distance + 1);
      }
    });
    let maxType = "";
    let max = 0;
    Object.keys(map).forEach((item) => {
      if (map[item] > max) {
        max = map[item];
        maxType = item;
      }
    });
    return maxType;
  };

  const knn = (list: any, k: any, x: any, y: any) => {
    // 1.计算训练数据到每个点的距离
    let allDistanceList = calculate(list, x, y);

    // 2.按照距离升序排序
    allDistanceList.sort((a, b) => {
      return a.distance - b.distance;
    });

    // 3.获取前 k 个距离最近的点
    const distanceList = allDistanceList.splice(0, k);

    // 4.计算出现频率获取最大分类
    return getMaxType(distanceList);
  };

  useEffect(() => {
    setRandom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 训练集
  const [randomList, setRandomList] = useState([]);
  const setRandom = () => {
    let list: any = getRandomList();
    setRandomList(list);
    console.log("训练数据", randomList);
  };

  // 测试数据
  const [testList, setTestList] = useState<any>([
    {
      x: 2,
      y: 2,
    },
    {
      x: 2,
      y: 10,
    },
    {
      x: 50,
      y: 5,
    },
    {
      x: 99,
      y: 2,
    },
    {
      x: 99,
      y: 9,
    },
  ]);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const addTestList = () => {
    const list = [
      ...testList,
      {
        x,
        y,
      },
    ];
    setTestList(list);
  };

  // 渲染点状图
  useEffect(() => {
    if (randomList.length !== 0 && testList.length !== 0) {
      main();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomList, testList]);

  const [k, setK] = useState(0)
  const main = () => {
    const myTestList: any = [...testList];
    console.log("测试数据", myTestList);

    // 训练数据和测试数据归一化
    const { meanRandomList, meanTestList } = getMeanList(
      randomList,
      myTestList
    );
    console.log("归一化后的训练数据", meanRandomList);
    console.log("归一化后的测试数据", meanTestList);

    // 用训练数据交叉验证获取 k 值
    const k = testBestK(meanRandomList);
    setK(k)
    console.log("用训练数据交叉验证得到的 k 值", k);

    console.log("用 knn 计算到每个点的距离，返回权重最大的分类：");
    meanTestList.forEach((item: any, index: any) => {
      const type = knn(meanRandomList, k, item.x, item.y);
      myTestList[index].type = type;
      console.log(`[${myTestList[index].x}, ${myTestList[index].y}]: ${type}`);
    });

    initRing(randomList, myTestList);
    console.log('------------------------------------')
  };

  return (
    <div className={styles.video}>
      <div className={styles.lookTab}>
        <input
          className={styles.inputTest}
          type="text"
          value={x}
          onChange={(e: any) => {
            setX(e.target.value);
          }}
        />
        <input
          className={styles.inputTest}
          type="text"
          value={y}
          onChange={(e: any) => {
            setY(e.target.value);
          }}
        />
        <button
          className={styles.button}
          onClick={() => {
            addTestList();
          }}
        >
          加入测试数据
        </button>
        <input
          className={styles.inputTest}
          type="text"
          value={count}
          onChange={(e: any) => {
            setCount(e.target.value);
          }}
        />
        <button
          className={styles.button}
          onClick={() => {
            setRandom();
          }}
        >
          刷新训练数据
        </button>
        <div>交叉验证后的 K 值：{k}</div>
        {/* <div>训练数据: {JSON.stringify(randomList)}</div>
        <div>测试数据: {JSON.stringify(testList)}</div> */}
      </div>
      <div className={styles.ringBox}>
        <div ref={ring} className={styles.ring}></div>
      </div>
    </div>
  );
};

export default Knn;
