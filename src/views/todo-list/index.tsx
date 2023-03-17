import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { Button, Drawer, Space, Tooltip } from "antd";
import { formatArrayToTimeMap } from "./utils";
import List from "./list";
import DoneList from "./done-list";
import PoolList from "./pool-list";
import moment from "moment";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import EditTodoModal from "./component/edit-todo-modal";
import { TodoStatus } from "./types";
import {
    AimOutlined,
    ArrowLeftOutlined,
    BookOutlined,
    QuestionCircleOutlined,
    StarFilled,
} from "@ant-design/icons";
import { TodoEditProvider } from "./TodoEditContext";
import { ThemeContext } from "@/context/ThemeContext";
import { SortKeyMap } from "./component/sort-btn";
import PunchTheClockModal from "./component/punch-the-clock-modal";
import TodoNote from "./todo-note";
import { TodoDataContext, TodoDataProvider } from "./TodoDataContext";
import GlobalSearch from "./component/global-search";
import TodoChainModal from "./component/toto-chain-modal";

const TodoList: React.FC = () => {
    const { theme } = useContext(ThemeContext);

    const {
        todoLoading,
        poolLoading,
        targetLoading,
        bookMarkLoading,
        todoList,
        poolList,
        targetList,
        bookMarkList,
        getTodo,
    } = useContext(TodoDataContext);

    useDocumentTitle("todo-list");

    const [isShowDoneTarget, setIsShowDoneTarget] = useState<boolean>(false);

    // 打卡相关
    const [showPunchTheClock, setShowPunchTheClock] = useState<boolean>(false);

    // 书签抽屉
    const [showBookMarkDrawer, setShowBookMarkDrawer] =
        useState<boolean>(false);
    const [showNoteDrawer, setShowNoteDrawer] = useState<boolean>(false);
    useEffect(() => {
        showBookMarkDrawer && getTodo("bookMark");
    }, [showBookMarkDrawer]);

    const today = moment().format("YYYY-MM-DD");

    return (
        <div className={styles.todoList}>
            <div>
                <div className={styles.Layout}>
                    {/* 之后待办 */}
                    <div className={`${styles.box1} ScrollBar`}>
                        <List
                            loading={todoLoading}
                            getTodo={getTodo}
                            sortKey={SortKeyMap.after}
                            key="after"
                            title="之后待办"
                            mapList={formatArrayToTimeMap(
                                todoList.filter((item) => item.time > today)
                            )}
                        />
                    </div>
                    {/* 待办 */}
                    <div className={`${styles.box2} ScrollBar`}>
                        <List
                            loading={todoLoading}
                            getTodo={getTodo}
                            sortKey={SortKeyMap.todo}
                            title={
                                <>
                                    今日待办{" "}
                                    <Tooltip
                                        title={
                                            <>
                                                <div>
                                                    <AimOutlined
                                                        style={{
                                                            marginRight: 5,
                                                            color: "#ffeb3b",
                                                        }}
                                                    />
                                                    这个是目标
                                                </div>
                                                <div>
                                                    <BookOutlined
                                                        style={{
                                                            marginRight: 5,
                                                            color: "#ffeb3b",
                                                        }}
                                                    />
                                                    这个是已存档
                                                </div>
                                                <div>
                                                    <StarFilled
                                                        style={{
                                                            marginRight: 5,
                                                            color: "#ffeb3b",
                                                        }}
                                                    />
                                                    这个是书签
                                                </div>
                                                <div>
                                                    整个 title
                                                    变黄，是指现在处理。
                                                </div>
                                            </>
                                        }
                                        placement="bottom"
                                    >
                                        <QuestionCircleOutlined
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Tooltip>{" "}
                                </>
                            }
                            mapList={formatArrayToTimeMap(
                                todoList.filter(
                                    (item) =>
                                        item.time <= today &&
                                        item.isTarget !== "1"
                                )
                            )}
                            showAdd={true}
                            showDoneIcon={true}
                        />
                    </div>
                    {/* 已完成 */}
                    <div className={`${styles.box3} ScrollBar`}>
                        <GlobalSearch>
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setShowBookMarkDrawer(true);
                                    }}
                                >
                                    书签
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setShowNoteDrawer(true);
                                    }}
                                >
                                    存档
                                </Button>
                            </Space>
                        </GlobalSearch>
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
                        <PoolList
                            loading={poolLoading}
                            sortKey={SortKeyMap.pool}
                            title="待办池"
                            mapList={poolList}
                            showDoneIcon={true}
                        />
                    </div>
                    {/* 目标 */}
                    <div className={`${styles.box5} ScrollBar`}>
                        <PoolList
                            loading={targetLoading}
                            sortKey={SortKeyMap.target}
                            title="目标"
                            btn={
                                <>
                                    <Button
                                        onClick={() =>
                                            setIsShowDoneTarget((prev) => !prev)
                                        }
                                        type={
                                            !isShowDoneTarget
                                                ? "default"
                                                : "primary"
                                        }
                                    >
                                        {!isShowDoneTarget
                                            ? "未完成"
                                            : "已完成"}
                                    </Button>
                                </>
                            }
                            mapList={targetList
                                .filter((item) =>
                                    isShowDoneTarget
                                        ? item.status ===
                                          String(TodoStatus.done)
                                        : item.status !==
                                          String(TodoStatus.done)
                                )
                                .sort(
                                    (a, b) => Number(a.color) - Number(b.color)
                                )}
                        />
                    </div>
                </div>
            </div>
            <div
                className={styles.bookMark}
                onMouseEnter={() => setShowBookMarkDrawer(true)}
                onClick={() => {
                    setShowBookMarkDrawer(true);
                }}
            >
                <ArrowLeftOutlined />
            </div>
            {/* 书签展示的抽屉 */}
            <Drawer
                closable={false}
                className={`${styles.bookMarkDrawer} ${
                    theme === "dark" ? "darkTheme" : ""
                }`}
                visible={showBookMarkDrawer}
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
            {/* todo note 展示的抽屉 */}
            <Drawer
                closable={false}
                className={`${styles.noteDrawer} ${
                    theme === "dark" ? "darkTheme" : ""
                }`}
                visible={showNoteDrawer}
                onClose={() => setShowNoteDrawer(false)}
                width="900px"
            >
                <TodoNote />
            </Drawer>
            {/* 新增/编辑 todo */}
            <EditTodoModal />
            {/* todo chain modal */}
            <TodoChainModal />
            {/* 打卡详情 */}
            {/* <PunchTheClockModal
                visible={showPunchTheClock}
                onClose={() => {
                    setActiveTodo(undefined);
                    setShowPunchTheClock(false);
                }}
                activeTodo={
                    showPunchTheClock
                        ? targetList.find(
                              (item) => item.todo_id === activeTodo?.todo_id
                          )
                        : undefined
                }
    
            /> */}
        </div>
    );
};

const TodoListWrapper: React.FC = () => (
    <TodoDataProvider>
        <TodoEditProvider>
            <TodoList />
        </TodoEditProvider>
    </TodoDataProvider>
);

export default TodoListWrapper;
