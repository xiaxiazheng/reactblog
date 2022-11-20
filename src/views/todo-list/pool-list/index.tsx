import React, { useState } from "react";
import { Button, Radio, Tooltip } from "antd";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import OneDayList from "../component/one-day-list";
import { StatusType, TodoItemType } from "../types";
import { CalendarOutlined } from "@ant-design/icons";
import SortBtn from "../component/sort-btn";

interface Props {
    loading: boolean;
    title: string;
    mapList: TodoItemType[];
    getTodo: (type: StatusType) => void;
    handleEdit: Function;
    refreshData: Function;
    showDoneIcon?: boolean;
}

// 待办池
const PoolList: React.FC<Props> = (props) => {
    const { loading, title, mapList, getTodo, handleEdit, refreshData, showDoneIcon = false } = props;

    const [isSortTime, setIsSortTime] = useState<boolean>(false);

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span>
                    {title}({mapList.length})
                </span>
                <SortBtn
                    isSortTime={isSortTime}
                    setIsSortTime={setIsSortTime}
                />
            </div>
            <div className={`${styles.OneDayListWrap} ScrollBar`}>
                <div className={styles.oneDay}>
                    <OneDayList
                        list={
                            !isSortTime
                                ? mapList
                                : [...mapList].sort(
                                      // sort 会改变原数组
                                      (a, b) =>
                                          (b?.mTime
                                              ? new Date(b.mTime).getTime()
                                              : 0) -
                                          (a?.mTime
                                              ? new Date(a.mTime).getTime()
                                              : 0)
                                  )
                        }
                        getTodo={getTodo}
                        handleEdit={handleEdit}
                        refreshData={refreshData}
                        showDoneIcon={showDoneIcon}
                    />
                </div>
            </div>
        </div>
    );
};

export default PoolList;
