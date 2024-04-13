import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../../component/sort-btn";
// import PoolList from "../../todo-all-list";
import List from "../../todo-split-day-list";
import { Dispatch, RootState } from "../../rematch";
import TodoTypeIcon from "../../component/todo-type-icon";
import { SettingsContext } from "@/context/SettingsContext";
import { RenderTodoDescriptionIcon } from "../todo-today";
import { formatArrayToTimeMap } from "../../utils";

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
        <List
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
            mapList={formatArrayToTimeMap(followUpList)}
            showTimeOprationBtn={false}
            isReverseTime={true}
        />
    );
};

export default TodoFollowUp;
