import React, { CSSProperties } from "react";
import styles from "./index.module.scss";
import { message, Popconfirm, Tooltip } from "antd";
import { CheckCircleOutlined, SendOutlined } from "@ant-design/icons";
import { doneTodoItem } from "@/client/TodoListHelper";
import { TodoItemType, TodoStatus } from "../../types";
import TodoItemName from "./todo-item-name";
import TodoChainIcon from "../todo-chain-icon";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../rematch";

export interface TodoItemProps {
    item: TodoItemType;
    isShowPointIcon?: boolean; // 展示 point 的 icon
    showDoneIcon?: boolean; // 控制已完成按钮
    isShowTime?: boolean; // 是否展示时间
    isShowTimeRange?: boolean; // 是否展示距离今天的范围
    isChain?: boolean;
    isChainNext?: boolean; // 是否是后续任务
    keyword?: string;
    style?: CSSProperties;
    onlyShow?: boolean;
    onClick?: (
        item: TodoItemType,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => void;
}

// 单条 todo 的渲染
const TodoItem: React.FC<TodoItemProps> = (props) => {
    const {
        item,
        isShowPointIcon = false,
        showDoneIcon = false,
        isShowTime = false,
        isShowTimeRange = false,
        isChain = false,
        isChainNext = false,
        keyword = "",
        style = {},
        onlyShow = false,
        onClick,
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
                        style={style}
                        keyword={keyword}
                        onlyShow={onlyShow}
                        onClick={onClick}
                    />
                    <TodoChainIcon
                        item={item}
                        isChain={isChain}
                        isChainNext={isChainNext}
                    />
                    {isShowPointIcon && (
                        <span style={{ transform: "rotate(180deg)" }}>
                            <SendOutlined
                                className={`${styles.rotateX} ${styles.doneIcon}`}
                                style={{ color: "#00d4d8" }}
                                title="当前 chain todo"
                            />
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default TodoItem;
