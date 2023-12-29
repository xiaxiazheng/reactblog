import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../../component/sort-btn";
import PoolList from "../../todo-all-list";
import { Dispatch, RootState } from "../../rematch";
import { Button } from "antd";
import TodoTypeIcon from "../../component/todo-type-icon";
import { SettingsContext } from "@/context/SettingsContext";
import { RenderTodoDescriptionIcon } from "../todo-today";

const TodoTarget = () => {
    const { todoNameMap, todoDescriptionMap } = useContext(SettingsContext);

    const targetLoading = useSelector(
        (state: RootState) => state.data.targetLoading
    );
    const targetList = useSelector((state: RootState) => state.data.targetList);
    const targetListOrigin = useSelector(
        (state: RootState) => state.data.targetListOrigin
    );
    const isWork = useSelector((state: RootState) => state.filter.isWork);
    const isTarget = useSelector((state: RootState) => state.filter.isTarget);
    const dispatch = useDispatch<Dispatch>();
    const { setTargetList, getFilterList, getTodo } = dispatch.data;
    const { handleSpecialStatus } = dispatch.filter;
    useEffect(() => {
        setTargetList(
            getFilterList({ list: targetListOrigin, type: "target" })
        );
    }, [targetListOrigin]);

    useEffect(() => {
        getTodo("target");
    }, [isWork]);

    return (
        <PoolList
            loading={targetLoading}
            sortKey={SortKeyMap.target}
            title={
                <>
                    <TodoTypeIcon type="target" /> {todoNameMap.target}{" "}
                    <RenderTodoDescriptionIcon
                        title={todoDescriptionMap?.["target"]}
                    />{" "}
                </>
            }
            btn={
                <>
                    <Button
                        onClick={() =>
                            handleSpecialStatus({
                                type: "isTarget",
                                status: isTarget === "1" ? "0" : "1",
                            })
                        }
                        type={isTarget === "1" ? "primary" : "default"}
                    >
                        查看已完成
                    </Button>
                </>
            }
            mapList={targetList.sort(
                (a, b) => Number(a.color) - Number(b.color)
            )}
        />
    );
};

export default TodoTarget;
