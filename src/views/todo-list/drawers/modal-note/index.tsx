import React, { useContext } from "react";
import { Drawer, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import styles from "../index.module.scss";
import { ThemeContext } from "@/context/ThemeContext";
import TodoNote from "../../list/todo-note";

const ModalNote = () => {
    const { theme } = useContext(ThemeContext);

    const showNoteDrawer = useSelector(
        (state: RootState) => state.edit.showNoteDrawer
    );
    const dispatch = useDispatch<Dispatch>();
    const { setShowNoteDrawer } = dispatch.edit;

    return (
        <Modal
            closable={false}
            className={`${styles.noteDrawer} ${
                theme === "dark" ? "darkTheme" : ""
            }`}
            open={showNoteDrawer}
            onCancel={() => setShowNoteDrawer(false)}
            width="900px"
        >
            <TodoNote />
        </Modal>
    );
};

export default ModalNote;
