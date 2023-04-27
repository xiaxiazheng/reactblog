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
    isShowTime?: boolean;
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
        isShowTime = false,
    } = props;

    const { isSortTime, setIsSortTime, handleSort } = useIsSortTime(`${sortKey}-sort-time`);

    // 获取展示的 list
    const getShowList = (list: TodoItemType[]) => {
        const l = !isSortTime ? list : handleSort(list);
        return l;
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
                            isShowTime={isShowTime}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PoolList;
