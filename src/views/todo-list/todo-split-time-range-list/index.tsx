import React, { ReactNode, useEffect, useState } from "react";
import { Space } from "antd";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import { TodoItemType } from "../types";
import SortBtn, { SortKeyMap, useIsSortTime } from "../component/sort-btn";
import TodoItem from "../component/todo-item";
import dayjs, { ManipulateType } from "dayjs";

interface Props {
    loading: boolean;
    title: string | ReactNode;
    sortKey: SortKeyMap;
    list: TodoItemType[];
    showDoneIcon?: boolean;
    btn?: any;
    isModalOrDrawer?: boolean; // 是否是 modal 或 drawer 里展示的 todo
    isShowTime?: boolean;
}

// 待办池
const PoolList: React.FC<Props> = (props) => {
    const {
        loading,
        title,
        list,
        showDoneIcon = false,
        sortKey,
        isModalOrDrawer = false,
        isShowTime = false,
    } = props;

    const { isSortTime, setIsSortTime, handleSort } = useIsSortTime(
        `${sortKey}-sort-time`
    );

    const getTimeRange = (
        start: number,
        end: number,
        type: ManipulateType = "day"
    ) => {
        return [dayjs().subtract(start, type), dayjs().subtract(end, type)];
    };

    const handleSplitListByTimeRange = (
        list: TodoItemType[]
    ): Record<string, TodoItemType[]> => {
        const timeRange: Record<string, dayjs.Dayjs[]> = {
            三天内: getTimeRange(0, 3),
            七天内: getTimeRange(3, 7),
            一月内: getTimeRange(7, 30),
            三月内: getTimeRange(1, 3, "month"),
            半年内: getTimeRange(3, 6, "month"),
            一年内: getTimeRange(6, 12, "month"),
            一年前: getTimeRange(1, 10, "year"),
        };
        return Object.keys(timeRange).reduce((prev, cur) => {
            const range = timeRange[cur];
            const l = list.filter((item) => {
                const time = dayjs(
                    (isSortTime ? item.cTime : item.mTime) || "2018-01-01"
                );
                return time.isBefore(range[0]) && time.isAfter(range[1]);
            });
            prev[cur] = l;
            return prev;
        }, {} as Record<string, TodoItemType[]>);
    };

    const [mapList, setMapList] = useState<Record<string, TodoItemType[]>>({});
    useEffect(() => {
        setMapList(handleSplitListByTimeRange(list));
    }, [list]);

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span style={{ color: "#1890ffcc" }}>
                    {title}({list.length})
                </span>
                <Space size={16}>
                    {props.btn}
                    <SortBtn
                        isSortTime={isSortTime}
                        setIsSortTime={setIsSortTime}
                    />
                </Space>
            </div>
            <div className={`${styles.OneDayListWrap} ScrollBar`}>
                {Object.keys(mapList).map((item) => {
                    return mapList[item].length === 0 ? null : (
                        <div className={styles.oneDay} key={item}>
                            <div className={styles.time}>{item}</div>
                            <div>
                                {(isSortTime
                                    ? handleSort(mapList[item])
                                    : mapList[item]
                                ).map((item) => {
                                    return (
                                        <TodoItem
                                            key={item.todo_id}
                                            item={item}
                                            showDoneIcon={showDoneIcon}
                                            isModalOrDrawer={isModalOrDrawer}
                                            isShowTime={isShowTime}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PoolList;
