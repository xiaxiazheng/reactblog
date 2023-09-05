import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../../component/sort-btn";
import PoolList from "../../todo-all-list";
import { Dispatch, RootState } from "../../rematch";
import { Button } from "antd";
import TodoTypeIcon from "../../component/todo-type-icon";

const TodoHobit = () => {
    const hobitLoading = useSelector(
        (state: RootState) => state.data.hobitLoading
    );
    const hobitList = useSelector((state: RootState) => state.data.hobitList);
    const hobitListOrigin = useSelector(
        (state: RootState) => state.data.hobitListOrigin
    );
    const isWork = useSelector((state: RootState) => state.filter.isWork);
    const hobitStatus = useSelector(
        (state: RootState) => state.filter.hobitStatus
    );
    const dispatch = useDispatch<Dispatch>();
    const { setHobitList, getFilterList, getTodo } = dispatch.data;
    const { setHobitStatus } = dispatch.filter;
    useEffect(() => {
        setHobitList(getFilterList({ list: hobitListOrigin, type: "hobit" }));
    }, [hobitListOrigin]);

    useEffect(() => {
        getTodo("hobit");
    }, [hobitStatus, isWork]);

    return (
        <PoolList
            loading={hobitLoading}
            sortKey={SortKeyMap.hobit}
            title={
                <>
                    <TodoTypeIcon type="hobit" /> 习惯
                </>
            }
            btn={
                <>
                    <Button
                        onClick={() =>
                            setHobitStatus(
                                hobitStatus === "todo" ? "done" : "todo"
                            )
                        }
                        type={hobitStatus === "todo" ? "default" : "primary"}
                    >
                        {hobitStatus === "todo" ? "未完成" : "已完成"}
                    </Button>
                </>
            }
            mapList={hobitList.sort(
                (a, b) => Number(a.color) - Number(b.color)
            )}
        />
    );
};

export default TodoHobit;
