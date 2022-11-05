import React, { useState } from "react";
import styles from "./index.module.scss";
import { message, Popconfirm, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    DownCircleOutlined,
    UpCircleOutlined,
} from "@ant-design/icons";
import { doneTodoItem } from "@/client/TodoListHelper";
import { StatusType, TodoItemType, TodoStatus } from "../../types";
import NameWrapper from "./todo-item-name";

interface Props {
    item: TodoItemType;
    getTodo: (type: StatusType) => void;
    handleEdit: Function;
    refreshData: Function;
    showDoneIcon?: boolean;
    getParentTodo: (parent_todo_id: string) => void;
    isTrainParent?: boolean;
    isTrainChild?: boolean;
}

// 单条 todo 的渲染
const TodoItem: React.FC<Props> = (props) => {
    const {
        item,
        getTodo,
        handleEdit,
        refreshData,
        showDoneIcon,
        getParentTodo,
        isTrainParent = false,
        isTrainChild = false,
    } = props;

    // 完成 todo（只有待办才能触发这个函数）
    const doneTodo = async (todo_id: string) => {
        const req = {
            todo_id,
        };
        const res = await doneTodoItem(req);
        if (res) {
            message.success(res.message);
            getTodo("done");
            getTodo("todo");
        } else {
            message.error("完成 todo 失败");
        }
    };

    const isHasChild =
        item?.child_todo_list && item?.child_todo_list.length !== 0;

    return (
        <div key={item.todo_id}>
            <div className={styles.item}>
                <span>
                    {showDoneIcon && item.status == TodoStatus.todo && (
                        <Popconfirm
                            title="确认已完成吗？"
                            onConfirm={() => {
                                doneTodo(item.todo_id || "");
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Tooltip title={"点击完成"} color="#20d420">
                                <CheckCircleOutlined
                                    title="完成"
                                    className={styles.doneIcon}
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}
                    <NameWrapper
                        item={item}
                        handleEdit={handleEdit}
                        refreshData={refreshData}
                    />
                    {item?.other_id && !isTrainChild && (
                        <Tooltip title={"查看前置 todo 的所有后续 todo"}>
                            <UpCircleOutlined
                                className={styles.progressIcon}
                                style={{
                                    color: "#40a9ff",
                                }}
                                title="查看前置 todo 所有后续 todo"
                                onClick={() =>
                                    getParentTodo(item?.other_id || "")
                                }
                            />
                        </Tooltip>
                    )}
                    {isHasChild && !isTrainParent && (
                        <Tooltip title={"查看后续 todo"}>
                            <DownCircleOutlined
                                className={styles.progressIcon}
                                style={{
                                    color: "#40a9ff",
                                }}
                                title="查看后续 todo"
                                onClick={() => {
                                    getParentTodo(item.todo_id);
                                }}
                            />
                        </Tooltip>
                    )}
                </span>
            </div>
        </div>
    );
};

export default TodoItem;
