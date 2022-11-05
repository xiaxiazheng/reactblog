import React, { useState } from "react";
import styles from "./index.module.scss";
import { Modal } from "antd";
import { getTodoById } from "@/client/TodoListHelper";
import { StatusType, TodoItemType } from "../../types";
import TodoItem from "./todo-item";

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
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();

    const getParentTodo = async (parent_todo_id: string) => {
        const res = await getTodoById(parent_todo_id);
        setActiveTodo(res.data);
        setShowDrawer(true);
    };

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
                        getParentTodo={getParentTodo}
                    />
                ))}
            </div>
            <Modal
                title={"todo 链路"}
                visible={showDrawer}
                onCancel={() => setShowDrawer(false)}
                footer={null}
            >
                <div className={styles.modal}>
                    {activeTodo && (
                        <>
                            <div>当前：</div>
                            <TodoItem
                                item={activeTodo}
                                getTodo={getTodo}
                                handleEdit={handleEdit}
                                refreshData={refreshData}
                                showDoneIcon={showDoneIcon}
                                getParentTodo={getParentTodo}
                                isTrainParent={true}
                            />
                            <div>后续：</div>
                            {activeTodo.child_todo_list.map((item) => (
                                <div key={item.todo_id}>
                                    <TodoItem
                                        key={item.todo_id}
                                        item={item}
                                        getTodo={getTodo}
                                        handleEdit={handleEdit}
                                        refreshData={refreshData}
                                        showDoneIcon={showDoneIcon}
                                        getParentTodo={getParentTodo}
                                        isTrainChild={true}
                                    />
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default OneDayList;
