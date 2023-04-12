import React from "react";
import { useSelector } from "react-redux";
import { SortKeyMap } from "../component/sort-btn";
import List from "../list/todo-list";
import { RootState } from "../rematch";
import { formatArrayToTimeMap } from "../utils";
import dayjs from 'dayjs';

const TodoAfter = () => {
    const today = dayjs().format("YYYY-MM-DD");

    const todoLoading = useSelector(
        (state: RootState) => state.data.todoLoading
    );

    const todoList = useSelector((state: RootState) => state.data.todoList);

    return (
        <List
            loading={todoLoading}
            sortKey={SortKeyMap.after}
            key="after"
            title="之后待办"
            mapList={formatArrayToTimeMap(
                todoList.filter((item) => item.time > today)
            )}
        />
    );
};

export default TodoAfter;
