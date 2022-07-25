import React, { useState } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "antd";
import {
    QuestionCircleOutlined,
    FileImageOutlined,
    StarFilled,
} from "@ant-design/icons";
import { colorMap } from "../../utils";
import { TodoItemType, TodoStatus } from "../../types";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import FileListBox from "@/components/file-image-handle/file-list-box";

interface NameProps {
    item: TodoItemType;
    isChild: boolean;
    refreshData: Function;
    handleEdit: Function;
}

const NameWrapper: React.FC<NameProps> = (props) => {
    const { item, isChild, refreshData, handleEdit } = props;

    const isDoing = item.status == TodoStatus.todo;
    const isDone = item.status == TodoStatus.done;

    // 处理详细描述，把链接抠出来，思路是保留每一个断点的 url 并填充占位符，最后统一处理
    const handleDesc = (str: string) => {
        const re = /http[s]?:\/\/[^\s]*/g;
        let match;
        const urlList: string[] = [];
        let s = str;
        while ((match = re.exec(str)) !== null) {
            const url = match[0];
            urlList.push(url);
            s = s.replace(url, "<url_flag>");
        }

        return urlList.length === 0 ? (
            str
        ) : (
            <span>
                {s.split("<url_flag>").map((item, index) => {
                    return (
                        <span key={index}>
                            {item}
                            {urlList[index] && (
                                <a
                                    style={{ color: "black" }}
                                    href={urlList[index]}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {urlList[index]}
                                </a>
                            )}
                        </span>
                    );
                })}
            </span>
        );
    };

    const ToolTipsWrapper: React.FC = (props) => {
        return item.description ||
            item.imgList.length !== 0 ||
            item.fileList.length !== 0 ? (
            <Tooltip
                title={
                    <>
                        {item.description && (
                            <div className={styles.desc}>
                                {handleDesc(item.description)}
                            </div>
                        )}
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
                color="#1890ff"
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
                {isDone ? (
                    <s className={styles.throughout}>
                        {item.name}
                        {isChild && `（${item.time}）`}
                    </s>
                ) : (
                    <span>
                        {item.name}
                        {isChild && `（${item.time}）`}
                    </span>
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

export default NameWrapper;
