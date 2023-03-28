import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../component/sort-btn";
import PoolList from "../list/pool-list";
import { Dispatch, RootState } from "../rematch";

const TodoPool = () => {
    const poolLoading = useSelector(
        (state: RootState) => state.data.poolLoading
    );
    const poolListOrigin = useSelector(
        (state: RootState) => state.data.poolListOrigin
    );
    const poolList = useSelector((state: RootState) => state.data.poolList);
    const dispatch = useDispatch<Dispatch>();
    const { getTodo, setPoolList, getFilterList } = dispatch.data;

    useEffect(() => {
        getTodo("pool");
    }, []);

    useEffect(() => {
        setPoolList(getFilterList(poolListOrigin));
    }, [poolListOrigin]);

    return (
        <PoolList
            loading={poolLoading}
            sortKey={SortKeyMap.pool}
            title="待办池"
            mapList={poolList}
            showDoneIcon={true}
        />
    );
};

export default TodoPool;
