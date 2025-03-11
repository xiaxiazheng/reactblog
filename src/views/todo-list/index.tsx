import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import DoneList from "./list/todo-done";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import EditTodoModal from "./component/edit-todo-modal";
import { SortKeyMap } from "./component/sort-btn";
import PunchTheClockModal from "./component/habit-detail-modal";
import GlobalSearch from "./component/global-search";
import TodoChainModal from "./component/toto-chain-modal";
import store, { Dispatch, RootState } from "./rematch";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/lib/form/Form";
import TodoAfter from "./list/todo-after";
import TodoList, { RenderTodoDescriptionIcon } from "./list/todo-list";
import TodoTarget from "./list/todo-target";
import DrawerFootprint from "./drawers/drawer-footprint";
import DrawerNote from "./drawers/drawer-note";
import TodoBookMark from "./list/todo-bookmark";
import TodoHabit from "./list/todo-habit";
import { SettingsContext } from "@/context/SettingsContext";
import HoverOpenBar from "./component/hover-open-bar";

const TodoListHome: React.FC = () => {
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
        getTodo("habit");
        getTodo("followUp");
    }, [isWork]);

    return (
        <div className={styles.todoList}>
            <div>
                <div className={styles.Layout}>
                    <div className={styles.l}>
                        {/* Pin */}
                        <div className={`${styles.lt} ScrollBar`}>
                            <TodoBookMark />
                        </div>
                        {/* 目标 */}
                        <div className={`${styles.lm} ScrollBar`}>
                            <TodoTarget />
                        </div>
                        {/* 习惯 */}
                        {isWork !== "1" && (
                            <div className={`${styles.lb} ScrollBar`}>
                                <TodoHabit />
                            </div>
                        )}
                    </div>
                    <div className={styles.m}>
                        {/* 待办列表 */}
                        <div className={`${styles.mt} ScrollBar`}>
                            <TodoList />
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
                </div>
            </div>
            {/* 右边竖栏，hover 打开具体模块 */}
            <HoverOpenBar />
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
        <TodoListHome />
    </Provider>
);

export default TodoListWrapper;
