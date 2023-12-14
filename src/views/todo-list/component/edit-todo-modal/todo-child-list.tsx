import { message, Space } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { TodoItemType } from "../../types";
import TodoChainIcon from "../todo-chain-icon";
import TodoItemName from "../todo-item/todo-item-name";
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
                            <TodoItemName
                                key={index}
                                item={item}
                                // onlyShow={true}
                                isShowTime={true}
                                isShowTimeRange={true}
                                beforeClick={() => {
                                    if (isEditing) {
                                        message.warning("正在编辑，不能切换");
                                        return false;
                                    }
                                    return true;
                                }}
                            >
                                <TodoChainIcon item={item} isOnlyShow={true} />
                            </TodoItemName>
                        );
                    }
                )}
            </Space>
        </>
    );
};

export default TodoChildList;
