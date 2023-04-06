import React, { useContext } from "react";
import styles from "./index.module.scss";
import { message, Popconfirm, Tooltip } from "antd";
import { CheckCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { doneTodoItem, editTodoItem } from "@/client/TodoListHelper";
import { TodoItemType, TodoStatus } from "../../types";
import TodoItemName from "./todo-item-name";
import dayjs from "dayjs";
import TodoChainIcon from "../todo-chain-icon";
import TodoPunchTheClockIcon from "../todo-punch-the-clock-icon";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../rematch";

interface Props {
    item: TodoItemType;
    showDoneIcon?: boolean; // 控制已完成按钮
    isShowTime?: boolean; // 是否展示时间
    isChain?: boolean;
    isChainNext?: boolean; // 是否是后续任务
    isModalOrDrawer?: boolean; // 是否是 modal 或 drawer 里展示的 todo
}

// 单条 todo 的渲染
const TodoItem: React.FC<Props> = (props) => {
    const {
        item,
        showDoneIcon,
        isShowTime = false,
        isChain = false,
        isChainNext = false,
        isModalOrDrawer = false,
    } = props;

    const dispatch = useDispatch<Dispatch>();
    const { getTodo } = dispatch.data;

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
                        isShowTime={isChain || isShowTime}
                        isModalOrDrawer={isModalOrDrawer}
                    />
                    <TodoChainIcon
                        item={item}
                        isChain={isChain}
                        isChainNext={isChainNext}
                    />
                    <TodoPunchTheClockIcon item={item} />
                </span>
            </div>
        </div>
    );
};

export default TodoItem;
