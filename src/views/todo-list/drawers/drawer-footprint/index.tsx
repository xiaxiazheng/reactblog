import React, { useContext } from "react";
import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import styles from "../index.module.scss";
import { ThemeContext } from "@/context/ThemeContext";
import TodoFootPrint from "../../todo-footprint";

const DrawerFootprint = () => {
    const { theme } = useContext(ThemeContext);

    const showFootprintDrawer = useSelector(
        (state: RootState) => state.edit.showFootprintDrawer
    );
    const dispatch = useDispatch<Dispatch>();
    const { setShowFootprintDrawer } = dispatch.edit;

    return (
        <Drawer
            closable={false}
            className={`${styles.footprintDrawer} ${
                theme === "dark" ? "darkTheme" : ""
            }`}
            open={showFootprintDrawer}
            onClose={() => setShowFootprintDrawer(false)}
            width="600px"
        >
            <div onMouseLeave={() => setShowFootprintDrawer(false)}>
                <TodoFootPrint visible={showFootprintDrawer} />
            </div>
        </Drawer>
    );
};

export default DrawerFootprint;
