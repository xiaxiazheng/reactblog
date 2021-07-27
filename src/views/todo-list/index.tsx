import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Modal, Form } from "antd";
import { formatArrayToTimeMap } from "./utils";
import List from "./list";
import moment from "moment";
import TodoForm from "./todo-form";
import {
  getTodoList,
  addTodoItem,
  editTodoItem,
} from "@/client/TodoListHelper";

export interface todoItem {
  todo_id?: string;
  time: string;
  name: string;
  status: number | string;
}

const TodoList: React.FC = () => {
  const getTodo = async (type: "todo" | "done") => {
    const req = {};
    // const res = await getTodoList(req);

    const res1: todoItem[] = [
      { time: "2021-07-21", name: "123", status: 0 },
      { time: "2021-07-21", name: "1234", status: 0 },
      { time: "2021-07-22", name: "1235", status: 0 },
      { time: "2021-07-22", name: "1235", status: 0 },
      { time: "2021-07-22", name: "1235", status: 0 },
      { time: "2021-07-23", name: "1235", status: 0 },
      { time: "2021-07-23", name: "1235", status: 0 },
      { time: "2021-07-23", name: "1235", status: 0 },
      { time: "2021-07-23", name: "1235", status: 0 },
    ];
    const res2: todoItem[] = [
      { time: "2021-07-21", name: "123", status: 1 },
      { time: "2021-07-21", name: "1234", status: 1 },
      { time: "2021-07-22", name: "1235", status: 1 },
      { time: "2021-07-22", name: "1235", status: 1 },
      { time: "2021-07-22", name: "1235", status: 1 },
      { time: "2021-07-23", name: "1235", status: 1 },
      { time: "2021-07-23", name: "1235", status: 1 },
      { time: "2021-07-23", name: "1235", status: 1 },
      { time: "2021-07-23", name: "1235", status: 1 },
    ];
    type === "todo" && setTodoMap(formatArrayToTimeMap(res1));
    type === "done" && setDoneMap(formatArrayToTimeMap(res2));
  };

  useEffect(() => {
    getTodo("todo");
    getTodo("done");
  }, []);

  // 两种列表
  const [todoMap, setTodoMap] = useState({});
  const [doneMap, setDoneMap] = useState({});
  // 编辑相关
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editedTodo, setEditedTodo] = useState<todoItem>();

  const handleAdd = () => {
    setEditedTodo(undefined);
    setIsEdit(false);
    form.setFieldsValue({
      time: moment(),
      status: 0,
    });
    setShowEdit(true);
  };

  const handleEdit = (item: todoItem) => {
    setEditedTodo(item);
    setIsEdit(true);
    form.setFieldsValue({
      name: item.name,
      time: moment(item.time),
      status: item.status,
    });
    setShowEdit(true);
  };

  const addTodo = async () => {
    const req = {
      ...form.getFieldsValue(),
    };
    const res = await addTodoItem(req);
    setShowEdit(false);
  };

  const editTodo = async () => {
    const req = {
      todo_id: editedTodo,
      ...form.getFieldsValue(),
    };
    const res = await editTodoItem(req);
    setShowEdit(false);
  };

  const [form] = Form.useForm();

  return (
    <div className={styles.todoList}>
      <List
        getTodo={getTodo}
        title="代办"
        mapList={todoMap}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
      />
      <List
        getTodo={getTodo}
        title="已完成"
        mapList={doneMap}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
      />
      {/* 新增/编辑 todo */}
      <Modal
        title={`${isEdit ? "编辑" : "新增"} todo`}
        visible={showEdit}
        onOk={isEdit ? editTodo : addTodo}
        onCancel={() => {
          setEditedTodo(undefined);
          setShowEdit(false);
          form.resetFields();
        }}
      >
        <TodoForm form={form} />
      </Modal>
    </div>
  );
};

export default TodoList;
