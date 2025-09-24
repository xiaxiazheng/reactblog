import { message, Space } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import TodoChainIcon from "../todo-chain-icon";
import TodoItemWeb from "../todo-tree-web/todo-item-web";
import styles from "./index.module.scss";
import { Button } from 'antd';

interface TodoChildListType {
    title?: string;
    todoChildList: TodoItemType[];
    isEditing?: boolean;
}

const TodoChildList: React.FC<TodoChildListType> = (props) => {
    const { title, todoChildList, isEditing = false } = props;
    const [showAll, setShowAll] = useState<boolean>(false);
    return (
        <>
            <div className={styles.todoChildListTitle}>
                {title}
                {!showAll && todoChildList?.length > 4 && (
                    <Button
                        onClick={() => {
                            setShowAll(true);
                        }}
                        size="small"
                    >
                        show all
                    </Button>
                )}
            </div>
            <Space size={8} direction="vertical">
                {(!showAll ? todoChildList.slice(0, 4) : todoChildList).map(
                    (item, index) => {
                        return (
                            <TodoItemWeb
                                key={index}
                                item={item}
                                // onlyShow={true}
                                showTime={true}
                                showTimeRange={true}
                                beforeClick={() => {
                                    if (isEditing) {
                                        message.warning("正在编辑，不能切换");
                                        return false;
                                    }
                                    return true;
                                }}
                            >
                                <TodoChainIcon item={item} isOnlyShow={true} />
                            </TodoItemWeb>
                        );
                    }
                )}
            </Space>
        </>
    );
};

export default TodoChildList;
