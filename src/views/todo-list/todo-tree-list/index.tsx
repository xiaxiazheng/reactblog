import React, { ReactNode, useEffect, useState } from "react";
import { Input, Space } from "antd";
import styles from "./index.module.scss";
import { handleListToTree, handleTodoTreeFilterKeyword, Loading } from "@xiaxiazheng/blog-libs";
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
    isShowFilterInput?: boolean;
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
        isShowFilterInput = false,
    } = props;

    const { isSortBy, setIsSortBy, handleSort } = useIsSortByMulti(
        `${sortKey}-sort-time`
    );

    const [list, setList] = useState<TodoItemType[]>([]);
    useEffect(() => {
        setList(handleListToTree(handleSort(mapList), 'child_todo_list'));
    }, [mapList]);

    const [localKeyword, setLocalKeyword] = useState('');
    const [showList, setShowList] = useState<TodoItemType[]>([]);
    useEffect(() => {
        setShowList(handleTodoTreeFilterKeyword(list, localKeyword));
    }, [localKeyword, list]);

    return (
        <div className={`${styles.list}`}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span
                    style={{ color: "#1890ffcc" }}
                    onClick={() => onClickTitle?.(sortKey)}
                >
                    {title}({mapList.length}) {isHideList ? <UpOutlined /> : <DownOutlined />}
                </span>
                <Space size={12}>
                    {isShowFilterInput && (
                        <Input
                            style={{ width: 96 }}
                            placeholder="筛选关键字"
                            value={localKeyword}
                            onChange={(e) => setLocalKeyword(e.target.value)}
                        />
                    )}
                    {btn}
                    <SortBtnMulti
                        isSortBy={isSortBy}
                        setIsSortBy={setIsSortBy}
                    />
                </Space>
            </div>
            {!isHideList && (
                <TodoTreeWeb
                    todoList={showList}
                    dataMode="tree"
                    keyword={localKeyword}
                    getTodoItemProps={() => {
                        return { placement: 'right' }
                    }}
                />
            )}
        </div>
    );
};

export default TodoTreeList;
