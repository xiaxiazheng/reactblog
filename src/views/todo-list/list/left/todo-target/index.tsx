import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortKeyMap } from "../../../component/sort-btn";
import TodoTreeList from "../../../todo-tree-list";
import { Dispatch, RootState } from "../../../rematch";
import { Button } from "antd";
import { TodoTypeIcon } from "@xiaxiazheng/blog-libs";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";
import { RenderTodoDescriptionIcon } from "../../middle/todo-list";

interface IProps {
    onClickTitle?: (key: SortKeyMap) => void;
    isHideList?: boolean;
}

const TodoTarget = ({ onClickTitle, isHideList }: IProps) => {
    const { todoNameMap, todoDescriptionMap } = useSettingsContext();

    const targetLoading = useSelector(
        (state: RootState) => state.data.targetLoading
    );
    const targetList = useSelector((state: RootState) => state.data.targetList);
    const targetListOrigin = useSelector(
        (state: RootState) => state.data.targetListOrigin
    );
    const isTarget = useSelector((state: RootState) => state.filter.isTarget);
    const dispatch = useDispatch<Dispatch>();
    const { setTargetList, getFilterList } = dispatch.data;
    const { setIsTarget } = dispatch.filter;
    useEffect(() => {
        setTargetList(
            getFilterList({ list: targetListOrigin, type: "target" })
        );
    }, [targetListOrigin]);

    return (
        <TodoTreeList
            loading={targetLoading}
            sortKey={SortKeyMap.target}
            title={
                <>
                    <TodoTypeIcon type="isTarget" /> {todoNameMap?.isTarget}{" "}
                    <RenderTodoDescriptionIcon
                        title={todoDescriptionMap?.["target"]}
                    />{" "}
                </>
            }
            onClickTitle={onClickTitle}
            isHideList={isHideList}
            btn={
                <>
                    <Button
                        onClick={() => setIsTarget(isTarget === "1" ? "0" : "1")}
                        type={isTarget === "1" ? "primary" : "default"}
                    >
                        查看已完成
                    </Button>
                </>
            }
            mapList={targetList.sort(
                (a, b) => Number(a.color) - Number(b.color)
            )}
            isShowFilterInput={true}
        />
    );
};

export default TodoTarget;
