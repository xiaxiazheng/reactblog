import React, { ReactNode, useState } from "react";
import { Space } from "antd";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import { TodoItemType } from "../types";
import SortBtnMulti, {
    SortKeyMap,
    useIsSortByMulti,
} from "../component/sort-btn-multi";
import TodoItem from "../component/todo-item";
import { useIsHIdeModel } from "../hooks";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

interface Props {
    loading: boolean;
    title: ReactNode | string;
    sortKey: SortKeyMap;
    mapList: TodoItemType[];
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
        mapList,
        showDoneIcon = false,
        sortKey,
        isModalOrDrawer = false,
        isShowTime = false,
    } = props;

    const { isSortBy, setIsSortBy, handleSort } = useIsSortByMulti(
        `${sortKey}-sort-time`
    );

    const { isHide, setIsHide } = useIsHIdeModel(`${sortKey}`);

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span
                    style={{ color: "#1890ffcc" }}
                    onClick={() => setIsHide()}
                >
                    {title}({mapList.length}) {isHide ? <UpOutlined /> : <DownOutlined />}
                </span>
                <Space size={16}>
                    {props.btn}
                    <SortBtnMulti
                        isSortBy={isSortBy}
                        setIsSortBy={setIsSortBy}
                    />
                </Space>
            </div>
            {!isHide && (
                <div className={`${styles.OneDayListWrap} ScrollBar`}>
                    <div className={styles.oneDay}>
                        {handleSort(mapList).map((item) => (
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
            )}
        </div>
    );
};

export default PoolList;
