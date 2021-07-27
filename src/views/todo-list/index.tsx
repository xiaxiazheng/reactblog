import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Button, Popconfirm } from "antd";
// import { FileDoneOutlined } from

interface mapList {
  todo_id?: string;
  time: string;
  name: string;
}

const formatData = (list: any[]) => {
  return list.reduce((prev, cur) => {
    prev[cur.time] =
      typeof prev[cur.time] === "undefined"
        ? [cur]
        : prev[cur.time].concat(cur);
    return prev;
  }, {});
};

const TodoList: React.FC = () => {
  const getTodo = (type: "todo" | "done") => {
    const res1: mapList[] = [
      { time: "2021-07-21", name: "123" },
      { time: "2021-07-21", name: "1234" },
      { time: "2021-07-22", name: "1235" },
      { time: "2021-07-22", name: "1235" },
      { time: "2021-07-22", name: "1235" },
      { time: "2021-07-23", name: "1235" },
      { time: "2021-07-23", name: "1235" },
      { time: "2021-07-23", name: "1235" },
      { time: "2021-07-23", name: "1235" },
    ];
    const res2: mapList[] = [
      { time: "2021-07-21", name: "123" },
      { time: "2021-07-21", name: "1234" },
      { time: "2021-07-22", name: "1235" },
      { time: "2021-07-22", name: "1235" },
      { time: "2021-07-22", name: "1235" },
      { time: "2021-07-23", name: "1235" },
      { time: "2021-07-23", name: "1235" },
      { time: "2021-07-23", name: "1235" },
      { time: "2021-07-23", name: "1235" },
    ];
    type === "todo" && setTodoMap(formatData(res1));
    type === "done" && setDoneMap(formatData(res2));
  };

  useEffect(() => {
    getTodo("todo");
    getTodo("done");
  }, []);

  const List = (props: any) => {
    const { title, mapList } = props;

    const addTodo = () => {};

    const doneTodo = (todo_id: string) => {};

    const deleteTodo = (todo_id: string) => {};

    return (
      <div className={styles.list}>
        <div className={styles.header}>
          <span>{title}</span>
          <Button onClick={() => addTodo()}>新增</Button>
        </div>
        {Object.keys(mapList).map((time) => {
          return (
            <div className={styles.oneDay} key={time}>
              <div className={styles.time}>{time}</div>
              {mapList[time].map((item: any, index: number) => {
                return (
                  <div className={styles.item} key={index}>
                    <span>
                      <Popconfirm
                        title="确认已完成吗？"
                        onConfirm={() => doneTodo(item.todo_id)}
                        // onCancel={() => {})}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="text">完成</Button>
                        {/* <FileDoneOutlined /> */}
                      </Popconfirm>
                      <span className={styles.name}>{item.name}</span>
                    </span>
                    <span>
                      <Button type="text">编辑</Button>
                      <Popconfirm
                        title="确认要删除吗？"
                        onConfirm={() => deleteTodo(item.todo_id)}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="text">删除</Button>
                      </Popconfirm>
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const [todoMap, setTodoMap] = useState([]);
  const [doneMap, setDoneMap] = useState([]);

  return (
    <div className={styles.todoList}>
      <List title="代办" mapList={todoMap} />
      <List title="已完成" mapList={doneMap} />
    </div>
  );
};

export default TodoList;
