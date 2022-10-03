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
import { StatusType, TodoItemType, TodoStatus } from "../types";
import SortBtn from "../component/sort-btn";

interface Props {
    loading: boolean;
    title: string | React.ReactNode;
    mapList: {
        [k in string]: TodoItemType[];
    };
    getTodo: (type: StatusType) => void;
    handleAdd?: Function;
    handleEdit: Function;
    refreshData: Function;
    showRefresh?: boolean; // 是否展示刷新按钮
    showDoneIcon?: boolean; // 是否展示快捷完成 icon
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
        showDoneIcon = false,
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

    const [isSortTime, setIsSortTime] = useState<boolean>(false);

    // 获取展示的 list
    const getShowList = (list: TodoItemType[]) => {
        const l = !isSortTime
            ? list
            : [...list].sort(
                  // sort 会改变原数组
                  (a, b) =>
                      (b?.mTime ? new Date(b.mTime).getTime() : 0) -
                      (a?.mTime ? new Date(a.mTime).getTime() : 0)
              );

        // doing === '1' 的放前面，所以依然是正在处理的事情优先级最高
        return l
            .filter((item) => item.doing === "1")
            .concat(l.filter((item) => item.doing !== "1"));
    };

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span className={styles.active}>
                    {title}({total})
                </span>
                <Space size={16}>
                    <SortBtn
                        isSortTime={isSortTime}
                        setIsSortTime={setIsSortTime}
                    />
                    {showRefresh && (
                        // 刷新按钮
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
                                        {mapList[time]?.length > 6
                                            ? ` ${mapList[time]?.length}`
                                            : null}
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
                                        <Popconfirm
                                            title={`是否将 ${time} 的 Todo 放进待办池`}
                                            onConfirm={() =>
                                                changeTodoToPool(mapList[time])
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
                                    </Space>
                                </div>
                                <OneDayList
                                    list={getShowList(mapList[time])}
                                    getTodo={getTodo}
                                    handleEdit={handleEdit}
                                    refreshData={refreshData}
                                    showDoneIcon={showDoneIcon}
                                />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default List;
