import React, { useState } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "antd";
import {
    QuestionCircleOutlined,
    FileImageOutlined,
    StarFilled,
    FileTextOutlined,
} from "@ant-design/icons";
import { colorMap } from "../../utils";
import { TodoItemType, TodoStatus } from "../../types";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import FileListBox from "@/components/file-image-handle/file-list-box";
import { handleDesc } from "./utils";
import { splitStr } from "../input-list";

interface NameProps {
    item: TodoItemType;
    refreshData: Function;
    handleEdit: Function;
}

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

// 单条 todo 中的 name 的渲染
const TodoItemName: React.FC<NameProps> = (props) => {
    const { item, refreshData, handleEdit } = props;

    const isDoing = item.status == TodoStatus.todo;
    const isDone = item.status == TodoStatus.done;

    const ToolTipsWrapper: React.FC = (props) => {
        return item.description ||
            item.imgList.length !== 0 ||
            item.fileList.length !== 0 ? (
            <Tooltip
                title={
                    <>
                        {item.description &&
                            renderDescription(item.description)}
                        {item.imgList.length !== 0 && (
                            <ImageListBox
                                type="todo"
                                refresh={refreshData}
                                width="120px"
                                imageList={item.imgList}
                            />
                        )}
                        {item.fileList.length !== 0 && (
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
            >
                {props.children}
            </Tooltip>
        ) : (
            <>{props.children}</>
        );
    };

    return (
        <ToolTipsWrapper>
            <div className={styles.name} onClick={handleEdit.bind(null, item)}>
                {isDoing && item.doing === "1" && (
                    <StarFilled style={{ marginRight: 5, color: "#ffeb3b" }} />
                )}
                <span
                    className={styles.category}
                    style={{ background: colorMap[item.color] }}
                >
                    {item.category}
                </span>

                {item.isNote === "1" && (
                    <FileTextOutlined style={{ marginRight: 5 }} />
                )}

                {isDone ? (
                    <s className={styles.throughout}>{item.name}</s>
                ) : (
                    <span>{item.name}</span>
                )}
                {item.description && (
                    <QuestionCircleOutlined className={styles.icon} />
                )}
                {(item.imgList.length !== 0 || item.fileList.length !== 0) && (
                    <FileImageOutlined className={styles.icon} />
                )}
            </div>
        </ToolTipsWrapper>
    );
};

export default TodoItemName;
