import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../../component/sort-btn";
import PoolList from "../../todo-all-list";
import { Dispatch, RootState } from "../../rematch";
import TodoTypeIcon, { todoNameMap } from "../../component/todo-type-icon";

const TodoFollowUp = () => {
    const followUpLoading = useSelector(
        (state: RootState) => state.data.followUpLoading
    );
    const followUpList = useSelector((state: RootState) => state.data.followUpList);
    const followUpListOrigin = useSelector(
        (state: RootState) => state.data.followUpListOrigin
    );
    const isWork = useSelector((state: RootState) => state.filter.isWork);
    const dispatch = useDispatch<Dispatch>();
    const { setFollowUpList, getFilterList, getTodo } = dispatch.data;
    useEffect(() => {
        setFollowUpList(
            getFilterList({ list: followUpListOrigin, type: "followUp" })
        );
    }, [followUpListOrigin]);

    useEffect(() => {
        getTodo("followUp");
    }, [isWork]);

    return (
        <PoolList
            loading={followUpLoading}
            sortKey={SortKeyMap.followUp}
            title={
                <>
                    <TodoTypeIcon type="followUp" /> {todoNameMap.followUp}
                </>
            }
            mapList={followUpList.sort(
                (a, b) => Number(a.color) - Number(b.color)
            )}
        />
    );
};

export default TodoFollowUp;
