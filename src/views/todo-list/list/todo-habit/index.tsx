import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../../component/sort-btn";
import PoolList from "../../todo-all-list";
import { Dispatch, RootState } from "../../rematch";
import { Button } from "antd";
import TodoTypeIcon, { todoNameMap } from "../../component/todo-type-icon";

const TodoHabit = () => {
    const habitLoading = useSelector(
        (state: RootState) => state.data.habitLoading
    );
    const habitList = useSelector((state: RootState) => state.data.habitList);
    const habitListOrigin = useSelector(
        (state: RootState) => state.data.habitListOrigin
    );
    const isWork = useSelector((state: RootState) => state.filter.isWork);
    const isHabit = useSelector(
        (state: RootState) => state.filter.isHabit
    );
    const dispatch = useDispatch<Dispatch>();
    const { setHabitList, getFilterList, getTodo } = dispatch.data;
    const { handleSpecialStatus } = dispatch.filter;
    useEffect(() => {
        setHabitList(getFilterList({ list: habitListOrigin, type: "habit" }));
    }, [habitListOrigin]);

    useEffect(() => {
        getTodo("habit");
    }, [isWork]);

    return (
        <PoolList
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
