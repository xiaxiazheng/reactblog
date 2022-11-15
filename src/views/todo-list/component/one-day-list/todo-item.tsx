import React, { useState } from "react";
import styles from "./index.module.scss";
import { message, Popconfirm, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    SwapLeftOutlined,
    SwapOutlined,
    SwapRightOutlined,
} from "@ant-design/icons";
import { doneTodoItem } from "@/client/TodoListHelper";
import { StatusType, TodoItemType, TodoStatus } from "../../types";
import TodoItemName from "./todo-item-name";

interface Props {
    item: TodoItemType;
    getTodo: (type: StatusType) => void;
    handleEdit: Function;
    refreshData: Function;
    showDoneIcon?: boolean;
    showTodoChain: (todo_id: string) => void;
}

// 单条 todo 的渲染
const TodoItem: React.FC<Props> = (props) => {
    const {
        item,
        getTodo,
        handleEdit,
        refreshData,
        showDoneIcon,
        showTodoChain,
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

    const Icon = () => {
        const isUp = item?.other_id;
        const isDown = isHasChild;

        if (!isUp && !isDown) {
            return null;
        }
        let Comp: any;

        if (isUp && isDown) {
            Comp = SwapOutlined;
        } else if (isUp) {
            Comp = SwapLeftOutlined;
        } else {
            Comp = SwapRightOutlined;
        }

        return (
            <Tooltip
                title={`查看 todo 链 ${
                    isDown
                        ? `(后置任务数 ${item?.child_todo_list.length})`
                        : ""
                }`}
            >
                <Comp
                    className={styles.progressIcon}
                    style={{
                        color: "#40a9ff",
                    }}
                    title="查看 todo 链"
                    onClick={() => {
                        console.log(item);
                        showTodoChain(item.todo_id);
                    }}
                />
            </Tooltip>
        );
    };

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
                    <TodoItemName
                        item={item}
                        handleEdit={handleEdit}
                        refreshData={refreshData}
                    />
                    <Icon />
                </span>
            </div>
        </div>
    );
};

export default TodoItem;
