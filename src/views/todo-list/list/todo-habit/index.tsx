import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import TodoTypeIcon from "../../component/todo-type-icon";
import TodoTreeList from "../../todo-tree-list";
import { SortKeyMap } from "../../component/sort-btn";
import { SettingsContext } from "@/context/SettingsContext";

const TodoHabit = () => {
    const { todoNameMap } = useContext(SettingsContext);

    const habitLoading = useSelector(
        (state: RootState) => state.data.habitLoading
    );
    const habitList = useSelector((state: RootState) => state.data.habitList);
    const habitListOrigin = useSelector(
        (state: RootState) => state.data.habitListOrigin
    );
    const dispatch = useDispatch<Dispatch>();
    const { setHabitList, getFilterList } = dispatch.data;
    useEffect(() => {
        setHabitList(getFilterList({ list: habitListOrigin, type: "habit" }));
    }, [habitListOrigin]);

    return (
        <TodoTreeList
            loading={habitLoading}
            sortKey={SortKeyMap.habit}
            title={
                <>
                    <TodoTypeIcon type="habit" /> {todoNameMap?.habit}
                </>
            }
            mapList={habitList.sort(
                (a, b) => Number(a.color) - Number(b.color)
            )}
        />
    );
};

export default TodoHabit;
