import React, { useState } from "react";
import { Button, message, Popconfirm, Space, Tooltip } from "antd";
import {
    RedoOutlined,
    PlusOutlined,
    VerticalAlignTopOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { editTodoItem } from "@/client/TodoListHelper";
import moment from "moment";
import Loading from "@/components/loading";
import OneDayList from "../component/one-day-list";
import { getWeek } from "../utils";
import { StatusType, TodoStatus } from "../types";

interface Props {
    loading: boolean;
    title: string;
    mapList: any;
    getTodo: (type: StatusType) => void;
    handleAdd?: Function;
    handleEdit: Function;
    refreshData: Function;
    showRefresh?: boolean;
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
        refreshData,
        showRefresh = false,
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
            getTodo("todo");
            getTodo("pool");
        }
    };

    // 把 todo 丢到待办池
    const changeTodoToPool = async (list: any[]) => {
        const promiseList = list.map((item) => {
            return editTodoItem({
                ...item,
                status: TodoStatus.pool,
            });
        });
        const res = await Promise.all(promiseList);
        if (res) {
            message.success(`Todo 调整到待办池成功`);
            getTodo("todo");
            getTodo("pool");
        }
    };

    // 把待办池丢到 todo
    const changePoolToTodo = async (list: any[]) => {
        const promiseList = list.map((item) => {
            return editTodoItem({
                ...item,
                status: TodoStatus.todo,
            });
        });
        const res = await Promise.all(promiseList);
        if (res) {
            message.success(`Todo 调整到待办池成功`);
            getTodo("todo");
            getTodo("pool");
        }
    };

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span className={styles.active}>
                    {title}({total})
                </span>
                <Space size={16}>
                    {showRefresh && (
                        <Button onClick={() => refreshData()} type="primary">
                            <RedoOutlined />
                        </Button>
                    )}
                    {handleAdd && (
                        <Button onClick={() => handleAdd()}>
                            <PlusOutlined />
                            todo
                        </Button>
                    )}
                </Space>
            </div>
            <div className={`${styles.OneDayListWrap} ScrollBar`}>
                {Object.keys(mapList)
                    .sort()
                    .reverse()
                    .map((time) => {
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

                                    <Space size={6}>
                                        {time < today && (
                                            <Popconfirm
                                                title={`是否将 ${time} 的 Todo 日期调整成今天`}
                                                onConfirm={() =>
                                                    changeExpireToToday(
                                                        mapList[time]
                                                    )
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
                                        {showRefresh ? (
                                            <Popconfirm
                                                title={`是否将 ${time} 的 Todo 放进待办池`}
                                                onConfirm={() =>
                                                    changeTodoToPool(
                                                        mapList[time]
                                                    )
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Tooltip title={"调整到待办池"}>
                                                    <ArrowLeftOutlined
                                                        title="调整到待办池"
                                                        className={styles.icon}
                                                    />
                                                </Tooltip>
                                            </Popconfirm>
                                        ) : (
                                            <Popconfirm
                                                title={`是否将 ${time} 的待办池放进 todo`}
                                                onConfirm={() =>
                                                    changePoolToTodo(
                                                        mapList[time]
                                                    )
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Tooltip title={"调整到 todo"}>
                                                    <ArrowRightOutlined
                                                        title="调整到 todo"
                                                        className={styles.icon}
                                                    />
                                                </Tooltip>
                                            </Popconfirm>
                                        )}
                                    </Space>
                                </div>
                                <OneDayList
                                    list={mapList[time]}
                                    getTodo={getTodo}
                                    handleEdit={handleEdit}
                                    refreshData={refreshData}
                                />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default List;
