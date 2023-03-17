import React, { useContext, useEffect, useMemo, useState } from "react";
import { Divider, DrawerProps, Input, Modal, Space, Spin } from "antd";
import { getTodoChainById } from "@/client/TodoListHelper";
import { StatusType, TodoItemType } from "../../types";
import TodoItem from "../one-day-list/todo-item";
import { useUpdateFlag } from "../../hooks";
import { ThemeContext } from "@/context/ThemeContext";
import { TodoDataContext } from "../../TodoDataContext";
import { TodoEditContext } from "../../TodoEditContext";

interface IProps extends DrawerProps {}

const TodoChainModal: React.FC<IProps> = (props) => {
    const { theme } = useContext(ThemeContext);
    const {
        showChainModal: visible,
        setShowChainModal,
        chainId,
        setChainId,
    } = useContext(TodoEditContext);
    const { refreshData } = useContext(TodoDataContext);

    const [todoChainList, setTodoChainList] = useState<TodoItemType[]>([]);

    const { flag, updateFlag } = useUpdateFlag();

    useEffect(() => {
        if (visible) {
            if (chainId) {
                getTodoChain(chainId);
            } else {
                setTodoChainList([]);
            }
        }
    }, [chainId, visible, flag]);

    const [loading, setLoading] = useState<boolean>(false);

    const getTodoChain = async (todo_id: string) => {
        setLoading(true);
        const res = await getTodoChainById(todo_id);
        setTodoChainList(res.data.reverse());
        setLoading(false);
    };

    const activeTodo = todoChainList.find((item) => item.todo_id === chainId);

    const [keyword, setKeyword] = useState<string>();

    const handleFilter = (list: TodoItemType[]) => {
        return list.filter(
            (item) =>
                !keyword ||
                item.name.indexOf(keyword) !== -1 ||
                item.description.indexOf(keyword) !== -1
        );
    };

    const handleRefresh = () => {
        refreshData();
        // 刷新外部，也要刷新 todo chain
        updateFlag();
    };

    return (
        <Modal
            className={theme === "dark" ? "darkTheme" : ""}
            title={
                <Space size={16}>
                    <span>todo chain</span>
                    <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </Space>
            }
            visible={visible}
            onCancel={() => setShowChainModal(false)}
            footer={null}
            width={650}
        >
            <Spin spinning={loading}>
                {activeTodo && (
                    <>
                        {/* 前置 */}
                        {handleFilter(
                            todoChainList.filter(
                                (item) => item.todo_id !== chainId
                            )
                        )?.length !== 0 && (
                            <>
                                <h4>前置：</h4>
                                {todoChainList
                                    .filter((item) => item.todo_id !== chainId)
                                    .map((item) => (
                                        <TodoItem
                                            key={item.todo_id}
                                            item={item}
                                            showDoneIcon={false}
                                            isChain={true}
                                        />
                                    ))}
                                <Divider style={{ margin: "12px 0" }} />
                            </>
                        )}
                        {/* 当前 */}
                        {handleFilter([activeTodo])?.length !== 0 && (
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
                                    item={activeTodo}
                                    showDoneIcon={false}
                                    isChain={true}
                                />
                            </>
                        )}
                        {/* 后续 */}
                        {handleFilter(activeTodo.child_todo_list)?.length !==
                            0 && (
                            <>
                                <Divider style={{ margin: "12px 0" }} />
                                <h4>后续：</h4>
                                {handleFilter(activeTodo.child_todo_list).map(
                                    (item) => (
                                        <div key={item.todo_id}>
                                            <TodoItem
                                                key={item.todo_id}
                                                item={item}
                                                showDoneIcon={false}
                                                isChain={true}
                                                isChainNext={true}
                                            />
                                        </div>
                                    )
                                )}
                            </>
                        )}
                    </>
                )}
            </Spin>
        </Modal>
    );
};

export default TodoChainModal;
