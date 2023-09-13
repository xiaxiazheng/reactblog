import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../../component/sort-btn";
import PoolList from "../../todo-all-list";
import { Dispatch, RootState } from "../../rematch";
import { Button } from "antd";
import TodoTypeIcon from "../../component/todo-type-icon";

const TodoHabit = () => {
    const habitLoading = useSelector(
        (state: RootState) => state.data.habitLoading
    );
    const habitList = useSelector((state: RootState) => state.data.habitList);
    const habitListOrigin = useSelector(
        (state: RootState) => state.data.habitListOrigin
    );
    const isWork = useSelector((state: RootState) => state.filter.isWork);
    const habitStatus = useSelector(
        (state: RootState) => state.filter.habitStatus
    );
    const dispatch = useDispatch<Dispatch>();
    const { setHabitList, getFilterList, getTodo } = dispatch.data;
    const { setHabitStatus } = dispatch.filter;
    useEffect(() => {
        setHabitList(getFilterList({ list: habitListOrigin, type: "habit" }));
    }, [habitListOrigin]);

    useEffect(() => {
        getTodo("habit");
    }, [habitStatus, isWork]);

    return (
        <PoolList
            loading={habitLoading}
            sortKey={SortKeyMap.habit}
            title={
                <>
                    <TodoTypeIcon type="habit" /> 习惯
                </>
            }
            btn={
                <>
                    <Button
                        onClick={() =>
                            setHabitStatus(
                                habitStatus === "todo" ? "done" : "todo"
                            )
                        }
                        type={habitStatus === "todo" ? "default" : "primary"}
                    >
                        {habitStatus === "todo" ? "未完成" : "已完成"}
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