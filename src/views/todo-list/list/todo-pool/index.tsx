import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../../component/sort-btn";
import PoolList from "../../todo-split-time-range-list";
import { Dispatch, RootState } from "../../rematch";
import { SettingsContext } from "@/context/SettingsContext";
import { RenderTodoDescriptionIcon } from "../todo-today";
import { Button } from "antd";

const TodoPool = () => {
    const { todoNameMap, todoDescriptionMap, todoPoolDefaultShow } = useContext(SettingsContext);

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

    const [isShowAll, setIsShowAll] = useState<boolean>(false);

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
            isSlice={isShowAll ? false : todoPoolDefaultShow}
            btn={
                <>
                    <Button
                        onClick={() => {
                            setIsShowAll((prev) => !prev);
                        }}
                        type={isShowAll ? "primary" : "default"}
                    >
                        查看全部 {poolList.length} 条
                    </Button>
                </>
            }
            list={poolList}
            showDoneIcon={true}
        />
    );
};

export default TodoPool;
