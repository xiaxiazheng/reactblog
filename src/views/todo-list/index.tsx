import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import DoneList from "./list/todo-done";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import EditTodoModal from "./component/edit-todo-modal";
import { HistoryOutlined, BookOutlined } from "@ant-design/icons";
import { SortKeyMap } from "./component/sort-btn";
import PunchTheClockModal from "./component/habit-detail-modal";
import GlobalSearch from "./component/global-search";
import TodoChainModal from "./component/toto-chain-modal";
import store, { Dispatch, RootState } from "./rematch";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/lib/form/Form";
import TodoAfter from "./list/todo-after";
import TodoToday, { RenderTodoDescriptionIcon } from "./list/todo-today";
import TodoTarget from "./list/todo-target";
import DrawerFootprint from "./drawers/drawer-footprint";
import DrawerNote from "./drawers/drawer-note";
import { Tooltip } from "antd";
import TodoBookMark from "./list/todo-bookmark";
import TodoHabit from "./list/todo-habit";
// import TodoFollowUp from "./list/todo-follow-up";
import { SettingsContext } from "@/context/SettingsContext";

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

const HoverOpen = () => {
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

const TodoList: React.FC = () => {
    useDocumentTitle("todo-list");

    const { todoNameMap, todoDescriptionMap } = useContext(SettingsContext);

    const [form] = useForm();
    const dispatch = useDispatch<Dispatch>();
    const { getCategory, getTodo } = dispatch.data;
    const { setForm } = dispatch.edit;
    const isWork = useSelector((state: RootState) => state.filter.isWork);
    useEffect(() => {
        setForm(form);
    }, [form]);

    useEffect(() => {
        // 这里不刷新 done list, 那个会在 global-search 里请求
        getCategory({});
        getTodo("todo");
        getTodo("target");
        getTodo("bookMark");
        getTodo("note");
        getTodo("habit");
        getTodo("followUp");
    }, [isWork]);

    // const [hoverIndex, setHoverIndex] = useState<number>();
    const [gridTemplateRows, setGridTemplateRows] = useState<string>("");
    const setHoverIndex = (hoverIndex?: number) => {
        if (typeof hoverIndex !== 'undefined') {
            const l = Array(isWork === "1" ? 2 : 3).fill("160px");
            l[hoverIndex] = '1fr';
            setGridTemplateRows(l.join(" "));
        } else {
            setGridTemplateRows('');
        }
    }
    // }, [hoverIndex]);

    return (
        <div className={styles.todoList}>
            <div>
                <div className={styles.Layout}>
                    <div className={styles.m}>
                        {/* 今日待办 */}
                        <div className={`${styles.mt} ScrollBar`}>
                            <TodoToday />
                        </div>
                        {/* 之后待办 */}
                        <div className={`${styles.mb} ScrollBar`}>
                            <TodoAfter />
                        </div>
                    </div>
                    {/* 已完成 */}
                    <div className={`${styles.rt} ScrollBar`}>
                        <GlobalSearch />
                        <div className="ScrollBar">
                            <DoneList
                                title={
                                    <>
                                        {todoNameMap?.["done"]}
                                        <RenderTodoDescriptionIcon
                                            title={todoDescriptionMap?.["done"]}
                                        />{" "}
                                    </>
                                }
                                key="done"
                                sortKey={SortKeyMap.done}
                            />
                        </div>
                    </div>
                    <div
                        className={styles.l}
                        style={{ gridTemplateRows }}
                        onMouseLeave={() => setHoverIndex(undefined)}
                    >
                        {/* Pin */}
                        <div className={`${styles.lt} ScrollBar`} onMouseEnter={() => setHoverIndex(0)}>
                            <TodoBookMark />
                        </div>
                        {/* 目标 */}
                        <div className={`${styles.lm} ScrollBar`} onMouseEnter={() => setHoverIndex(1)}>
                            <TodoTarget />
                        </div>
                        {/* 习惯 */}
                        {isWork !== "1" && (
                            <div className={`${styles.lb} ScrollBar`} onMouseEnter={() => setHoverIndex(2)}>
                                <TodoHabit />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <HoverOpen />
            {/* todo note 展示的抽屉 */}
            <DrawerNote />
            {/* todo 足迹展示的抽屉 */}
            <DrawerFootprint />
            {/* 新增/编辑 todo */}
            <EditTodoModal />
            {/* todo chain modal */}
            <TodoChainModal />
            {/* 打卡详情 */}
            <PunchTheClockModal />
        </div>
    );
};

const TodoListWrapper: React.FC = () => (
    <Provider store={store}>
        <TodoList />
    </Provider>
);

export default TodoListWrapper;
