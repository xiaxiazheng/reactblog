import React, { CSSProperties, useContext } from "react";
import styles from "./index.module.scss";
import { message, Popconfirm, Tooltip } from "antd";
import { CheckCircleOutlined, PlayCircleOutlined, SendOutlined } from "@ant-design/icons";
import { doneTodoItem, editTodoItem } from "@/client/TodoListHelper";
import { TodoItemType, TodoStatus } from "../../types";
import TodoItemName from "./todo-item-name";
import TodoChainIcon from "../todo-chain-icon";
import TodoHabitIcon from "../todo-habit-icon";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../rematch";

interface Props {
    item: TodoItemType;
    isShowPointIcon?: boolean; // 展示 point 的 icon
    showDoneIcon?: boolean; // 控制已完成按钮
    isShowTime?: boolean; // 是否展示时间
    isShowTimeRange?: boolean; // 是否展示距离今天的范围
    isChain?: boolean;
    isChainNext?: boolean; // 是否是后续任务
    isModalOrDrawer?: boolean; // 是否是 modal 或 drawer 里展示的 todo
    style?: CSSProperties;
}

// 单条 todo 的渲染
const TodoItem: React.FC<Props> = (props) => {
    const {
        item,
        isShowPointIcon = false,
        showDoneIcon = false,
        isShowTime = false,
        isShowTimeRange = false,
        isChain = false,
        isChainNext = false,
        isModalOrDrawer = false,
        style = {},
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

    return (
        <div key={item.todo_id}>
            <div className={styles.item}>
                <span>
                    {isShowPointIcon && (
                        <SendOutlined
                            className={`${styles.rotateX} ${styles.doneIcon}`}
                            style={{ color: "#00d4d8" }}
                            title="当前 chain todo"
                        />
                    )}
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
                        isShowTime={isChain || isShowTime}
                        isShowTimeRange={isShowTimeRange}
                        isModalOrDrawer={isModalOrDrawer}
                        style={style}
                    />
                    <TodoChainIcon
                        item={item}
                        isChain={isChain}
                        isChainNext={isChainNext}
                    />
                    <TodoHabitIcon item={item} />
                </span>
            </div>
        </div>
    );
};

export default TodoItem;
