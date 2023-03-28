import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../component/sort-btn";
import PoolList from "../list/pool-list";
import { Dispatch, RootState } from "../rematch";
import { TodoStatus } from "../types";
import { Button } from "antd";

const TodoTarget = () => {
    const targetLoading = useSelector(
        (state: RootState) => state.data.targetLoading
    );
    const targetList = useSelector((state: RootState) => state.data.targetList);
    const targetListOrigin = useSelector(
        (state: RootState) => state.data.targetListOrigin
    );
    const dispatch = useDispatch<Dispatch>();
    const { setTargetList, getFilterList, getTodo } = dispatch.data;
    useEffect(() => {
        setTargetList(getFilterList(targetListOrigin));
    }, [targetListOrigin]);

    const [isShowDoneTarget, setIsShowDoneTarget] = useState<boolean>(false);

    useEffect(() => {
        getTodo("target");
    }, []);

    return (
        <PoolList
            loading={targetLoading}
            sortKey={SortKeyMap.target}
            title="目标"
            btn={
                <>
                    <Button
                        onClick={() => setIsShowDoneTarget((prev) => !prev)}
                        type={!isShowDoneTarget ? "default" : "primary"}
                    >
                        {!isShowDoneTarget ? "未完成" : "已完成"}
                    </Button>
                </>
            }
            mapList={targetList
                .filter((item) =>
                    isShowDoneTarget
                        ? item.status === String(TodoStatus.done)
                        : item.status !== String(TodoStatus.done)
                )
                .sort((a, b) => Number(a.color) - Number(b.color))}
        />
    );
};

export default TodoTarget;
