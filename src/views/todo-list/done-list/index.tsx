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

// 已完成列表
const DoneList: React.FC<Props> = (props) => {
    const { loading, title, mapList, getTodo, handleEdit } = props;

    const today = moment().format("YYYY-MM-DD");

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
                                {time}&nbsp; ({getWeek(time)})
                            </div>
                            {
                                <ListItem
                                    list={mapList[time]}
                                    title="已完成"
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

export default DoneList;
