import React, { useContext, useEffect } from "react";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import PoolList from "../../todo-all-list";
import { SortKeyMap } from "../../component/sort-btn";
import { TodoItemType } from "../../types";
import TodoTypeIcon from "../../component/todo-type-icon";

const TodoBookMark = () => {
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
        <PoolList
            loading={bookMarkLoading}
            title={
                <>
                    <TodoTypeIcon type="pin" /> Pin
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
