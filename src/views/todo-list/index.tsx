import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { Modal, Form, message } from "antd";
import { formatArrayToTimeMap } from "./utils";
import List from "./list";
import DoneList from "./done-list";
import PoolList from "./pool-list";
import moment from "moment";
import TodoForm from "./todo-form";
import {
    getTodoList,
    addTodoItem,
    editTodoItem,
} from "@/client/TodoListHelper";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import DragModal from "./component/drag-modal";
import TodoImage from "./todo-image";
import { TodoItemType, StatusType, TodoStatus } from "./types";

const TodoStatusList: StatusType[] = ["todo", "done", "pool"];

const TodoList: React.FC = () => {
    useDocumentTitle("todo-list");

    const [todoLoading, setTodoLoading] = useState<boolean>(false);
    const [poolLoading, setPoolLoading] = useState<boolean>(false);

    const [isRefreshDone, setIsRefreshDone] = useState<boolean>(false);

    const getTodo = async (type: StatusType) => {
        if (type === "done") {
            setIsRefreshDone(true);
        } else {
            type === "todo" && setTodoLoading(true);
            type === "pool" && setPoolLoading(true);

            const req: any = {
                status: TodoStatus[type],
            };

            const res = await getTodoList(req);
            if (res) {
                if (type === "todo") {
                    setTodoMap(formatArrayToTimeMap(res.data));
                    setTodoLoading(false);
                }
                if (type === "pool") {
                    setPoolList(res.data);
                    setPoolLoading(false);
                }
            } else {
                message.error("获取 todolist 失败");
            }
        }
    };

    useEffect(() => {
        getTodo("todo");
        getTodo("done");
        getTodo("pool");
    }, []);

    // 两种列表
    const [todoMap, setTodoMap] = useState({});
    const [poolList, setPoolList] = useState([]);
    // 编辑相关
    const [operType, setOperType] = useState<"add" | "edit" | "copy">();
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [editedTodo, setEditedTodo] = useState<TodoItemType>();

    const handleAdd = (title: "待办" | "待办池") => {
        setEditedTodo(undefined);
        setOperType("add");
        form.setFieldsValue({
            time: moment(),
            status: title === "待办" ? TodoStatus.todo : TodoStatus.pool,
            color: "3",
            category: "其他",
        });
        setShowEdit(true);
    };

    const handleCopy = (item: TodoItemType) => {
        setEditedTodo(item);
        setOperType("copy");
        form.setFieldsValue({
            name: item.name,
            description: item.description,
            time: moment(item.time),
            status: Number(item.status),
            color: item.color,
            category: item.category,
        });
        setShowEdit(true);
    };

    const handleEdit = (item: TodoItemType) => {
        setEditedTodo(item);
        setOperType("edit");
        form.setFieldsValue({
            name: item.name,
            description: item.description,
            time: moment(item.time),
            status: Number(item.status),
            color: item.color,
            category: item.category,
        });
        setShowEdit(true);
    };

    const addTodo = async () => {
        try {
            await form.validateFields();
            const formData = form.getFieldsValue();
            const req = {
                name: formData.name,
                time: moment(formData.time).format("YYYY-MM-DD"),
                status: formData.status,
                description: formData.description || "",
                color: formData.color,
                category: formData.category,
            };
            const res = await addTodoItem(req);
            if (res) {
                message.success(res.message);
                // 新增的话只用更新新增到的那列
                getTodo(TodoStatusList[Number(formData.status)]);
                setEditedTodo(res.data.newTodoItem);
                setOperType("edit");
                return true;
            } else {
                message.error("新增 todo 失败");
            }
        } catch (err) {
            message.warning("请检查表单输入");
        }
        return false;
    };

    const editTodo = async () => {
        try {
            await form.validateFields();
            const formData = form.getFieldsValue();
            const req = {
                todo_id: editedTodo?.todo_id,
                name: formData.name,
                time: moment(formData.time).format("YYYY-MM-DD"),
                status: formData.status,
                description: formData.description || "",
                color: formData.color,
                category: formData.category,
            };
            const res = await editTodoItem(req);
            if (res) {
                message.success(res.message);
                // 变更到的状态那列绝对要更新
                getTodo(TodoStatusList[Number(formData.status)]);
                // 原本那列如果跟要变更到的那列不同那也要更新
                if (editedTodo?.status !== formData.status) {
                    getTodo(TodoStatusList[Number(editedTodo?.status)]);
                }
                return true;
            } else {
                message.error("编辑 todo 失败");
            }
        } catch (err) {
            message.warning("请检查表单输入");
        }
        return false;
    };

    const [form] = Form.useForm();

    return (
        <div className={styles.todoList}>
            {/* 待办池 */}
            <PoolList
                loading={poolLoading}
                getTodo={getTodo}
                title="待办池"
                mapList={poolList}
                handleAdd={handleAdd}
                handleEdit={handleEdit}
                handleCopy={handleCopy}
            />
            {/* 待办 */}
            <List
                loading={todoLoading}
                getTodo={getTodo}
                title="待办"
                mapList={todoMap}
                handleAdd={handleAdd}
                handleEdit={handleEdit}
                handleCopy={handleCopy}
            />
            {/* 已完成 */}
            <DoneList
                title="已完成"
                handleEdit={handleEdit}
                handleCopy={handleCopy}
                isRefreshDone={isRefreshDone}
                setIsRefreshDone={setIsRefreshDone}
            />
            {/* 新增/编辑 todo */}
            <DragModal
                title={`${
                    operType === "add"
                        ? "新增"
                        : operType === "edit"
                        ? "编辑"
                        : "复制"
                } todo`}
                visible={showEdit}
                onOk={operType === "edit" ? editTodo : addTodo}
                onCancel={() => {
                    setEditedTodo(undefined);
                    setShowEdit(false);
                    form.resetFields();
                }}
                width={650}
            >
                <TodoForm
                    form={form}
                    // 复制走的是新建的路子
                    onOk={operType === "edit" ? editTodo : addTodo}
                />
                {operType === "edit" && editedTodo && (
                    <TodoImage
                        refreshData={() => {
                            getTodo("todo");
                            getTodo("done");
                            getTodo("pool");
                        }}
                        activeTodo={editedTodo}
                    />
                )}
            </DragModal>
        </div>
    );
};

export default TodoList;
