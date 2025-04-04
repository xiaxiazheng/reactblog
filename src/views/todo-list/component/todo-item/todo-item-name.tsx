import React, { CSSProperties, useContext } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "antd";
import { QuestionCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import { getRangeFormToday } from "../../utils";
import { TodoItemType, TodoStatus } from "../../types";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import FileListBox from "@/components/file-image-handle/file-list-box";
import {
    handleKeywordHighlight,
    judgeIsLastModify,
} from "./utils";
import { splitMdStr, splitStr } from "../input-list";
import { TooltipPlacement } from "antd/lib/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import TodoTypeIcon from "../todo-type-icon";
import { SettingsContext } from "@/context/SettingsContext";
import { getToday } from "@/components/amdin-header/utils";
import MarkdownShow from "@/views/blog/blog-cont/markdown-show";

export const renderDescription = (str: string, keyword: string = "") => {
    if (!str) return <></>;
    return (
        <div className={styles.descList}>
            <div className={styles.desc}>
                <MarkdownShow blogcont={str.replaceAll(splitStr, splitMdStr)} keyword={keyword} />
            </div>
        </div>
    );
};

const ToolTipsWrapper: React.FC<
    Pick<TodoItemNameProps, "item" | "placement" | "keyword">
> = (props) => {
    const { item, placement, keyword } = props;

    return item.description ||
        (item.imgList && item.imgList.length !== 0) ||
        (item.fileList && item.fileList.length !== 0) ? (
        <Tooltip
            overlayClassName={styles.tooltip}
            title={
                <>
                    {item.description &&
                        renderDescription(item.description, keyword)}
                    {item.imgList && item.imgList.length !== 0 && (
                        <ImageListBox
                            type="todo"
                            refresh={() => {}}
                            width="120px"
                            imageList={item.imgList}
                        />
                    )}
                    {item.fileList && item.fileList.length !== 0 && (
                        <FileListBox
                            type="todo"
                            refresh={() => {}}
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

const Today = () => getToday().format("YYYY-MM-DD");

const Name: React.FC<{
    item: TodoItemType;
    isShowTime: boolean;
    isShowTimeRange: boolean;
    keyword: string;
}> = ({ item, isShowTime, isShowTimeRange, keyword }) => {
    return (
        <>
            {handleKeywordHighlight(item.name, keyword)}
            {(isShowTime || item.isTarget === "1") && (
                <span
                    className={`${styles.time} ${
                        item.time === Today()
                            ? styles.today
                            : item.time > Today()
                            ? styles.future
                            : styles.previously
                    }`}
                >{` (${item.time})`}</span>
            )}
            {isShowTimeRange && (
                <span className={`${styles.time}`}>
                    {` (${getRangeFormToday(item.time)})`}
                </span>
            )}
        </>
    );
};

interface TodoItemNameProps {
    keyword?: string;
    item: TodoItemType;
    isShowTime?: boolean;
    isShowTimeRange?: boolean;
    placement?: TooltipPlacement;
    onlyShow?: boolean;
    style?: CSSProperties;
    beforeClick?: () => boolean;
    children?: any;
    onClick?: (item: TodoItemType, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

// 单条 todo 中的 name 的渲染
const TodoItemName: React.FC<TodoItemNameProps> = (props) => {
    const {
        item,
        isShowTime = false,
        isShowTimeRange = false,
        placement,
        onlyShow = false,
        style = {},
        beforeClick,
        keyword: propsKeyword = "",
        onClick,
    } = props;

    // 进行 keyword 的合并
    const globalKkeyword = useSelector(
        (state: RootState) => state.filter.keyword
    );
    const finalKeyword = `${globalKkeyword} ${propsKeyword}`;

    const { todoColorMap } = useContext(SettingsContext);

    const dispatch = useDispatch<Dispatch>();
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

    return (
        <ToolTipsWrapper
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
                <span
                    className={styles.category}
                    style={{
                        background: todoColorMap?.[item.color],
                    }}
                >
                    {item.category}
                </span>
                {/* 知识目录 */}
                {item.isHabit === "1" && (
                    <TodoTypeIcon
                        type="habit"
                        style={{ marginRight: 5, color: "#ffeb3b" }}
                    />
                )}
                {/* 公司 */}
                {item.isWork === "1" && (
                    <TodoTypeIcon
                        type="work"
                        style={{ marginRight: 5, color: "#00d4d8" }}
                    />
                )}
                {/* 加急 */}
                {item.doing === "1" && (
                    <TodoTypeIcon
                        type="urgent"
                        style={{ marginRight: 5, color: "red" }}
                    />
                )}
                {/* 目标 */}
                {item.isTarget === "1" && (
                    <TodoTypeIcon
                        type="target"
                        style={{ marginRight: 5, color: "#ffeb3b" }}
                    />
                )}
                {/* 待跟进 */}
                {item.isFollowUp === "1" && (
                    <TodoTypeIcon
                        type="followUp"
                        style={{ marginRight: 5, color: "#ffeb3b" }}
                    />
                )}
                {/* note */}
                {item.isNote === "1" && (
                    <TodoTypeIcon
                        type="note"
                        style={{ marginRight: 5, color: "#ffeb3b" }}
                    />
                )}
                {/* 书签 */}
                {item.isBookMark === "1" && (
                    <TodoTypeIcon
                        type="bookMark"
                        style={{ marginRight: 5, color: "#ffeb3b" }}
                    />
                )}

                {isDone && item.isBookMark !== "1" ? (
                    <s
                        className={`${styles.grey}`}
                        style={{ ...judgeIsLastModify(item.todo_id), ...style }}
                    >
                        <Name
                            item={item}
                            isShowTime={isShowTime}
                            isShowTimeRange={isShowTimeRange}
                            keyword={finalKeyword}
                        />
                    </s>
                ) : (
                    <span
                        className={`${item.doing === "1" && styles.doing}`}
                        style={{ ...judgeIsLastModify(item.todo_id), ...style }}
                    >
                        <Name
                            item={item}
                            isShowTime={isShowTime}
                            isShowTimeRange={isShowTimeRange}
                            keyword={finalKeyword}
                        />
                    </span>
                )}
                {item.description && (
                    <QuestionCircleOutlined className={styles.icon} />
                )}
                {((item.imgList && item.imgList.length !== 0) ||
                    (item.fileList && item.fileList.length !== 0)) && (
                    <FileImageOutlined className={styles.icon} />
                )}
                {props.children}
            </div>
        </ToolTipsWrapper>
    );
};

export default TodoItemName;
