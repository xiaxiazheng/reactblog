import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import TodoTreeList from "../../todo-tree-list";
import { SortKeyMap } from "../../component/sort-btn";
import { TodoTypeIcon } from "@xiaxiazheng/blog-libs";
import { useSettings } from "@xiaxiazheng/blog-libs";
import { RenderTodoDescriptionIcon } from "../todo-list";

const TodoBookMark = () => {
    const { todoNameMap, todoDescriptionMap } = useSettings();

    const bookMarkList = useSelector(
        (state: RootState) => state.data.bookMarkList
    );
    const bookMarkListOrigin = useSelector(
        (state: RootState) => state.data.bookMarkListOrigin
    );
    const bookMarkLoading = useSelector(
        (state: RootState) => state.data.bookMarkLoading
    );

    const dispatch = useDispatch<Dispatch>();
    const { setBookMarkList, getFilterList } = dispatch.data;

    useEffect(() => {
        setBookMarkList(
            getFilterList({ list: bookMarkListOrigin, type: "bookMark" })
        );
    }, [bookMarkListOrigin]);

    return (
        <TodoTreeList
            loading={bookMarkLoading}
            title={
                <>
                    <TodoTypeIcon type="bookMark" /> {todoNameMap?.bookMark}{" "}
                    <RenderTodoDescriptionIcon
                        title={todoDescriptionMap?.["bookMark"]}
                    />{" "}
                </>
            }
            sortKey={SortKeyMap.bookmark}
            mapList={bookMarkList.sort(
                (a, b) => Number(a.color) - Number(b.color)
            )}
        />
    );
};

export default TodoBookMark;
