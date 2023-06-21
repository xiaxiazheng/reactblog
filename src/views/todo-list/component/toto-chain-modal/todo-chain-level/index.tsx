import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Collapse, Divider } from "antd";
import { TodoItemType } from "../../../types";
import TodoItem from "../../todo-item";
import styles from "./index.module.scss";

interface IProps {
    localKeyword: string;
    todoChainList: TodoItemType[];
    nowTodo: TodoItemType | undefined;
    chainId: string;
}

const TodoChainLevel: React.FC<IProps> = (props) => {
    const { localKeyword, todoChainList, nowTodo, chainId } = props;

    const handleFilter = (list: TodoItemType[]): TodoItemType[] => {
        return list.filter(
            (item) =>
                !localKeyword ||
                item.name.toLowerCase().indexOf(localKeyword.toLowerCase()) !==
                    -1 ||
                item.description
                    .toLowerCase()
                    .indexOf(localKeyword.toLowerCase()) !== -1 ||
                handleFilter(item?.child_todo_list || [])?.length !== 0
        );
    };

    const renderChildTodo = (list: TodoItemType[]) => {
        return handleFilter(list)
            .sort(
                (a, b) =>
                    new Date(a.time).getTime() - new Date(b.time).getTime()
            )
            .map((item) => (
                <div key={item.todo_id}>
                    {item.child_todo_list_length !== 0 && isShowAll ? (
                        <Collapse ghost defaultActiveKey={[item.todo_id]}>
                            <Collapse.Panel
                                key={item.todo_id}
                                header={
                                    <TodoItem
                                        key={item.todo_id}
                                        item={item}
                                        showDoneIcon={false}
                                        isChain={true}
                                        isChainNext={true}
                                        isModalOrDrawer={true}
                                    />
                                }
                            >
                                {item.child_todo_list_length !== 0 &&
                                    renderChildTodo(item.child_todo_list || [])}
                            </Collapse.Panel>
                        </Collapse>
                    ) : (
                        <div style={{ paddingLeft: isShowAll ? 24 : 0 }}>
                            <TodoItem
                                key={item.todo_id}
                                item={item}
                                showDoneIcon={false}
                                isChain={true}
                                isChainNext={true}
                                isModalOrDrawer={true}
                            />
                        </div>
                    )}
                </div>
            ));
    };

    const [isShowAll, setIsShowAll] = useState<boolean>(false);

    return (
        <>
            <Button
                type={isShowAll ? "primary" : "default"}
                onClick={() => setIsShowAll((prev) => !prev)}
            >
                show All
            </Button>
            <div className={styles.content}>
                {/* 前置 */}
                {handleFilter(
                    todoChainList.filter((item) => item.todo_id !== chainId)
                )?.length !== 0 && (
                    <>
                        <h4>
                            <span style={{ color: "#1890ffcc" }}>前置：</span>
                        </h4>
                        {handleFilter(
                            todoChainList.filter(
                                (item) => item.todo_id !== chainId
                            )
                        )
                            .filter((item) => item.todo_id !== chainId)
                            .reverse()
                            .map((item) => (
                                <TodoItem
                                    key={item.todo_id}
                                    item={item}
                                    showDoneIcon={false}
                                    isChain={true}
                                    isModalOrDrawer={true}
                                />
                            ))}
                        <Divider style={{ margin: "12px 0" }} />
                    </>
                )}
                {/* 当前 */}
                {nowTodo && handleFilter([nowTodo])?.length !== 0 && (
                    <>
                        <h4>
                            <span
                                style={{
                                    color: "#40a9ff",
                                }}
                            >
                                当前：
                            </span>
                        </h4>
                        <TodoItem
                            item={nowTodo}
                            showDoneIcon={false}
                            isChain={true}
                            isModalOrDrawer={true}
                        />
                    </>
                )}
                {/* 后续 */}
                {nowTodo &&
                    nowTodo.child_todo_list_length !== 0 &&
                    nowTodo.child_todo_list &&
                    handleFilter(nowTodo.child_todo_list)?.length !== 0 && (
                        <>
                            <Divider style={{ margin: "12px 0" }} />
                            <h4>
                                <span style={{ color: "#52d19c" }}>后续：</span>
                            </h4>
                            {renderChildTodo(nowTodo.child_todo_list)}
                        </>
                    )}
            </div>
        </>
    );
};

export default TodoChainLevel;
