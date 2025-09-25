import React, { CSSProperties } from "react";
import styles from "./index.module.scss";
import { message, Popconfirm, Tooltip } from "antd";
import { CheckCircleOutlined, SendOutlined } from "@ant-design/icons";
import { doneTodoItem, TodoItem, TodoItemProps, TodoStatus, TodoItemType, TodoDescription } from "@xiaxiazheng/blog-libs";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../rematch";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import FileListBox from "@/components/file-image-handle/file-list-box";
import { TooltipPlacement } from "antd/lib/tooltip";
import TodoChainIconWeb from "../todo-chain-icon-web";

export interface TodoItemWebProps extends TodoItemProps {
    showPointIcon?: boolean; // 展示 point 的 icon
    showDoneIcon?: boolean; // 控制已完成按钮
    style?: CSSProperties;
    onlyShow?: boolean;
    beforeClick?: () => boolean;
    placement?: TooltipPlacement;
}

/** 基于 todo-item 的封装，加上了本项目特有的数据逻辑等 */
const TodoItemWeb: React.FC<TodoItemWebProps> = (props) => {
    const {
        showPointIcon = false,
        showDoneIcon = false,
        showTime = false,
        showTimeRange = false,
        ...rest
    } = props;
    const {
        item,
        keyword = "",
        style = {},
        onlyShow = false,
        onClick,
        beforeClick,
        placement,
    } = rest;

    const dispatch = useDispatch<Dispatch>();
    const { getTodo } = dispatch.data;

    // 进行 keyword 的合并
    const globalKkeyword = useSelector(
        (state: RootState) => state.filter.keyword
    );
    const finalKeyword = `${globalKkeyword} ${keyword}`;

    const handleEdit = (item: TodoItemType) => {
        if (beforeClick && !beforeClick()) {
            return;
        }
        const { setActiveTodo, setShowEdit, setOperatorType } = dispatch.edit;
        setActiveTodo(item);
        setShowEdit(true);
        setOperatorType("edit");
    };

    const isDone = item.status === String(TodoStatus.done);

    // 完成 todo（只有待办才能触发这个函数）
    const doneTodo = async (todo_id: string) => {
        const req = {
            todo_id,
        };
        const res = await doneTodoItem(req);
        if (res) {
            message.success(res.message);
            getTodo({ type: "done" });
            getTodo({ type: "todo" });
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
                    <TodoToolTipsWrapper
                        item={item}
                        placement={placement}
                        keyword={finalKeyword}
                    >
                        <div
                            className={styles.name}
                            onClick={(e) => {
                                if (onlyShow) return;
                                if (onClick) {
                                    onClick(item, e);
                                    return;
                                }
                                handleEdit(item);
                            }}
                        >
                            <TodoItem
                                item={item}
                                keyword={finalKeyword}
                                wrapperStyle={style}
                                showTime={showTime}
                                showTimeRange={showTimeRange}
                                showDoneStrinkLine={isDone}
                                showChainIcon={false}
                            />
                            {props.children}
                        </div>
                    </TodoToolTipsWrapper>
                    <TodoChainIconWeb item={item} />
                    {showPointIcon && (
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

/** 基于 todo-item 封装 */
const TodoToolTipsWrapper: React.FC<
    Pick<TodoItemWebProps, "item" | "placement" | "keyword">
> = (props) => {
    const { item, placement, keyword } = props;

    return item.description ||
        (item.imgList && item.imgList.length !== 0) ||
        (item.fileList && item.fileList.length !== 0) ? (
        <Tooltip
            overlayClassName={styles.tooltip}
            title={
                <>
                    <TodoDescription
                        todoDescription={item.description}
                        keyword={keyword}
                    />
                    {item.imgList && item.imgList.length !== 0 && (
                        <ImageListBox
                            type="todo"
                            refresh={() => { }}
                            width="120px"
                            imageList={item.imgList}
                        />
                    )}
                    {item.fileList && item.fileList.length !== 0 && (
                        <FileListBox
                            type="todo"
                            refresh={() => { }}
                            width="120px"
                            fileList={item.fileList}
                        />
                    )}
                </>
            }
            color="rgba(0,0,0,0.9)"
            placement={placement || "top"}
        >
            {props.children}
        </Tooltip>
    ) : (
        <>{props.children}</>
    );
};

export default TodoItemWeb;
