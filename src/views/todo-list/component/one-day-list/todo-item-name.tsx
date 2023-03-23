import React, { useContext, useState } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "antd";
import {
    QuestionCircleOutlined,
    FileImageOutlined,
    StarFilled,
    ClockCircleOutlined,
    AimOutlined,
    BookOutlined,
} from "@ant-design/icons";
import { colorMap } from "../../utils";
import { TodoItemType, TodoStatus } from "../../types";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import FileListBox from "@/components/file-image-handle/file-list-box";
import { handleDesc } from "./utils";
import { splitStr } from "../input-list";
import dayjs from "dayjs";
import { TooltipPlacement } from "antd/lib/tooltip";
import { TodoEditContext } from "../../TodoEditContext";
import { TodoDataContext } from "../../TodoDataContext";

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

const today = dayjs().format("YYYY-MM-DD");

interface NameProps {
    item: TodoItemType;
    isShowTime?: boolean;
    placement?: TooltipPlacement;
    onlyShow?: boolean;
}

// 单条 todo 中的 name 的渲染
const TodoItemName: React.FC<NameProps> = (props) => {
    const { item, isShowTime = false, placement, onlyShow = false } = props;

    const { handleEdit } = useContext(TodoEditContext);
    const { refreshData } = useContext(TodoDataContext);

    const isTodo = item.status === String(TodoStatus.todo);
    const isDone = item.status === String(TodoStatus.done);

    const ToolTipsWrapper: React.FC = (props) => {
        return item.description ||
            (item.imgList && item.imgList.length !== 0) ||
            (item.fileList && item.fileList.length !== 0) ? (
            <Tooltip
                title={
                    <>
                        {item.description &&
                            renderDescription(item.description)}
                        {item.imgList && item.imgList.length !== 0 && (
                            <ImageListBox
                                type="todo"
                                refresh={refreshData}
                                width="120px"
                                imageList={item.imgList}
                            />
                        )}
                        {item.fileList && item.fileList.length !== 0 && (
                            <FileListBox
                                type="todo"
                                refresh={refreshData}
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

    const getName = () => {
        return (
            <>
                {item.name}
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
            </>
        );
    };

    return (
        <ToolTipsWrapper>
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
                {item.isTarget === "1" && !item.timeRange && (
                    <AimOutlined style={{ marginRight: 5, color: "#ffeb3b" }} />
                )}
                {/* 打卡 */}
                {item.isTarget === "1" && !!item.timeRange && (
                    <ClockCircleOutlined
                        style={{ marginRight: 5, color: "#ffeb3b" }}
                    />
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
                        {getName()}
                    </s>
                ) : (
                    <span
                        className={`${item.isBookMark === "1" ? styles.big : ""}
                        ${isTodo && item.doing === "1" ? styles.yellow : ""}`}
                    >
                        {getName()}
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
