import React, { useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";
import { Divider, Modal, Spin } from "antd";
import { getTodoChainById } from "@/client/TodoListHelper";
import { StatusType, TodoItemType } from "../../types";
import TodoItem from "./todo-item";
import { useUpdateFlag } from "../../hooks";

interface Props {
    list: TodoItemType[];
    getTodo: (type: StatusType) => void;
    handleEdit: Function;
    refreshData: Function;
    showDoneIcon?: boolean;
}

const OneDayList: React.FC<Props> = (props) => {
    const {
        list,
        getTodo,
        handleEdit,
        refreshData,
        showDoneIcon = false,
    } = props;

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [activeTodoId, setActiveTodoId] = useState<string>();

    const [todoChainList, setTodoChainList] = useState<TodoItemType[]>([]);

    const { flag } = useUpdateFlag();

    useEffect(() => {
        if (showDrawer) {
            if (activeTodoId) {
                getTodoChain(activeTodoId);
            } else {
                setTodoChainList([]);
            }
        }
    }, [activeTodoId, showDrawer, flag]);

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

    return (
        <div>
            <div>
                {list.map((item) => (
                    <TodoItem
                        key={item.todo_id}
                        item={item}
                        getTodo={getTodo}
                        handleEdit={handleEdit}
                        refreshData={refreshData}
                        showDoneIcon={showDoneIcon}
                        showTodoChain={(todo_id: string) => {
                            setActiveTodoId(todo_id);
                            setShowDrawer(true);
                        }}
                    />
                ))}
            </div>
            <Modal
                title={"todo chain"}
                visible={showDrawer}
                onCancel={() => setShowDrawer(false)}
                footer={null}
                width={650}
            >
                <Spin spinning={loading} className={styles.modal}>
                    {activeTodo && (
                        <>
                            {todoChainList.filter(
                                (item) => item.todo_id !== activeTodoId
                            )?.length !== 0 && (
                                <>
                                    <h4>前置：</h4>
                                    {todoChainList
                                        .filter(
                                            (item) =>
                                                item.todo_id !== activeTodoId
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
                            {activeTodo.child_todo_list?.length !== 0 && (
                                <>
                                    <Divider style={{ margin: "12px 0" }} />
                                    <h4>后续：</h4>
                                    {activeTodo.child_todo_list.map((item) => (
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
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </Spin>
            </Modal>
        </div>
    );
};

export default OneDayList;
