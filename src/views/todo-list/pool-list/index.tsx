import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
    } = props;

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span>{title}({mapList.length})</span>
            </div>
            <div className={`${styles.OneDayListWrap} ScrollBar`}>
                <div className={styles.oneDay}>
                    <OneDayList
                        list={mapList}
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
