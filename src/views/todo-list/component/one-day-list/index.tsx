import React, { useState } from "react";
import { StatusType, TodoItemType } from "../../types";
import TodoItem from "./todo-item";

interface Props {
    list: TodoItemType[];
    showDoneIcon?: boolean;
    isModalOrDrawer?: boolean; // 是否是 modal 或 drawer 里展示的 todo
}

const OneDayList: React.FC<Props> = (props) => {
    const { list, showDoneIcon = false, isModalOrDrawer = false } = props;

    return (
        <div>
            {list.map((item) => (
                <TodoItem
                    key={item.todo_id}
                    item={item}
                    showDoneIcon={showDoneIcon}
                    isModalOrDrawer={isModalOrDrawer}
                />
            ))}
        </div>
    );
};

export default OneDayList;
