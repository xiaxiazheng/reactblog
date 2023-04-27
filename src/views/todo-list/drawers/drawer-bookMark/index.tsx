import React, { useContext } from "react";
import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import styles from "../index.module.scss";
import { ThemeContext } from "@/context/ThemeContext";
import TodoBookMark from "../../list/todo-bookmark";

const DrawerBookMark = () => {
    const { theme } = useContext(ThemeContext);

    const showBookMarkDrawer = useSelector(
        (state: RootState) => state.edit.showBookMarkDrawer
    );
    const dispatch = useDispatch<Dispatch>();
    const { setShowBookMarkDrawer } = dispatch.edit;
    const { setLocalKeyword } = dispatch.filter;

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
            <TodoBookMark />
        </Drawer>
    );
};

export default DrawerBookMark;
