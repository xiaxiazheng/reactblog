import React, { useContext, useState } from "react";
import { Button, message, Popconfirm, Space, Tooltip } from "antd";
import {
    VerticalAlignTopOutlined,
    ArrowLeftOutlined,
    ThunderboltFilled,
    DownOutlined,
    UpOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { editTodoItem } from "@/client/TodoListHelper";
import dayjs from "dayjs";
import Loading from "@/components/loading";
import { getRangeFormToday, getWeek } from "../utils";
import { TodoItemType, TodoStatus } from "../types";
import SortBtn, { SortKeyMap, useIsSortTime } from "../component/sort-btn";
import TodoItem from "../component/todo-item";
import { useDispatch } from "react-redux";
import { Dispatch } from "../rematch";
import { useIsHIdeModel } from "../hooks";
import { SettingsContext } from "@/context/SettingsContext";
import { getToday } from "@/components/amdin-header/utils";

interface Props {
    loading: boolean;
    title: string | React.ReactNode;
    mapList: {
        [k in string]: TodoItemType[];
    };
    sortKey: SortKeyMap;
    showDoneIcon?: boolean; // 是否展示快捷完成 icon
    showDoingBtn?: boolean; // 是否展示加急的筛选按钮
    showTimeOprationBtn?: boolean; // 是否展示日期右边的操作按钮
    isReverseTime?: boolean; // 是否倒序展示日期
    btnChildren?: React.ReactNode; // 额外的按钮
}

// 待办
const List: React.FC<Props> = (props) => {
    const {
        loading,
        title,
        mapList,
        showDoneIcon = false,
        sortKey,
        showDoingBtn,
        showTimeOprationBtn = true,
        isReverseTime = false,
        btnChildren = null,
    } = props;

    const { todoNameMap } = useContext(SettingsContext);

    const dispatch = useDispatch<Dispatch>();
    const { getTodo } = dispatch.data;

    const Today = () => getToday().format("YYYY-MM-DD");

    const total = Object.keys(mapList).reduce(
        (prev, cur) => mapList[cur].length + prev,
        0
    );

    // 把过期 todo 的日期调整成今天
    const changeExpireToToday = async (list: TodoItemType[]) => {
        const promiseList = list.filter(item => String(item.status) === String(TodoStatus.todo)).map((item) => {
            return editTodoItem({
                ...item,
                time: Today(),
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
    const changeTodoToPool = async (list: TodoItemType[]) => {
        const promiseList = list.filter(item => item.status === TodoStatus.todo).map((item) => {
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
        let l = list;
        if (isOnlyShowDoing) {
            l = l.filter((item) => item.doing === "1");
        }
        if (!isSortTime) {
            l = l
                .filter((item) => item.doing === "1")
                .concat(l.filter((item) => item.doing !== "1"));
        } else {
            l = handleSort(l);
        }

        return l;
    };

    const [isOnlyShowDoing, setIsOnlyShowDoing] = useState<boolean>(false);

    const { isHide, setIsHide } = useIsHIdeModel(`${sortKey}`);

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span className={styles.active} onClick={() => setIsHide()}>
                    {title}({total}){" "}
                    {isHide ? <UpOutlined /> : <DownOutlined />}
                </span>
                <Space size={8}>
                    {btnChildren}
                    {showDoingBtn && (
                        <Tooltip title={`只看 ${todoNameMap?.urgent}`}>
                            <Button
                                className={
                                    isOnlyShowDoing
                                        ? styles.isOnlyShowDoing
                                        : ""
                                }
                                type={isOnlyShowDoing ? "primary" : "default"}
                                onClick={() =>
                                    setIsOnlyShowDoing((prev) => !prev)
                                }
                                icon={<ThunderboltFilled />}
                            ></Button>
                        </Tooltip>
                    )}
                    <SortBtn
                        isSortTime={isSortTime}
                        setIsSortTime={setIsSortTime}
                    />
                </Space>
            </div>

            {!isHide && (
                <div className={`${styles.OneDayListWrap} ScrollBar`}>
                    {(isReverseTime
                        ? Object.keys(mapList).sort().reverse()
                        : Object.keys(mapList).sort()
                    ).map((time) => {
                        return (
                            <div className={styles.oneDay} key={time}>
                                <div
                                    className={`${styles.time} ${
                                        time === Today()
                                            ? styles.today
                                            : time > Today()
                                            ? styles.future
                                            : styles.previously
                                    }`}
                                >
                                    <span>
                                        {time}&nbsp; ({getWeek(time)},
                                        {getRangeFormToday(time)})
                                        {mapList[time]?.length > 6
                                            ? ` ${mapList[time]?.length}`
                                            : null}
                                    </span>
                                    {showTimeOprationBtn && (
                                        <Space size={6}>
                                            {time < Today() && (
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
                                                            className={
                                                                styles.icon
                                                            }
                                                        />
                                                    </Tooltip>
                                                </Popconfirm>
                                            )}
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
                                        </Space>
                                    )}
                                </div>
                                {getShowList(mapList[time]).map((item, index) => (
                                    <TodoItem
                                        key={item.todo_id + index}
                                        item={item}
                                        showDoneIcon={showDoneIcon}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default List;
