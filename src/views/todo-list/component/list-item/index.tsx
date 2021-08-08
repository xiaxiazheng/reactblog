import React from "react";
import styles from "./index.module.scss";
import { message, Popconfirm, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import { doneTodoItem, deleteTodoItem } from "@/client/TodoListHelper";
import { colorMap } from "../../utils";

interface Props {
    list: any[];
    title: "待办" | "待办池" | "已完成";
    getTodo: Function;
    handleEdit: Function;
}

const ListItem: React.FC<Props> = (props) => {
    const { list, title, getTodo, handleEdit } = props;

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

    const Name = (item: any) => {
        return (
            <span className={styles.name}>
                <span
                    className={styles.category}
                    style={{ background: colorMap[item.color] }}
                >
                    {item.category}
                </span>
                <span>{item.name}</span>
                {item.description && (
                    <Tooltip title={item.description} color="#1890ff">
                        <QuestionCircleOutlined className={styles.icon} />
                    </Tooltip>
                )}
            </span>
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
                                Name(item)
                            ) : (
                                <s className={styles.throughout}>
                                    {Name(item)}
                                </s>
                            )}
                        </span>
                        <span>
                            <EditOutlined
                                className={styles.icon}
                                title="编辑"
                                onClick={handleEdit.bind(null, item)}
                            />
                            <Popconfirm
                                title="确认要删除吗？"
                                onConfirm={() => deleteTodo(item.todo_id)}
                                // onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined
                                    title="删除"
                                    className={styles.icon}
                                />
                            </Popconfirm>
                        </span>
                    </div>
                );
            })}
        </>
    );
};

export default ListItem;
