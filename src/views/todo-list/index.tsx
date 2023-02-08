import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { Button, Drawer, Form, message, Tooltip } from "antd";
import { formatArrayToTimeMap } from "./utils";
import List from "./list";
import DoneList from "./done-list";
import PoolList from "./pool-list";
import moment from "moment";
import { getTodoList } from "@/client/TodoListHelper";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import EditTodoModal from "./component/edit-todo-modal";
import { TodoItemType, StatusType, TodoStatus, OperatorType } from "./types";
import {
    AimOutlined,
    ArrowLeftOutlined,
    BookOutlined,
    QuestionCircleOutlined,
    StarFilled,
} from "@ant-design/icons";
import { useUpdateFlag } from "./hooks";
import { TodoProvider } from "./TodoContext";
import { ThemeContext } from "@/context/ThemeContext";
import { SortKeyMap } from "./component/sort-btn";

const TodoList: React.FC = () => {
    const { theme } = useContext(ThemeContext);

    useDocumentTitle("todo-list");

    const [todoLoading, setTodoLoading] = useState<boolean>(false);
    const [poolLoading, setPoolLoading] = useState<boolean>(false);
    const [targetLoading, setTargetLoading] = useState<boolean>(false);
    const [bookMarkLoading, setBookMarkLoading] = useState<boolean>(false);

    const [isRefreshDone, setIsRefreshDone] = useState<boolean>(false);

    const [isShowDoneTarget, setIsShowDoneTarget] = useState<boolean>(false);

    const getTodo = async (type: StatusType) => {
        if (type === "bookMark") {
            setTargetLoading(true);
            const req: any = {
                isBookMark: "1",
                pageNo: 1,
                pageSize: 100,
            };
            const res = await getTodoList(req);
            if (res) {
                setBookMarkList(res.data.list);
                setBookMarkLoading(false);
            } else {
                message.error("获取 todolist 失败");
            }
        } else if (type === "target") {
            setTargetLoading(true);
            const req: any = {
                isTarget: "1",
                pageNo: 1,
                pageSize: 100,
            };
            const res = await getTodoList(req);
            if (res) {
                setTargetList(res.data.list);
                setTargetLoading(false);
            } else {
                message.error("获取 todolist 失败");
            }
        } else if (type === "done") {
            setIsRefreshDone(true);
        } else {
            type === "todo" && setTodoLoading(true);
            type === "pool" && setPoolLoading(true);

            const req: any = {
                status: TodoStatus[type],
            };

            const res = await getTodoList(req);
            if (res) {
                if (type === "todo") {
                    setTodoList(res.data);
                    setTodoLoading(false);
                }
                if (type === "pool") {
                    setPoolList(res.data);
                    setPoolLoading(false);
                }
            } else {
                message.error("获取 todolist 失败");
            }
        }
    };

    useEffect(() => {
        getTodo("todo");
        getTodo("done");
        getTodo("pool");
        getTodo("target");
        getTodo("bookMark");
    }, []);

    // 列表
    const [todoList, setTodoList] = useState<TodoItemType[]>([]);
    const [poolList, setPoolList] = useState<TodoItemType[]>([]);
    const [targetList, setTargetList] = useState<TodoItemType[]>([]);
    const [bookMarkList, setBookMarkList] = useState<TodoItemType[]>([]);
    // 编辑相关
    const [operatorType, setOperatorType] = useState<OperatorType>();
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();

    const handleAdd = () => {
        setActiveTodo(undefined);
        setOperatorType("add");
        setShowEdit(true);
        form.setFieldsValue({
            time: moment(),
            status: TodoStatus.todo,
            color: "3",
            category: "其他",
        });
    };

    const handleEdit = (item: TodoItemType) => {
        setActiveTodo(item);
        setOperatorType("edit");
        setShowEdit(true);
    };

    useEffect(() => {
        if (activeTodo) {
            const item = activeTodo;
            form.setFieldsValue({
                name: item.name,
                description: item.description,
                time: moment(item.time),
                status: Number(item.status),
                color: item.color,
                category: item.category,
                other_id: item.other_id,
                doing: item.doing,
                isNote: item.isNote,
                isTarget: item.isTarget,
                isBookMark: item.isBookMark,
            });
        }
    }, [activeTodo]);

    const [form] = Form.useForm();

    const { updateFlag } = useUpdateFlag();

    const refreshData = () => {
        getTodo("todo");
        getTodo("done");
        getTodo("pool");
        getTodo("target");
        getTodo("bookMark");
        updateFlag();
    };

    const [showDrawer, setShowDrawer] = useState<boolean>(false);

    const today = moment().format("YYYY-MM-DD");

    return (
        <div className={styles.todoList}>
            <div>
                <div className={styles.Layout}>
                    {/* 之后待办 */}
                    <div className={`${styles.box1} ScrollBar`}>
                        <List
                            loading={poolLoading}
                            getTodo={getTodo}
                            sortKey={SortKeyMap.after}
                            key="after"
                            title="之后待办"
                            mapList={formatArrayToTimeMap(
                                todoList.filter((item) => item.time > today)
                            )}
                            handleEdit={handleEdit}
                            refreshData={refreshData}
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
                            handleAdd={handleAdd}
                            handleEdit={handleEdit}
                            refreshData={refreshData}
                            showRefresh={true}
                            showDoneIcon={true}
                        />
                    </div>
                    {/* 已完成 */}
                    <div className={`${styles.box3} ScrollBar`}>
                        <DoneList
                            title="已完成"
                            key="done"
                            sortKey={SortKeyMap.done}
                            handleEdit={handleEdit}
                            isRefreshDone={isRefreshDone}
                            setIsRefreshDone={setIsRefreshDone}
                            refreshData={refreshData}
                        />
                    </div>
                    {/* 待办池 */}
                    <div className={`${styles.box4} ScrollBar`}>
                        <PoolList
                            loading={poolLoading}
                            sortKey={SortKeyMap.pool}
                            getTodo={getTodo}
                            title="待办池"
                            mapList={poolList}
                            handleEdit={handleEdit}
                            refreshData={refreshData}
                            showDoneIcon={true}
                        />
                    </div>
                    {/* 目标 */}
                    <div className={`${styles.box5} ScrollBar`}>
                        <PoolList
                            loading={targetLoading}
                            getTodo={getTodo}
                            sortKey={SortKeyMap.target}
                            title="目标"
                            showSearch={false}
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
                            mapList={targetList.filter((item) =>
                                isShowDoneTarget
                                    ? item.status === String(TodoStatus.done)
                                    : item.status !== String(TodoStatus.done)
                            ).sort((a, b) => Number(a.color) - Number(b.color))}
                            handleEdit={handleEdit}
                            refreshData={refreshData}
                        />
                    </div>
                </div>
            </div>
            <div
                className={styles.bookMark}
                onMouseEnter={() => setShowDrawer(true)}
                onClick={() => {
                    setShowDrawer(true);
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
                visible={showDrawer}
                onClose={() => setShowDrawer(false)}
                width="400px"
            >
                <PoolList
                    loading={bookMarkLoading}
                    getTodo={getTodo}
                    title="书签"
                    sortKey={SortKeyMap.bookmark}
                    mapList={bookMarkList.sort((a, b) => Number(a.color) - Number(b.color))}
                    handleEdit={handleEdit}
                    refreshData={refreshData}
                />
            </Drawer>
            {/* 新增/编辑 todo */}
            <EditTodoModal
                type={operatorType || "add"}
                setType={setOperatorType}
                visible={showEdit}
                onClose={() => {
                    setActiveTodo(undefined);
                    setShowEdit(false);
                    form.resetFields();
                }}
                activeTodo={activeTodo}
                setActiveTodo={setActiveTodo}
                form={form}
                refreshData={refreshData}
            />
        </div>
    );
};

const TodoListWrapper: React.FC = () => (
    <TodoProvider>
        <TodoList />
    </TodoProvider>
);

export default TodoListWrapper;
