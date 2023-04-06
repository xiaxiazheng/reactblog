import React, { useState } from "react";
import { Space } from "antd";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import { TodoItemType } from "../../types";
import SortBtn, { SortKeyMap, useIsSortTime } from "../../component/sort-btn";
import TodoItem from "../../component/todo-item";

interface Props {
    loading: boolean;
    title: string;
    sortKey: SortKeyMap;
    mapList: TodoItemType[];
    showDoneIcon?: boolean;
    btn?: any;
    isModalOrDrawer?: boolean; // 是否是 modal 或 drawer 里展示的 todo
    input?: any;
}

// 待办池
const PoolList: React.FC<Props> = (props) => {
    const {
        loading,
        title,
        mapList,
        showDoneIcon = false,
        sortKey,
        isModalOrDrawer = false,
    } = props;

    const { isSortTime, setIsSortTime } = useIsSortTime(`${sortKey}-sort-time`);

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
                <span>
                    {title}({mapList.length})
                </span>
                <Space size={16}>
                    {props.btn}
                    <SortBtn
                        isSortTime={isSortTime}
                        setIsSortTime={setIsSortTime}
                    />
                </Space>
            </div>
            {props.input}
            <div className={`${styles.OneDayListWrap} ScrollBar`}>
                <div className={styles.oneDay}>
                    {getShowList(mapList).map((item) => (
                        <TodoItem
                            key={item.todo_id}
                            item={item}
                            showDoneIcon={showDoneIcon}
                            isModalOrDrawer={isModalOrDrawer}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PoolList;
