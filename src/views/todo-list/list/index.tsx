import React from "react";
import { Button, message, Popconfirm } from "antd";
import {
  CheckCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { doneTodoItem, deleteTodoItem } from '@/client/TodoListHelper';

interface Props {
  title: "代办" | "已完成";
  mapList: any;
  getTodo: Function;
  handleAdd: Function;
  handleEdit: Function;
}

// 两个todo列表
const List: React.FC<Props> = (props) => {
  const {
    title,
    mapList,
    getTodo,
    handleAdd,
    handleEdit
  } = props;

  // 完成 todo
  const doneTodo = async (todo_id: string) => {
    const req = {
      todo_id,
    };
    const res = await doneTodoItem(req);
    if (res) {
      message.success(res.message);
      getTodo("todo");
      getTodo("done");
    } else {
      message.error('完成 todo 失败');
    }
  };

  // 删除 todo
  const deleteTodo = async (todo_id: string) => {
    const req = {
      todo_id,
    };
    const res = await deleteTodoItem(req);
    if (res) {
      message.success(res.message);
      title === "代办" && getTodo("todo");
      title === "已完成" && getTodo("done");
    } else {
      message.error('删除 todo 失败');
    }
  };

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <span>{title}</span>
        {title === "代办" && (
          <Button onClick={() => handleAdd()}>
            <PlusOutlined />
            todo
          </Button>
        )}
      </div>
      {Object.keys(mapList).map((time) => {
        return (
          <div className={styles.oneDay} key={time}>
            <div className={styles.time}>{time}</div>
            {mapList[time].map((item: any, index: number) => {
              return (
                <div className={styles.item} key={index}>
                  <span>
                    {title === "代办" && (
                      <Popconfirm
                        title="确认已完成吗？"
                        onConfirm={() => doneTodo(item.todo_id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="text" title="完成">
                          <CheckCircleOutlined className={styles.icon} />
                        </Button>
                      </Popconfirm>
                    )}
                    {title === "代办" ? (
                      <span className={styles.name}>{item.name}</span>
                    ) : (
                      <s className={styles.delete}>
                        <span className={styles.name}>{item.name}</span>
                      </s>
                    )}
                  </span>
                  <span>
                    <Button
                      type="text"
                      title="编辑"
                      onClick={handleEdit.bind(null, item)}
                    >
                      <EditOutlined className={styles.icon} />
                    </Button>
                    <Popconfirm
                      title="确认要删除吗？"
                      onConfirm={() => deleteTodo(item.todo_id)}
                      // onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="text" title="删除">
                        <DeleteOutlined className={styles.icon} />
                      </Button>
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

export default List;
