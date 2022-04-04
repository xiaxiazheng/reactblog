import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { Modal, Form, message } from "antd";
import { formatArrayToTimeMap } from "./utils";
import List from "./list";
import DoneList from "./done-list";
import PoolList from "./pool-list";
import moment from "moment";
import TodoForm from "./component/todo-form";
import {
    getTodoList,
    addTodoItem,
    editTodoItem,
} from "@/client/TodoListHelper";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import DragModal from "./component/drag-modal";
import TodoImage from "./component/todo-image";
import { TodoItemType, StatusType, TodoStatus } from "./types";

const TodoStatusList: StatusType[] = ["todo", "done", "pool"];

type OperType = "add" | "edit" | "copy" | "add_progress";
const titleMap = {
    add: "新增",
    edit: "编辑",
    copy: "复制",
    add_progress: "新增进度",
};

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
    const [operType, setOperType] = useState<OperType>();
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

    const handleAddProgress = (item: TodoItemType) => {
        setEditedTodo(item);
        setOperType("add_progress");
        form.setFieldsValue({
            name: item.name,
            description: item.description,
            time: moment(item.time),
            status: Number(item.status),
            color: item.color,
            category: item.category,
            other_id: item.todo_id,
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
            other_id: item.other_id,
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
            other_id: item.other_id,
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
                other_id: formData.other_id || "",
            };
            const res = await addTodoItem(req);
            if (res) {
                message.success(res.message);
                refreshData();
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
                other_id: formData.other_id || "",
            };
            const res = await editTodoItem(req);
            if (res) {
                message.success(res.message);
                refreshData();
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

    const refreshData = () => {
        getTodo("todo");
        getTodo("done");
        getTodo("pool");
    };

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
                handleAddProgress={handleAddProgress}
                refreshData={refreshData}
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
                handleAddProgress={handleAddProgress}
                refreshData={refreshData}
            />
            {/* 已完成 */}
            <DoneList
                title="已完成"
                handleEdit={handleEdit}
                handleCopy={handleCopy}
                isRefreshDone={isRefreshDone}
                setIsRefreshDone={setIsRefreshDone}
                refreshData={refreshData}
            />
            {/* 新增/编辑 todo */}
            <DragModal
                title={`${titleMap[operType || "add"]} todo`}
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
                        refreshData={refreshData}
                        activeTodo={editedTodo}
                    />
                )}
            </DragModal>
        </div>
    );
};

export default TodoList;
