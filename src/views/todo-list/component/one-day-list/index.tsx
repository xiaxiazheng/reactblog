import React, { useState } from "react";
import { StatusType, TodoItemType } from "../../types";
import TodoItem from "./todo-item";
import TodoChainModal from "../toto-chain-modal";

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
            <TodoChainModal
                visible={showDrawer}
                setShowDrawer={setShowDrawer}
                activeTodoId={activeTodoId}
                setActiveTodoId={setActiveTodoId}
                getTodo={getTodo}
                handleEdit={handleEdit}
                refreshData={refreshData}
            />
        </div>
    );
};

export default OneDayList;
