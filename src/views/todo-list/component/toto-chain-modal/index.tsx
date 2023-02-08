import React, { useContext, useEffect, useMemo, useState } from "react";
import { Divider, DrawerProps, Input, Modal, Space, Spin } from "antd";
import { getTodoChainById } from "@/client/TodoListHelper";
import { StatusType, TodoItemType } from "../../types";
import TodoItem from "../one-day-list/todo-item";
import { useUpdateFlag } from "../../hooks";
import { ThemeContext } from "@/context/ThemeContext";

interface IProps extends DrawerProps {
    setShowDrawer: Function;
    activeTodoId: string | undefined;
    setActiveTodoId: Function;
    getTodo: (type: StatusType) => void;
    handleEdit: Function;
    refreshData: Function;
}

const TodoChainModal: React.FC<IProps> = (props) => {
    const {
        visible,
        setShowDrawer,
        activeTodoId,
        setActiveTodoId,
        getTodo,
        handleEdit,
        refreshData,
    } = props;
    const { theme } = useContext(ThemeContext);

    const [todoChainList, setTodoChainList] = useState<TodoItemType[]>([]);

    const { flag } = useUpdateFlag();

    useEffect(() => {
        if (visible) {
            if (activeTodoId) {
                getTodoChain(activeTodoId);
            } else {
                setTodoChainList([]);
            }
        }
    }, [activeTodoId, visible, flag]);

    const [loading, setLoading] = useState<boolean>(false);

    const getTodoChain = async (todo_id: string) => {
        setLoading(true);
        const res = await getTodoChainById(todo_id);
        setTodoChainList(res.data.reverse());
        setLoading(false);
    };

    const activeTodo = todoChainList.find(
        (item) => item.todo_id === activeTodoId
    );

    const [keyword, setKeyword] = useState<string>();

    const handleFilter = (list: TodoItemType[]) => {
        return list.filter(
            (item) =>
                !keyword ||
                item.name.indexOf(keyword) !== -1 ||
                item.description.indexOf(keyword) !== -1
        );
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
            onCancel={() => setShowDrawer(false)}
            footer={null}
            width={650}
        >
            <Spin spinning={loading}>
                {activeTodo && (
                    <>
                        {/* 前置 */}
                        {handleFilter(
                            todoChainList.filter(
                                (item) => item.todo_id !== activeTodoId
                            )
                        )?.length !== 0 && (
                            <>
                                <h4>前置：</h4>
                                {todoChainList
                                    .filter(
                                        (item) => item.todo_id !== activeTodoId
                                    )
                                    .map((item) => (
                                        <TodoItem
                                            key={item.todo_id}
                                            item={item}
                                            getTodo={getTodo}
                                            handleEdit={handleEdit}
                                            refreshData={refreshData}
                                            showDoneIcon={false}
                                            isChain={true}
                                            showTodoChain={(
                                                todo_id: string
                                            ) => {
                                                setActiveTodoId(todo_id);
                                                setShowDrawer(true);
                                            }}
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
                                    getTodo={getTodo}
                                    handleEdit={handleEdit}
                                    refreshData={refreshData}
                                    showDoneIcon={false}
                                    isChain={true}
                                    showTodoChain={(todo_id: string) => {
                                        setActiveTodoId(todo_id);
                                        setShowDrawer(true);
                                    }}
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
                                                getTodo={getTodo}
                                                handleEdit={handleEdit}
                                                refreshData={refreshData}
                                                showDoneIcon={false}
                                                isChain={true}
                                                isChainNext={true}
                                                showTodoChain={(
                                                    todo_id: string
                                                ) => {
                                                    setActiveTodoId(todo_id);
                                                    setShowDrawer(true);
                                                }}
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
