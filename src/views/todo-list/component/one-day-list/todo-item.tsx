import React, { useState } from "react";
import styles from "./index.module.scss";
import { message, Popconfirm, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    PlayCircleOutlined,
    SwapLeftOutlined,
    SwapOutlined,
    SwapRightOutlined,
} from "@ant-design/icons";
import { doneTodoItem, editTodoItem } from "@/client/TodoListHelper";
import { StatusType, TodoItemType, TodoStatus } from "../../types";
import TodoItemName from "./todo-item-name";
import dayjs from "dayjs";

interface Props {
    item: TodoItemType;
    getTodo: (type: StatusType) => void;
    handleEdit: Function;
    refreshData: Function;
    showDoneIcon?: boolean; // 控制已完成按钮
    isChain?: boolean;
    isChainNext?: boolean; // 是否是后续任务
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
        isChain = false,
        isChainNext = false,
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

    // 现在做这个 todo (只有待办池才能触发这个函数)
    const doItNow = async (item: TodoItemType) => {
        const req = {
            ...item,
            isNote: item.isNote || "0",
            isTarget: item.isTarget || "0",
            isBookMark: item.isBookMark || "0",
            status: TodoStatus.todo,
            time: dayjs().format("YYYY-MM-DD"),
        };
        const res = await editTodoItem(req);
        if (res) {
            message.success(res.message);
            getTodo("pool");
            getTodo("todo");
        } else {
            message.error("修改 todo 失败");
        }
    };

    const isHasChild = item?.child_todo_list_length !== 0;

    const Icon = () => {
        // 在 todo 链路的展示中，前置的就不看了（因为已经找全了）
        const isUp = item?.other_id && !isChain;
        // 非后续的任务，如果少于一条也不看了，因为也已经找全了；后续任务有后续的还是得看的
        const isDown = (() => {
            if (!isChain || isChainNext) {
                return isHasChild;
            } else {
                return isHasChild && item?.child_todo_list_length > 1;
            }
        })();

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
                    isDown ? `(后置任务数 ${item?.child_todo_list_length})` : ""
                }`}
            >
                <Comp
                    className={styles.progressIcon}
                    style={{
                        color: "#40a9ff",
                    }}
                    title="查看 todo 链"
                    onClick={() => {
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
                    {showDoneIcon && item.status == TodoStatus.pool && (
                        <Tooltip
                            title={"现在就做！"}
                            color="#20d420"
                            placement="topLeft"
                        >
                            <PlayCircleOutlined
                                title="现在就做！"
                                className={styles.doneIcon}
                                onClick={() => doItNow(item)}
                            />
                        </Tooltip>
                    )}
                    <TodoItemName
                        item={item}
                        handleEdit={handleEdit}
                        refreshData={refreshData}
                        isChain={isChain}
                    />
                    <Icon />
                </span>
            </div>
        </div>
    );
};

export default TodoItem;
