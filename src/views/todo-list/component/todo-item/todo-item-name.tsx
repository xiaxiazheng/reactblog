import React, { useContext, useState } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "antd";
import {
    QuestionCircleOutlined,
    FileImageOutlined,
    StarFilled,
    AimOutlined,
    BookOutlined,
    AppleFilled,
    ThunderboltFilled,
} from "@ant-design/icons";
import { colorMap, getRangeFormToday } from "../../utils";
import { TodoItemType, TodoStatus } from "../../types";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import FileListBox from "@/components/file-image-handle/file-list-box";
import { handleHighlight, judgeIsLastModify } from "./utils";
import { splitStr } from "../input-list";
import dayjs from "dayjs";
import { TooltipPlacement } from "antd/lib/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";

export const renderDescription = (str: string, keyword: string = "") => {
    return (
        <div className={styles.descList}>
            {str.split(splitStr).map((i, index) => (
                <div className={styles.desc} key={index}>
                    {handleHighlight(i, keyword)}
                </div>
            ))}
        </div>
    );
};

const ToolTipsWrapper: React.FC<
    Pick<NameProps, "item" | "placement" | "isModalOrDrawer">
> = (props) => {
    const { item, placement, isModalOrDrawer } = props;

    const keyword = useSelector((state: RootState) => state.filter.keyword);
    const localKeyword = useSelector(
        (state: RootState) => state.filter.localKeyword
    );

    return item.description ||
        (item.imgList && item.imgList.length !== 0) ||
        (item.fileList && item.fileList.length !== 0) ? (
        <Tooltip
            overlayClassName={styles.tooltip}
            title={
                <>
                    {item.description &&
                        renderDescription(
                            item.description,
                            isModalOrDrawer
                                ? `${keyword} ${localKeyword}`
                                : keyword
                        )}
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

const today = dayjs().format("YYYY-MM-DD");

const Name: React.FC<{
    item: TodoItemType;
    isShowTime: boolean;
    isShowTimeRange: boolean;
    isModalOrDrawer: boolean;
}> = ({ item, isShowTime, isShowTimeRange, isModalOrDrawer }) => {
    const keyword = useSelector((state: RootState) => state.filter.keyword);
    const localKeyword = useSelector(
        (state: RootState) => state.filter.localKeyword
    );

    return (
        <>
            {handleHighlight(
                item.name,
                isModalOrDrawer ? `${keyword} ${localKeyword}` : keyword
            )}
            {(isShowTime || item.isTarget === "1") && (
                <span
                    className={`${styles.time} ${
                        item.time === today
                            ? styles.today
                            : item.time > today
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

interface NameProps {
    item: TodoItemType;
    isShowTime?: boolean;
    isShowTimeRange?: boolean;
    placement?: TooltipPlacement;
    onlyShow?: boolean;
    isModalOrDrawer?: boolean;
}

// 单条 todo 中的 name 的渲染
const TodoItemName: React.FC<NameProps> = (props) => {
    const {
        item,
        isShowTime = false,
        isShowTimeRange = false,
        placement,
        onlyShow = false,
        isModalOrDrawer = false,
    } = props;

    const dispatch = useDispatch<Dispatch>();
    const handleEdit = (item: TodoItemType) => {
        const { setActiveTodo, setShowEdit, setOperatorType } = dispatch.edit;
        setActiveTodo(item);
        setShowEdit(true);
        setOperatorType("edit");
    };

    const isTodo = item.status === String(TodoStatus.todo);
    const isDone = item.status === String(TodoStatus.done);

    return (
        <ToolTipsWrapper
            item={item}
            placement={placement}
            isModalOrDrawer={isModalOrDrawer}
        >
            <div
                className={styles.name}
                onClick={() => !onlyShow && handleEdit(item)}
            >
                <span
                    className={styles.category}
                    style={{
                        background: colorMap[item.color],
                    }}
                >
                    {item.category}
                </span>
                {/* 公司 */}
                {item.isWork === "1" && (
                    <AppleFilled style={{ marginRight: 5, color: "#00d4d8" }} />
                )}
                {/* 现在处理 */}
                {item.doing === "1" && (
                    <ThunderboltFilled
                        style={{ marginRight: 5, color: "red" }}
                    />
                )}
                {/* 目标 */}
                {item.isTarget === "1" && (
                    <AimOutlined style={{ marginRight: 5, color: "#ffeb3b" }} />
                )}
                {/* note */}
                {item.isNote === "1" && (
                    <BookOutlined
                        style={{ marginRight: 5, color: "#ffeb3b" }}
                    />
                )}
                {/* 书签 */}
                {item.isBookMark === "1" && (
                    <StarFilled style={{ marginRight: 5, color: "#ffeb3b" }} />
                )}

                {isDone && item.isBookMark !== "1" ? (
                    <s
                        className={`${styles.grey}`}
                        style={judgeIsLastModify(item.todo_id)}
                    >
                        <Name
                            item={item}
                            isShowTime={isShowTime}
                            isShowTimeRange={isShowTimeRange}
                            isModalOrDrawer={isModalOrDrawer}
                        />
                    </s>
                ) : (
                    <span style={judgeIsLastModify(item.todo_id)}>
                        <Name
                            item={item}
                            isShowTime={isShowTime}
                            isShowTimeRange={isShowTimeRange}
                            isModalOrDrawer={isModalOrDrawer}
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
            </div>
        </ToolTipsWrapper>
    );
};

export default TodoItemName;
