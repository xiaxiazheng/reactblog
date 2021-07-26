import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

interface mapList {
  [k: string]: {
    id: string;
    time: string;
  }[];
}

const TodoList: React.FC = () => {
  const List = (props: any) => {
    const { title, mapList } = props;

    return (
      <div className={styles.list}>
        <div>
          <span>{title}</span>
          <span>新增</span>
        </div>
        {Object.keys(mapList).map((key) => {
          return (
            <div>
              <div>{key}</div>
              {mapList[key].map((item: any) => {
                return (
                  <div>
                    <span>
                      <span>完成</span>
                      <span>{item.name}</span>
                    </span>
                    <span>编辑，删除</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const getTodo = (type: "todo" | "done") => {
    const res: any[] = [];
    const map = res.reduce((prev, cur) => {
      prev[cur.time] =
        typeof prev[cur.time] === "undefined"
          ? [cur]
          : prev[cur.time].concat(cur);
      return prev;
    }, {});
    type === "todo" && setTodoMap(map);
    type === "done" && setDoneMap(map);
  };

  useEffect(() => {
    getTodo("todo");
    getTodo("done");
  }, []);

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
