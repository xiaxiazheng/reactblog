import React from "react";
import { Button, message, Popconfirm } from "antd";
import {
    CheckCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { doneTodoItem, deleteTodoItem } from "@/client/TodoListHelper";
import moment from "moment";

interface Props {
    title: "待办" | "已完成" | "待办池" | string;
    mapList: any;
    getTodo: Function;
    handleAdd: Function;
    handleEdit: Function;
}

// 两个todo列表
const List: React.FC<Props> = (props) => {
    const { title, mapList, getTodo, handleAdd, handleEdit } = props;

    // 完成 todo
    const doneTodo = async (todo_id: string) => {
        const req = {
            todo_id,
        };
        const res = await doneTodoItem(req);
        if (res) {
            message.success(res.message);
            getTodo("todo");
            getTodo("done");
            getTodo("pool");
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

    const today = moment().format("YYYY-MM-DD");
    const weekList = ["日", "一", "二", "三", "四", "五", "六"];

    return (
        <div className={styles.list}>
            <div className={styles.header}>
                <span className={title === "待办" ? styles.active : ""}>
                    {title}
                </span>
                {title !== "已完成" && (
                    <Button onClick={() => handleAdd(title)}>
                        <PlusOutlined />
                        todo
                    </Button>
                )}
            </div>
            <div className={`${styles.listItemWrap} ScrollBar`}>
                {Object.keys(mapList).map((time) => {
                    return (
                        <div className={styles.oneDay} key={time}>
                            <div
                                className={`${styles.time} ${
                                    time === today
                                        ? styles.today
                                        : time > today
                                        ? styles.future
                                        : title === "待办"
                                        ? styles.previously
                                        : ""
                                }`}
                            >
                                {time}&nbsp; (周{weekList[moment(time).day()]})
                            </div>
                            {mapList[time].map((item: any, index: number) => {
                                return (
                                    <div className={styles.item} key={index}>
                                        <span>
                                            {title === "待办" && (
                                                <Popconfirm
                                                    title="确认已完成吗？"
                                                    onConfirm={() =>
                                                        doneTodo(item.todo_id)
                                                    }
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button
                                                        type="text"
                                                        title="完成"
                                                    >
                                                        <CheckCircleOutlined
                                                            className={
                                                                styles.icon
                                                            }
                                                        />
                                                    </Button>
                                                </Popconfirm>
                                            )}
                                            {title !== "已完成" ? (
                                                <span className={styles.name}>
                                                    {item.name}
                                                </span>
                                            ) : (
                                                <s className={styles.delete}>
                                                    <span
                                                        className={styles.name}
                                                    >
                                                        {item.name}
                                                    </span>
                                                </s>
                                            )}
                                        </span>
                                        <span>
                                            <Button
                                                type="text"
                                                title="编辑"
                                                onClick={handleEdit.bind(
                                                    null,
                                                    item
                                                )}
                                            >
                                                <EditOutlined
                                                    className={styles.icon}
                                                />
                                            </Button>
                                            <Popconfirm
                                                title="确认要删除吗？"
                                                onConfirm={() =>
                                                    deleteTodo(item.todo_id)
                                                }
                                                // onCancel={cancel}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    type="text"
                                                    title="删除"
                                                >
                                                    <DeleteOutlined
                                                        className={styles.icon}
                                                    />
                                                </Button>
                                            </Popconfirm>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default List;
