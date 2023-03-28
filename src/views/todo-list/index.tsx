import React, { useEffect } from "react";
import styles from "./index.module.scss";
import DoneList from "./list/done-list";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import EditTodoModal from "./component/edit-todo-modal";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { SortKeyMap } from "./component/sort-btn";
import PunchTheClockModal from "./component/punch-the-clock-modal";
import GlobalSearch from "./component/global-search";
import TodoChainModal from "./component/toto-chain-modal";
import store, { Dispatch } from "./rematch";
import { Provider, useDispatch } from "react-redux";
import { useForm } from "antd/lib/form/Form";
import TodoAfter from "./todo-after";
import TodoToday from "./todo-today";
import TodoPool from "./todo-pool";
import TodoTarget from "./todo-target";
import DrawerBookMark from "./drawers/drawer-bookMark";
import DrawerFootprint from "./drawers/drawer-footprint";
import DrawerNote from "./drawers/drawer-note";

const HoverOpen = () => {
    const dispatch = useDispatch<Dispatch>();
    const { setShowFootprintDrawer } = dispatch.edit;

    return (
        <div
            className={styles.bookMark}
            onMouseEnter={() => setShowFootprintDrawer(true)}
            onClick={() => {
                setShowFootprintDrawer(true);
            }}
        >
            <ArrowLeftOutlined />
        </div>
    );
};

const TodoList: React.FC = () => {
    useDocumentTitle("todo-list");

    const [form] = useForm();
    const dispatch = useDispatch<Dispatch>();
    const { setForm } = dispatch.edit;
    useEffect(() => {
        setForm(form);
    }, [form]);

    return (
        <div className={styles.todoList}>
            <div>
                <div className={styles.Layout}>
                    {/* 之后待办 */}
                    <div className={`${styles.box1} ScrollBar`}>
                        <TodoAfter />
                    </div>
                    {/* 待办 */}
                    <div className={`${styles.box2} ScrollBar`}>
                        <TodoToday />
                    </div>
                    {/* 已完成 */}
                    <div className={`${styles.box3} ScrollBar`}>
                        <GlobalSearch />
                        <div className="ScrollBar">
                            <DoneList
                                title="已完成"
                                key="done"
                                sortKey={SortKeyMap.done}
                            />
                        </div>
                    </div>
                    {/* 待办池 */}
                    <div className={`${styles.box4} ScrollBar`}>
                        <TodoPool />
                    </div>
                    {/* 目标 */}
                    <div className={`${styles.box5} ScrollBar`}>
                        <TodoTarget />
                    </div>
                </div>
            </div>
            <HoverOpen />
            {/* 书签展示的抽屉 */}
            <DrawerBookMark />
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
