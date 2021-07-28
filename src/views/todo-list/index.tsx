import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Modal, Form, message } from "antd";
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

enum TodoStatus {
    todo = 0,
    done = 1,
    pool = 2,
}

const TodoList: React.FC = () => {
    const getTodo = async (type: "todo" | "done" | "pool") => {
        const req = {
            status: TodoStatus[type],
        };
        const res = await getTodoList(req);
        if (res) {
            type === "todo" && setTodoMap(formatArrayToTimeMap(res.data));
            type === "done" && setDoneMap(formatArrayToTimeMap(res.data));
            type === "pool" && setPoolMap(formatArrayToTimeMap(res.data));
        } else {
            message.error("获取 todolist 失败");
        }
    };

    useEffect(() => {
        getTodo("todo");
        getTodo("done");
        getTodo("pool");
    }, []);

    // 两种列表
    const [todoMap, setTodoMap] = useState({});
    const [doneMap, setDoneMap] = useState({});
    const [poolMap, setPoolMap] = useState({});
    // 编辑相关
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [editedTodo, setEditedTodo] = useState<todoItem>();

    const handleAdd = (title: "待办" | "待办池") => {
        setEditedTodo(undefined);
        setIsEdit(false);
        form.setFieldsValue({
            time: moment(),
            status: title === "待办" ? TodoStatus.todo : TodoStatus.pool,
        });
        setShowEdit(true);
    };

    const handleEdit = (item: todoItem) => {
        setEditedTodo(item);
        setIsEdit(true);
        form.setFieldsValue({
            name: item.name,
            time: moment(item.time),
            status: Number(item.status),
        });
        setShowEdit(true);
    };

    const addTodo = async () => {
        const formData = form.getFieldsValue();
        const req = {
            name: formData.name,
            time: moment(formData.time).format("YYYY-MM-DD"),
            status: formData.status,
        };
        const res = await addTodoItem(req);
        if (res) {
            message.success(res.message);
            setShowEdit(false);
            getTodo("todo");
            getTodo("done");
            getTodo("pool");
            form.resetFields();
        } else {
            message.error("新增 todo 失败");
        }
    };

    const editTodo = async () => {
        const formData = form.getFieldsValue();
        const req = {
            todo_id: editedTodo?.todo_id,
            name: formData.name,
            time: moment(formData.time).format("YYYY-MM-DD"),
            status: formData.status,
        };
        const res = await editTodoItem(req);
        if (res) {
            message.success(res.message);
            setShowEdit(false);
            getTodo("todo");
            getTodo("done");
            getTodo("pool");
            form.resetFields();
        } else {
            message.error("编辑 todo 失败");
        }
    };

    const [form] = Form.useForm();
    const listMap: any = {
        待办: todoMap,
        已完成: doneMap,
        待办池: poolMap,
    };

    return (
        <div className={styles.todoList}>
            {["待办池", "待办", "已完成"].map((item) => (
                <List
                    getTodo={getTodo}
                    title={item}
                    mapList={listMap[item]}
                    handleAdd={handleAdd}
                    handleEdit={handleEdit}
                />
            ))}
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
