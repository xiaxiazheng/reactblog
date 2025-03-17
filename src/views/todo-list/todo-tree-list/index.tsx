import React, { ReactNode, useState } from "react";
import { Space } from "antd";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import { TodoItemType } from "../types";
import SortBtnMulti, {
    useIsSortByMulti,
} from "../component/sort-btn-multi";
import { useIsHIdeModel } from "../hooks";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { SortKeyMap } from "../component/sort-btn";
import TodoTree from "../component/todo-tree";

interface Props {
    loading: boolean;
    title: ReactNode | string;
    sortKey: SortKeyMap;
    mapList: TodoItemType[];
    btn?: any;
}

const TodoTreeList: React.FC<Props> = (props) => {
    const {
        loading,
        title,
        mapList,
        sortKey,
        btn
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
                    {btn}
                    <SortBtnMulti
                        isSortBy={isSortBy}
                        setIsSortBy={setIsSortBy}
                    />
                </Space>
            </div>
            {!isHide && (
                <div className={`${styles.OneDayListWrap} ScrollBar`}>
                    <TodoTree todoList={handleSort(mapList)}  />
                </div>
            )}
        </div>
    );
};

export default TodoTreeList;
