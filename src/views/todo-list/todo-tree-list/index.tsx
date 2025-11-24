import React, { ReactNode, useState } from "react";
import { Space } from "antd";
import styles from "./index.module.scss";
import { Loading } from "@xiaxiazheng/blog-libs";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import SortBtnMulti, {
    useIsSortByMulti,
} from "../component/sort-btn-multi";
import { SortKeyMap } from "../component/sort-btn";
import TodoTreeWeb from "../component/todo-tree-web";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

interface Props {
    loading: boolean;
    title: ReactNode | string;
    sortKey: SortKeyMap;
    mapList: TodoItemType[];
    btn?: any;
    onClickTitle?: (key: SortKeyMap) => void;
    isHideList?: boolean;
}

const TodoTreeList: React.FC<Props> = (props) => {
    const {
        loading,
        title,
        mapList,
        sortKey,
        btn,
        onClickTitle,
        isHideList = false,
    } = props;

    const { isSortBy, setIsSortBy, handleSort } = useIsSortByMulti(
        `${sortKey}-sort-time`
    );

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span
                    style={{ color: "#1890ffcc" }}
                    onClick={() => onClickTitle?.(sortKey)}
                >
                    {title}({mapList.length}) {isHideList ? <UpOutlined /> : <DownOutlined />}
                </span>
                <Space size={16}>
                    {btn}
                    <SortBtnMulti
                        isSortBy={isSortBy}
                        setIsSortBy={setIsSortBy}
                    />
                </Space>
            </div>
            {!isHideList && (
                <div className={`${styles.OneDayListWrap} ScrollBar`}>
                    <TodoTreeWeb todoList={handleSort(mapList)}  />
                </div>
            )}
        </div>
    );
};

export default TodoTreeList;
