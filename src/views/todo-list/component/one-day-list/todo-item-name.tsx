import React, { useContext, useState } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "antd";
import {
    QuestionCircleOutlined,
    FileImageOutlined,
    StarFilled,
    AimOutlined,
    BookOutlined,
} from "@ant-design/icons";
import { colorMap } from "../../utils";
import { TodoItemType, TodoStatus } from "../../types";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import FileListBox from "@/components/file-image-handle/file-list-box";
import { handleDesc, handleKeyword } from "./utils";
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
                    {handleDesc(i, keyword)}
                </div>
            ))}
        </div>
    );
};

const ToolTipsWrapper: React.FC<Pick<NameProps, "item" | "placement">> = (
    props
) => {
    const { item, placement } = props;

    const keyword = useSelector((state: RootState) => state.filter.keyword);

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

const today = dayjs().format("YYYY-MM-DD");

interface NameProps {
    item: TodoItemType;
    isShowTime?: boolean;
    placement?: TooltipPlacement;
    onlyShow?: boolean;
}

const Name: React.FC<{ item: TodoItemType; isShowTime: boolean }> = ({
    item,
    isShowTime,
}) => {
    const keyword = useSelector((state: RootState) => state.filter.keyword);

    return (
        <>
            {handleKeyword(item.name, keyword)}
            {(isShowTime ||
                item.isTarget === "1" ||
                item.isBookMark === "1") && (
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
        </>
    );
};

// 单条 todo 中的 name 的渲染
const TodoItemName: React.FC<NameProps> = (props) => {
    const { item, isShowTime = false, placement, onlyShow = false } = props;

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
        <ToolTipsWrapper item={item} placement={placement}>
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
                {/* 目标 */}
                {item.isTarget === "1" && (
                    <AimOutlined style={{ marginRight: 5, color: "#ffeb3b" }} />
                )}
                {/* 存档 */}
                {item.isNote === "1" && (
                    <BookOutlined
                        style={{ marginRight: 5, color: "#ffeb3b" }}
                    />
                )}
                {/* 书签 */}
                {item.isBookMark === "1" && (
                    <StarFilled style={{ marginRight: 5, color: "#ffeb3b" }} />
                )}

                {isDone ? (
                    <s
                        className={`${
                            item.isBookMark === "1" ? styles.big : styles.grey
                        }`}
                    >
                        <Name item={item} isShowTime={isShowTime} />
                    </s>
                ) : (
                    <span
                        className={`${item.isBookMark === "1" ? styles.big : ""}
                        ${isTodo && item.doing === "1" ? styles.yellow : ""}`}
                    >
                        <Name item={item} isShowTime={isShowTime} />
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
