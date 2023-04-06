import React, { useContext, useEffect } from "react";
import { Drawer, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import styles from "../index.module.scss";
import PoolList from "../../list/pool-list";
import { SortKeyMap } from "../../component/sort-btn";
import { ThemeContext } from "@/context/ThemeContext";
import { TodoItemType } from "../../types";

const DrawerBookMark = () => {
    const { theme } = useContext(ThemeContext);

    const localKeyword = useSelector(
        (state: RootState) => state.filter.localKeyword
    );
    const bookMarkList = useSelector(
        (state: RootState) => state.data.bookMarkList
    );
    const bookMarkLoading = useSelector(
        (state: RootState) => state.data.bookMarkLoading
    );
    const showBookMarkDrawer = useSelector(
        (state: RootState) => state.edit.showBookMarkDrawer
    );
    const dispatch = useDispatch<Dispatch>();
    const { setShowBookMarkDrawer } = dispatch.edit;
    const { getTodo } = dispatch.data;
    const { setLocalKeyword } = dispatch.filter;

    useEffect(() => {
        showBookMarkDrawer && getTodo("bookMark");
    }, [showBookMarkDrawer]);

    const handleFilter = (list: TodoItemType[]) => {
        return list.filter(
            (item) =>
                !localKeyword ||
                item.name.toLowerCase().indexOf(localKeyword.toLowerCase()) !==
                    -1 ||
                item.description
                    .toLowerCase()
                    .indexOf(localKeyword.toLowerCase()) !== -1
        );
    };

    return (
        <Drawer
            closable={false}
            className={`${styles.bookMarkDrawer} ${
                theme === "dark" ? "darkTheme" : ""
            }`}
            open={showBookMarkDrawer}
            onClose={() => {
                setShowBookMarkDrawer(false);
                setLocalKeyword("");
            }}
            width="600px"
        >
            <PoolList
                loading={bookMarkLoading}
                title="书签"
                sortKey={SortKeyMap.bookmark}
                mapList={handleFilter(bookMarkList).sort(
                    (a, b) => Number(a.color) - Number(b.color)
                )}
                isModalOrDrawer={true}
                input={
                    <Input
                        style={{
                            margin: "10px 20px",
                            width: "calc(100% - 40px)",
                        }}
                        value={localKeyword}
                        onChange={(e) => setLocalKeyword(e.target.value)}
                    />
                }
            />
        </Drawer>
    );
};

export default DrawerBookMark;
