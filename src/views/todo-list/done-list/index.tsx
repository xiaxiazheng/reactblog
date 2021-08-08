import React from "react";
import { Button, message, Popconfirm, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { doneTodoItem, deleteTodoItem } from "@/client/TodoListHelper";
import moment from "moment";
import Loading from "@/components/loading";

interface Props {
    loading: boolean;
    title: "待办" | "已完成" | "待办池" | string;
    mapList: any;
    getTodo: Function;
    handleAdd: Function;
    handleEdit: Function;
}

// 已完成列表
const DoneList: React.FC<Props> = (props) => {
    const { loading, title, mapList, getTodo, handleEdit } = props;

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

    const today = moment().format("YYYY-MM-DD");
    const weekList = ["日", "一", "二", "三", "四", "五", "六"];

    const ListItem = (props: any) => {
        const { list } = props;

        const Name = (item: any) => {
            return (
                <span>
                    {item.name}&nbsp;&nbsp;
                    {item.description && (
                        <Tooltip title={item.description} color="#1890ff">
                            <QuestionCircleOutlined className={styles.icon} />
                        </Tooltip>
                    )}
                </span>
            );
        };

        return list.map((item: any) => {
            return (
                <div className={styles.item} key={item.todo_id}>
                    <span>
                        <s className={styles.throughout}>{Name(item)}</s>
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
        });
    };

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span>{title}</span>
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
                                        : ""
                                }`}
                            >
                                {time}&nbsp; (周{weekList[moment(time).day()]})
                            </div>
                            {<ListItem list={mapList[time]} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DoneList;
