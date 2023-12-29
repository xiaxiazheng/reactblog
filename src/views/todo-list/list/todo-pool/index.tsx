import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../../component/sort-btn";
import PoolList from "../../todo-split-time-range-list";
import { Dispatch, RootState } from "../../rematch";
import { SettingsContext } from "@/context/SettingsContext";
import { RenderTodoDescriptionIcon } from "../todo-today";

const TodoPool = () => {
    const { todoNameMap, todoDescriptionMap } = useContext(SettingsContext);

    const poolLoading = useSelector(
        (state: RootState) => state.data.poolLoading
    );
    const poolListOrigin = useSelector(
        (state: RootState) => state.data.poolListOrigin
    );
    const poolList = useSelector((state: RootState) => state.data.poolList);
    const dispatch = useDispatch<Dispatch>();
    const { setPoolList, getFilterList } = dispatch.data;

    useEffect(() => {
        setPoolList(getFilterList({ list: poolListOrigin, type: "pool" }));
    }, [poolListOrigin]);

    return (
        <PoolList
            loading={poolLoading}
            sortKey={SortKeyMap.pool}
            title={
                <>
                    {todoNameMap["pool"]}{" "}
                    <RenderTodoDescriptionIcon
                        title={todoDescriptionMap?.["pool"]}
                    />{" "}
                </>
            }
            list={poolList}
            showDoneIcon={true}
        />
    );
};

export default TodoPool;
