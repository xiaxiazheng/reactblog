import React, { useState } from "react";
import { Space } from "antd";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import OneDayList from "../component/one-day-list";
import { TodoItemType } from "../types";
import SortBtn, { SortKeyMap, useIsSortTime } from "../component/sort-btn";

interface Props {
    loading: boolean;
    title: string;
    sortKey: SortKeyMap;
    mapList: TodoItemType[];
    showDoneIcon?: boolean;
    btn?: any;
}

// 待办池
const PoolList: React.FC<Props> = (props) => {
    const { loading, title, mapList, showDoneIcon = false, sortKey } = props;

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
            <div className={`${styles.OneDayListWrap} ScrollBar`}>
                <div className={styles.oneDay}>
                    <OneDayList
                        list={getShowList(mapList)}
                        showDoneIcon={showDoneIcon}
                    />
                </div>
            </div>
        </div>
    );
};

export default PoolList;
