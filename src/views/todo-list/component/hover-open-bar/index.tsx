import React, { useRef } from "react";
import styles from "./index.module.scss";
import { HistoryOutlined, BookOutlined } from "@ant-design/icons";
import { Dispatch } from "../../rematch";
import { useDispatch } from "react-redux";
import { Tooltip } from "antd";

const useTimer = (fn: Function, ms: number = 500) => {
    const timer = useRef<any>(null);

    const run = () => {
        timer.current = setTimeout(() => {
            fn();
        }, ms);
    };

    const cancel = () => {
        timer?.current && clearTimeout(timer.current);
    };

    return { run, cancel };
};

const HoverOpenBar = () => {
    const dispatch = useDispatch<Dispatch>();
    const { setShowFootprintDrawer, setShowNoteDrawer } = dispatch.edit;

    const { run: run1, cancel: cancel1 } = useTimer(() =>
        setShowNoteDrawer(true)
    );
    const { run: run2, cancel: cancel2 } = useTimer(() =>
        setShowFootprintDrawer(true)
    );

    return (
        <div className={styles.hoverOpen}>
            <Tooltip title="note" placement="left">
                <div
                    className={styles.bookMark}
                    onMouseEnter={() => run1()}
                    onMouseLeave={() => cancel1()}
                    onClick={() => {
                        setShowNoteDrawer(true);
                    }}
                >
                    <BookOutlined />
                </div>
            </Tooltip>
            <Tooltip title="足迹" placement="left">
                <div
                    className={styles.footprint}
                    onMouseEnter={() => run2()}
                    onMouseLeave={() => cancel2()}
                    onClick={() => {
                        setShowFootprintDrawer(true);
                    }}
                >
                    <HistoryOutlined />
                </div>
            </Tooltip>
        </div>
    );
};

export default HoverOpenBar;