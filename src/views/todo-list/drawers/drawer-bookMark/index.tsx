import React, { useContext, useEffect } from "react";
import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import styles from "../index.module.scss";
import PoolList from "../../list/pool-list";
import { SortKeyMap } from "../../component/sort-btn";
import { ThemeContext } from "@/context/ThemeContext";

const DrawerBookMark = () => {
    const { theme } = useContext(ThemeContext);

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

    useEffect(() => {
      showBookMarkDrawer && getTodo("bookMark");
  }, [showBookMarkDrawer]);

    return (
        <Drawer
            closable={false}
            className={`${styles.bookMarkDrawer} ${
                theme === "dark" ? "darkTheme" : ""
            }`}
            open={showBookMarkDrawer}
            onClose={() => setShowBookMarkDrawer(false)}
            width="600px"
        >
            <PoolList
                loading={bookMarkLoading}
                title="书签"
                sortKey={SortKeyMap.bookmark}
                mapList={bookMarkList.sort(
                    (a, b) => Number(a.color) - Number(b.color)
                )}
            />
        </Drawer>
    );
};

export default DrawerBookMark;
