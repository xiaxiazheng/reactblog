import React, { useState } from "react";
import { Button, message, Popconfirm, Tooltip } from "antd";
import { PlusOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { editTodoItem } from "@/client/TodoListHelper";
import moment from "moment";
import Loading from "@/components/loading";
import ListItem from "../component/list-item";
import { getWeek } from "../utils";
import { StatusType } from '../';

interface Props {
    loading: boolean;
    title: "待办" | "已完成" | "待办池" | string;
    mapList: any;
    getTodo: (type: StatusType) => void;
    handleAdd: Function;
    handleEdit: Function;
    handleCopy: Function;
}

// 待办
const List: React.FC<Props> = (props) => {
    const {
        loading,
        title,
        mapList,
        getTodo,
        handleAdd,
        handleEdit,
        handleCopy,
    } = props;

    const today = moment().format("YYYY-MM-DD");

    const total = Object.keys(mapList).reduce(
        (prev, cur) => mapList[cur].length + prev,
        0
    );

    // 把过期任务的日期调整成今天
    const changeExpireToToday = async (list: any[]) => {
        const promiseList = list.map((item) => {
            return editTodoItem({
                ...item,
                time: today,
            });
        });
        const res = await Promise.all(promiseList);
        if (res) {
            message.success(`Todo 日期调整成功`);
            getTodo('todo');
        }
    };

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span className={styles.active}>
                    {title}({total})
                </span>
                <Button onClick={() => handleAdd(title)}>
                    <PlusOutlined />
                    todo
                </Button>
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
                                        : styles.previously
                                }`}
                            >
                                <span>
                                    {time}&nbsp; ({getWeek(time)})
                                </span>
                                {time < today && (
                                    <Popconfirm
                                        title={`是否将 ${time} 的 Todo 日期调整成今天`}
                                        onConfirm={() =>
                                            changeExpireToToday(mapList[time])
                                        }
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Tooltip title={"调整日期"}>
                                            <VerticalAlignTopOutlined
                                                title="调整日期"
                                                className={styles.icon}
                                            />
                                        </Tooltip>
                                    </Popconfirm>
                                )}
                            </div>
                            {
                                <ListItem
                                    list={mapList[time]}
                                    title="待办"
                                    getTodo={getTodo}
                                    handleEdit={handleEdit}
                                    handleCopy={handleCopy}
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
