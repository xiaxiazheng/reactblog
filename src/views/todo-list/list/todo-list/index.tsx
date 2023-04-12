import React from "react";
import { message, Popconfirm, Space, Tooltip } from "antd";
import { VerticalAlignTopOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { editTodoItem } from "@/client/TodoListHelper";
import dayjs from "dayjs";
import Loading from "@/components/loading";
import { getWeek } from "../../utils";
import { TodoItemType, TodoStatus } from "../../types";
import SortBtn, { SortKeyMap, useIsSortTime } from "../../component/sort-btn";
import TodoItem from "../../component/todo-item";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../rematch";

interface Props {
    loading: boolean;
    title: string | React.ReactNode;
    mapList: {
        [k in string]: TodoItemType[];
    };
    sortKey: SortKeyMap;
    showDoneIcon?: boolean; // 是否展示快捷完成 icon
}

// 待办
const List: React.FC<Props> = (props) => {
    const { loading, title, mapList, showDoneIcon = false, sortKey } = props;

    const dispatch = useDispatch<Dispatch>();
    const { getTodo } = dispatch.data;

    const today = dayjs().format("YYYY-MM-DD");

    const total = Object.keys(mapList).reduce(
        (prev, cur) => mapList[cur].length + prev,
        0
    );

    // 把过期 todo 的日期调整成今天
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

    const { isSortTime, setIsSortTime, handleSort } = useIsSortTime(
        `${sortKey}-sort-time`
    );

    // 获取展示的 list
    const getShowList = (list: TodoItemType[]) => {
        const l = !isSortTime
            ? list
                  .filter((item) => item.doing === "1")
                  .concat(list.filter((item) => item.doing !== "1"))
            : handleSort(list);

        return l;
    };

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span className={styles.active}>
                    {title}({total})
                </span>
                <SortBtn
                    isSortTime={isSortTime}
                    setIsSortTime={setIsSortTime}
                />
            </div>
            <div className={`${styles.OneDayListWrap} ScrollBar`}>
                {Object.keys(mapList)
                    .sort()
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
                                {getShowList(mapList[time]).map((item) => (
                                    <TodoItem
                                        key={item.todo_id}
                                        item={item}
                                        showDoneIcon={showDoneIcon}
                                    />
                                ))}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default List;
