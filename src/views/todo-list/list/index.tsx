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
import ListItem from "../component/list-item";
import { getWeek } from '../utils';

interface Props {
    loading: boolean;
    title: "待办" | "已完成" | "待办池" | string;
    mapList: any;
    getTodo: Function;
    handleAdd: Function;
    handleEdit: Function;
}

// 待办池和待办列表
const List: React.FC<Props> = (props) => {
    const { loading, title, mapList, getTodo, handleAdd, handleEdit } = props;

    const today = moment().format("YYYY-MM-DD");

    return (
        <div className={styles.list}>
            {loading && <Loading />}
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
                    return title === "待办池" ? (
                        // 待办池不区分日期
                        <ListItem
                            list={mapList[time]}
                            title="待办池"
                            getTodo={getTodo}
                            handleEdit={handleEdit}
                        />
                    ) : (
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
                                {time}&nbsp; ({getWeek(time)})
                            </div>
                            {
                                <ListItem
                                    list={mapList[time]}
                                    title="待办"
                                    getTodo={getTodo}
                                    handleEdit={handleEdit}
                                />
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default List;
