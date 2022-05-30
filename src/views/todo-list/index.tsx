import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { Modal, Form, message } from "antd";
import { colorMap, formatArrayToTimeMap } from "./utils";
import List from "./list";
import DoneList from "./done-list";
import PoolList from "./pool-list";
import moment from "moment";
import TodoForm from "./component/todo-form";
import {
    getTodoList,
    addTodoItem,
    editTodoItem,
    deleteTodoItem,
} from "@/client/TodoListHelper";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import EditTodoModal from "./component/edit-todo-modal";
import TodoImage from "./component/todo-image";
import { TodoItemType, StatusType, TodoStatus, OperatorType } from "./types";

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
                    setTodoList(res.data);
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
    const [todoList, setTodoList] = useState([]);
    const [poolList, setPoolList] = useState([]);
    // 编辑相关
    const [operatorType, setOperatorType] = useState<OperatorType>();
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();

    const handleAdd = () => {
        setActiveTodo(undefined);
        setOperatorType("add");
        form.setFieldsValue({
            time: moment(),
            status: TodoStatus.todo,
            color: "3",
            category: "其他",
        });
        setShowEdit(true);
    };

    const handleEdit = (item: TodoItemType) => {
        setActiveTodo(item);
        setOperatorType("edit");
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

    const [form] = Form.useForm();

    const refreshData = () => {
        getTodo("todo");
        getTodo("done");
        getTodo("pool");
    };

    return (
        <div className={styles.todoList}>
            <div className={styles.Layout}>
                {/* 待办池 */}
                <div className={`${styles.box1} ScrollBar`}>
                    <List
                        loading={poolLoading}
                        getTodo={getTodo}
                        title="待办池"
                        mapList={formatArrayToTimeMap(
                            poolList.filter(
                                (item: any) =>
                                    item.color !== "-1" && item.color !== "-2"
                            )
                        )}
                        handleEdit={handleEdit}
                        refreshData={refreshData}
                    />
                </div>
                {/* 待办 */}
                <div className={`${styles.box2} ScrollBar`}>
                    <List
                        loading={todoLoading}
                        getTodo={getTodo}
                        title="今日待办"
                        mapList={formatArrayToTimeMap(todoList)}
                        handleAdd={handleAdd}
                        handleEdit={handleEdit}
                        refreshData={refreshData}
                        showRefresh={true}
                    />
                </div>
                {/* 已完成 */}
                <div className={`${styles.box3} ScrollBar`}>
                    <DoneList
                        title="已完成"
                        handleEdit={handleEdit}
                        isRefreshDone={isRefreshDone}
                        setIsRefreshDone={setIsRefreshDone}
                        refreshData={refreshData}
                    />
                </div>
                {/* 短期目标 */}
                <div className={`${styles.box4} ScrollBar`}>
                    <PoolList
                        loading={poolLoading}
                        getTodo={getTodo}
                        title="短期目标"
                        mapList={poolList.filter(
                            (item: any) => item.color === "-2"
                        )}
                        handleEdit={handleEdit}
                        refreshData={refreshData}
                    />
                </div>
                {/* 长期方向 */}
                <div className={`${styles.box5} ScrollBar`}>
                    <PoolList
                        loading={poolLoading}
                        getTodo={getTodo}
                        title="长期方向"
                        mapList={poolList.filter(
                            (item: any) => item.color === "-1"
                        )}
                        handleEdit={handleEdit}
                        refreshData={refreshData}
                    />
                </div>
            </div>
            {/* 新增/编辑 todo */}
            <EditTodoModal
                type={operatorType || "add"}
                setType={setOperatorType}
                visible={showEdit}
                onClose={() => {
                    setActiveTodo(undefined);
                    setShowEdit(false);
                    form.resetFields();
                }}
                activeTodo={activeTodo}
                setActiveTodo={setActiveTodo}
                form={form}
                refreshData={refreshData}
            />
        </div>
    );
};

export default TodoList;
