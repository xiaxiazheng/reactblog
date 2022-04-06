import React from "react";
import styles from "./index.module.scss";
import { message, Popconfirm, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    CopyOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
    FileImageOutlined,
    ApartmentOutlined,
} from "@ant-design/icons";
import { doneTodoItem, deleteTodoItem } from "@/client/TodoListHelper";
import { colorMap } from "../../utils";
import { StatusType, TodoItemType, TodoStatus } from "../../types";
import ImageListBox from "@/components/file-image-handle/image-list-box";

interface Props {
    list: TodoItemType[];
    title: "待办" | "待办池" | "已完成";
    getTodo: (type: StatusType) => void;
    handleAddProgress: Function;
    handleEdit: Function;
    refreshData: Function;
}

const ListItem: React.FC<Props> = (props) => {
    const {
        list,
        title,
        getTodo,
        handleEdit,
        handleAddProgress,
        refreshData,
    } = props;

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

    const NameWrapper = (item: TodoItemType, isChild: boolean) => {
        const isDone = item.status == TodoStatus.done;

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
                                refresh={refreshData}
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

    const renderItemList = (list: TodoItemType[], isChild: boolean) => {
        if (!list) {
            return null;
        }
        return (
            <div>
                {list.map((item: TodoItemType) => {
                    const isHasChild =
                        item?.child_todo_list &&
                        item?.child_todo_list.length !== 0;
                    const isAllChildDone = isHasChild
                        ? item?.child_todo_list?.every(
                              (item) => item.status == TodoStatus.done
                          )
                        : true;
                    return (
                        <div
                            key={item.todo_id}
                            className={isChild ? styles.childList : ""}
                        >
                            <div className={styles.item}>
                                <span>
                                    {title === "待办" && (
                                        <Popconfirm
                                            title="确认已完成吗？"
                                            onConfirm={() => {
                                                if (isAllChildDone) {
                                                    doneTodo(
                                                        item.todo_id || ""
                                                    );
                                                } else {
                                                    message.warning(
                                                        "还有子任务待完成"
                                                    );
                                                }
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Tooltip
                                                title={"点击完成"}
                                                color="#20d420"
                                            >
                                                <CheckCircleOutlined
                                                    title="完成"
                                                    className={styles.doneIcon}
                                                />
                                            </Tooltip>
                                        </Popconfirm>
                                    )}
                                    {NameWrapper(item, isChild)}
                                </span>
                                <span>
                                    <Tooltip title={"新增进度"}>
                                        <ApartmentOutlined
                                            className={styles.icon}
                                            title="新增进度"
                                            onClick={handleAddProgress.bind(
                                                null,
                                                item
                                            )}
                                        />
                                    </Tooltip>
                                </span>
                            </div>
                            {item.child_todo_list &&
                                item.child_todo_list.length !== 0 &&
                                title !== "已完成" &&
                                renderItemList(item.child_todo_list, true)}
                        </div>
                    );
                })}
            </div>
        );
    };

    return <div>{renderItemList(list, false)}</div>;
};

export default ListItem;
