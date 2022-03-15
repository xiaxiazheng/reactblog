import React from "react";
import styles from "./index.module.scss";
import { message, Popconfirm, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    CopyOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
    FileImageOutlined,
} from "@ant-design/icons";
import { doneTodoItem, deleteTodoItem } from "@/client/TodoListHelper";
import { colorMap } from "../../utils";
import { StatusType, TodoItemType } from "../../types";
import ImageListBox from "@/components/file-image-handle/image-list-box";

interface Props {
    list: TodoItemType[];
    title: "待办" | "待办池" | "已完成";
    getTodo: (type: StatusType) => void;
    handleEdit: Function;
    handleCopy: Function;
}

const ListItem: React.FC<Props> = (props) => {
    const { list, title, getTodo, handleEdit, handleCopy } = props;

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

    // 删除 todo
    const deleteTodo = async (todo_id: string) => {
        const req = {
            todo_id,
        };
        const res = await deleteTodoItem(req);
        if (res) {
            message.success(res.message);
            title === "待办" && getTodo("todo");
            title === "已完成" && getTodo("done");
            title === "待办池" && getTodo("pool");
        } else {
            message.error("删除 todo 失败");
        }
    };

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

    const NameWrapper = (item: TodoItemType) => {
        const Name = (props: any) => (
            // 这里有 props 是因为 tooltips 要往嵌套的组件中塞点东西
            <div
                {...props}
                className={styles.name}
                onClick={handleEdit.bind(null, item)}
            >
                <span
                    className={styles.category}
                    style={{ background: colorMap[item.color] }}
                >
                    {item.category}
                </span>
                <span>{item.name}</span>
                {item.description && (
                    <QuestionCircleOutlined className={styles.icon} />
                )}
                {item.imgList.length !== 0 && (
                    <FileImageOutlined className={styles.icon} />
                )}
            </div>
        );

        return item.description || item.imgList.length !== 0 ? (
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
                                refresh={() => {
                                    title === "待办" && getTodo("todo");
                                    title === "已完成" && getTodo("done");
                                    title === "待办池" && getTodo("pool");
                                }}
                                width="120px"
                                imageList={item.imgList}
                            />
                        )}
                    </>
                }
                color="#1890ff"
            >
                <Name />
            </Tooltip>
        ) : (
            <Name />
        );
    };

    return (
        <>
            {list.map((item: any) => {
                return (
                    <div className={styles.item} key={item.todo_id}>
                        <span>
                            {title === "待办" && (
                                <Popconfirm
                                    title="确认已完成吗？"
                                    onConfirm={() => doneTodo(item.todo_id)}
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
                            {title !== "已完成" ? (
                                NameWrapper(item)
                            ) : (
                                <s className={styles.throughout}>
                                    {NameWrapper(item)}
                                </s>
                            )}
                        </span>
                        <span>
                            <Tooltip title={"复制"}>
                                <CopyOutlined
                                    className={styles.icon}
                                    title="复制"
                                    onClick={handleCopy.bind(null, item)}
                                />
                            </Tooltip>
                            <Popconfirm
                                title="确认要删除吗？"
                                onConfirm={() => deleteTodo(item.todo_id)}
                                // onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Tooltip title={"删除"}>
                                    <DeleteOutlined
                                        title="删除"
                                        className={styles.icon}
                                    />
                                </Tooltip>
                            </Popconfirm>
                        </span>
                    </div>
                );
            })}
        </>
    );
};

export default ListItem;
