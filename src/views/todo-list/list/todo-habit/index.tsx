import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../../component/sort-btn";
import TodoAllList from "../../todo-all-list";
import { Dispatch, RootState } from "../../rematch";
import { Button } from "antd";
import TodoTypeIcon from "../../component/todo-type-icon";
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
    const isHabit = useSelector(
        (state: RootState) => state.filter.isHabit
    );
    const dispatch = useDispatch<Dispatch>();
    const { setHabitList, getFilterList } = dispatch.data;
    const { handleSpecialStatus } = dispatch.filter;
    useEffect(() => {
        setHabitList(getFilterList({ list: habitListOrigin, type: "habit" }));
    }, [habitListOrigin]);

    return (
        <TodoAllList
            loading={habitLoading}
            sortKey={SortKeyMap.habit}
            title={
                <>
                    <TodoTypeIcon type="habit" /> {todoNameMap.habit}
                </>
            }
            btn={
                <>
                    <Button
                        onClick={() =>
                            handleSpecialStatus({ type: 'isHabit', status: isHabit === '1' ? "0" : "1" })
                        }
                        type={isHabit === "1" ? "primary" : "default"}
                    >
                        查看已完成
                    </Button>
                </>
            }
            mapList={habitList.sort(
                (a, b) => Number(a.color) - Number(b.color)
            )}
        />
    );
};

export default TodoHabit;
