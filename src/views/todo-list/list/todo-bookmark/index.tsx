import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import TodoAllList from "../../todo-all-list";
import { SortKeyMap } from "../../component/sort-btn";
import TodoTypeIcon from "../../component/todo-type-icon";
import { SettingsContext } from "@/context/SettingsContext";
import { RenderTodoDescriptionIcon } from "../todo-list";

const TodoBookMark = () => {
    const { todoNameMap, todoDescriptionMap } = useContext(SettingsContext);

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
        <TodoAllList
            loading={bookMarkLoading}
            title={
                <>
                    <TodoTypeIcon type="bookMark" /> {todoNameMap.bookMark}{" "}
                    <RenderTodoDescriptionIcon
                        title={todoDescriptionMap?.["bookMark"]}
                    />{" "}
                </>
            }
            sortKey={SortKeyMap.bookmark}
            mapList={bookMarkList.sort(
                (a, b) => Number(a.color) - Number(b.color)
            )}
            // input={
            //     <Input
            //         style={{
            //             margin: "10px 20px",
            //             width: "calc(100% - 40px)",
            //         }}
            //         value={localKeyword}
            //         onChange={(e) => setLocalKeyword(e.target.value)}
            //     />
            // }
        />
    );
};

export default TodoBookMark;
