import React, { useState } from "react";
import { StatusType, TodoItemType } from "../../types";
import TodoItem from "./todo-item";

interface Props {
    list: TodoItemType[];
    showDoneIcon?: boolean;
}

const OneDayList: React.FC<Props> = (props) => {
    const { list, showDoneIcon = false } = props;

    return (
        <div>
            {list.map((item) => (
                <TodoItem
                    key={item.todo_id}
                    item={item}
                    showDoneIcon={showDoneIcon}
                />
            ))}
        </div>
    );
};

export default OneDayList;
