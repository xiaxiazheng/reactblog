import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import DoneList from "./list/todo-done";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import EditTodoModal from "./component/edit-todo-modal";
import { SortKeyMap } from "./component/sort-btn";
import GlobalSearch from "./component/global-search";
import TodoChainModal from "./component/toto-chain-modal";
import store, { Dispatch, RootState } from "./rematch";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/lib/form/Form";
import TodoAfter from "./list/middle/todo-after";
import TodoList, { RenderTodoDescriptionIcon } from "./list/middle/todo-list";
import TodoTarget from "./list/left/todo-target";
import DrawerFootprint from "./component/drawer-footprint";
import TodoBookMark from "./list/left/todo-bookmark";
import TodoDirectory from "./list/left/todo-directory";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";
import HoverOpenBar from "./component/hover-open-bar";
import TodoNote from "./list/todo-note";

const TodoListHome: React.FC = () => {
    useDocumentTitle("todo-list");

    const { todoNameMap, todoDescriptionMap } = useSettingsContext();

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
        getTodo({ type: "todo" });
        getTodo({ type: "target" });
        getTodo({ type: "bookMark" });
        getTodo({ type: "directory" });
        getTodo({ type: "followUp" });
    }, [isWork]);

    const [activeLeft, setActiveLeft] = useState<SortKeyMap | "">("");
    const onClickTitleLeft = (key: SortKeyMap) => {
        setActiveLeft(key === activeLeft ? '' : key);
    };

    const [activeMiddle, setActiveMiddle] = useState<SortKeyMap | "">("");
    const onClickTitleMiddle = (key: SortKeyMap) => {
        setActiveMiddle(key === activeMiddle ? '' : key);
    };

    return (
        <div className={styles.todoList}>
            <div>
                <div className={styles.Layout}>
                    <div className={styles.l}>
                        {/* 置顶书签 */}
                        <div className={`${styles.lt} ScrollBar`}>
                            <TodoBookMark onClickTitle={onClickTitleLeft} isHideList={!(activeLeft === '' || activeLeft === SortKeyMap.bookmark)} />
                        </div>
                        {/* 目标 */}
                        <div className={`${styles.lm} ScrollBar`}>
                            <TodoTarget  onClickTitle={onClickTitleLeft} isHideList={!(activeLeft === '' || activeLeft === SortKeyMap.target)} />
                        </div>
                        {/* 知识目录 */}
                        {isWork !== "1" && (
                            <div className={`${styles.lb} ScrollBar`}>
                                <TodoDirectory  onClickTitle={onClickTitleLeft} isHideList={!(activeLeft === '' || activeLeft === SortKeyMap.directory)} />
                            </div>
                        )}
                    </div>
                    <div className={styles.m}>
                        {/* 待办列表 */}
                        <div className={`${styles.mt} ScrollBar`}>
                            <TodoList  onClickTitle={onClickTitleMiddle} isHideList={!(activeMiddle === '' || activeMiddle === SortKeyMap.todo)} />
                        </div>
                        {/* 之后待办 */}
                        <div className={`${styles.mb} ScrollBar`}>
                            <TodoAfter  onClickTitle={onClickTitleMiddle} isHideList={!(activeMiddle === '' || activeMiddle === SortKeyMap.after)} />
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
            {/* todo note 展示的弹窗 */}
            <TodoNote />
            {/* todo 足迹展示的抽屉 */}
            <DrawerFootprint />
            {/* 新增/编辑 todo */}
            <EditTodoModal />
            {/* todo chain modal */}
            <TodoChainModal />
        </div>
    );
};

const TodoListWrapper: React.FC = () => (
    <Provider store={store}>
        <TodoListHome />
    </Provider>
);

export default TodoListWrapper;
