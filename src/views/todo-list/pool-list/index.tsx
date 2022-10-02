import React, { useState } from "react";
import { Radio } from "antd";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import OneDayList from "../component/one-day-list";
import { StatusType, TodoItemType } from "../types";

interface Props {
    loading: boolean;
    title: string;
    mapList: TodoItemType[];
    getTodo: (type: StatusType) => void;
    handleEdit: Function;
    refreshData: Function;
    showSortType?: boolean;
}

// 待办池
const PoolList: React.FC<Props> = (props) => {
    const {
        loading,
        title,
        mapList,
        getTodo,
        handleEdit,
        refreshData,
        showSortType = false,
    } = props;

    const [sortBy, setSortBy] = useState<"important" | "updateTime">(
        "important"
    );

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span>
                    {title}({mapList.length})
                </span>
                {showSortType && (
                    <Radio.Group
                        options={[
                            { label: "重要程度", value: "important" },
                            { label: "更新时间", value: "updateTime" },
                        ]}
                        onChange={(val) => setSortBy(val.target.value)}
                        value={sortBy}
                        optionType="button"
                        buttonStyle="solid"
                    />
                )}
            </div>
            <div className={`${styles.OneDayListWrap} ScrollBar`}>
                <div className={styles.oneDay}>
                    <OneDayList
                        list={
                            sortBy === "important"
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
                    />
                </div>
            </div>
        </div>
    );
};

export default PoolList;
