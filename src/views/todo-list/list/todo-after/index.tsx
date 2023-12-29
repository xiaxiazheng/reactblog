import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { SortKeyMap } from "../../component/sort-btn";
import List from "../../todo-split-day-list";
import { RootState } from "../../rematch";
import { formatArrayToTimeMap } from "../../utils";
import dayjs from "dayjs";
import { SettingsContext } from "@/context/SettingsContext";
import { RenderTodoDescriptionIcon } from "../todo-today";

const TodoAfter = () => {
    const { todoNameMap, todoDescriptionMap } = useContext(SettingsContext);
    const today = dayjs().format("YYYY-MM-DD");

    const todoLoading = useSelector(
        (state: RootState) => state.data.todoLoading
    );

    const todoList = useSelector((state: RootState) => state.data.todoList);

    if (!todoList.filter((item) => item.time > today).length) {
        return null;
    }

    return (
        <List
            loading={todoLoading}
            sortKey={SortKeyMap.after}
            key="after"
            title={
                <>
                    {todoNameMap["after"]}
                    <RenderTodoDescriptionIcon
                        title={todoDescriptionMap?.["after"]}
                    />{" "}
                </>
            }
            mapList={formatArrayToTimeMap(
                todoList.filter((item) => item.time > today)
            )}
        />
    );
};

export default TodoAfter;
