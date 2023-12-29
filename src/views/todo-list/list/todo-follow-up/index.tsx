import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../../component/sort-btn";
import PoolList from "../../todo-all-list";
import { Dispatch, RootState } from "../../rematch";
import TodoTypeIcon from "../../component/todo-type-icon";
import { SettingsContext } from "@/context/SettingsContext";
import { RenderTodoDescriptionIcon } from "../todo-today";

const TodoFollowUp = () => {
    const { todoNameMap, todoDescriptionMap } = useContext(SettingsContext);

    const followUpLoading = useSelector(
        (state: RootState) => state.data.followUpLoading
    );
    const followUpList = useSelector(
        (state: RootState) => state.data.followUpList
    );
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
                    <TodoTypeIcon type="followUp" /> {todoNameMap.followUp}{" "}
                    <RenderTodoDescriptionIcon
                        title={todoDescriptionMap?.["followUp"]}
                    />{" "}
                </>
            }
            mapList={followUpList.sort(
                (a, b) => Number(a.color) - Number(b.color)
            )}
        />
    );
};

export default TodoFollowUp;
