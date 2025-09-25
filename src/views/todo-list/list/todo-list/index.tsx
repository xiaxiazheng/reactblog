import React, { useContext, useEffect, useState } from "react";
import { Button, message, Popconfirm, Space, Tooltip } from "antd";
import { formatArrayToTimeMap } from "../../utils";
import List from "../../todo-split-day-list";
import { QuestionCircleOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import { SortKeyMap } from "../../component/sort-btn";
import { Dispatch, RootState } from "../../rematch";
import { useDispatch, useSelector } from "react-redux";
import { editTodoItem, TodoItemType, TodoStatus, TodoTypeIcon } from "@xiaxiazheng/blog-libs";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";
import { getToday } from "@/components/header-admin/utils";
import styles from './index.module.scss';

export const RenderTodoDescriptionIcon = (props: { title: any }) => {
    const { title } = props;
    if (!title) return null;

    return (
        <Tooltip title={title} placement="bottom">
            <QuestionCircleOutlined style={{ cursor: "pointer" }} />
        </Tooltip>
    );
};

const TodoList = () => {
    const { todoNameMap, todoDescriptionMap, todoShowBeforeToday } =
        useSettingsContext();

    const Today = () => getToday().format("YYYY-MM-DD");

    const todoLoading = useSelector(
        (state: RootState) => state.data.todoLoading
    );
    const todoList = useSelector((state: RootState) => state.data.todoList);
    const todoListOrigin = useSelector(
        (state: RootState) => state.data.todoListOrigin
    );
    const dispatch = useDispatch<Dispatch>();
    const { setTodoList, getFilterList, getTodo } = dispatch.data;

    useEffect(() => {
        setTodoList(getFilterList({ list: todoListOrigin, type: "todo" }));
    }, [todoListOrigin]);

    // 待跟进
    const followUpLoading = useSelector(
        (state: RootState) => state.data.followUpLoading
    );
    const followUpList = useSelector(
        (state: RootState) => state.data.followUpList
    );
    const followUpListOrigin = useSelector(
        (state: RootState) => state.data.followUpListOrigin
    );
    const { setFollowUpList } = dispatch.data;
    useEffect(() => {
        setFollowUpList(
            getFilterList({ list: followUpListOrigin, type: "followUp" })
        );
    }, [followUpListOrigin]);

    // 是否展示待跟进的数据
    const [isShowFollowUp, setIsShowFollowUp] = useState<boolean>(true);
    // 是否只展示最近 x 条数据
    const [isShowLastLimit, setIsShowLastLimit] = useState<boolean>(true);
    useEffect(() => {
        setIsShowLastLimit(
            localStorage.getItem("isShowLastLimit") ===
            `${todoShowBeforeToday?.limit}`
        );
    }, [todoShowBeforeToday?.limit]);
    const updateIsShowLastLimit = () => {
        const temp = !isShowLastLimit;
        message.info(temp ? todoShowBeforeToday?.text : "看所有 todo", 1);
        setIsShowLastLimit(temp);
        localStorage.setItem(
            "isShowLastLimit",
            temp ? todoShowBeforeToday?.limit : 500
        );
        getTodo({ type: "todo" });
    };

    // 把过期 todo 的日期调整成今天
    const changeExpireToToday = async (list: TodoItemType[]) => {
        const promiseList = list.filter(item => String(item.status) === String(TodoStatus.todo)).map((item) => {
            return editTodoItem({
                ...item,
                time: Today(),
            });
        });
        const res = await Promise.all(promiseList);
        if (res) {
            message.success(`Todo 日期调整成功`);
            getTodo({ type: "todo" });
        }
    };

    return (
        <List
            loading={todoLoading || followUpLoading}
            sortKey={SortKeyMap.todo}
            showDoingBtn={true}
            title={
                <>
                    {todoNameMap?.["today"]}{" "}
                    <RenderTodoDescriptionIcon
                        title={todoDescriptionMap?.["today"]}
                    />{" "}
                </>
            }
            mapList={formatArrayToTimeMap(
                todoList
                    .filter((item) => item.time <= Today())
                    .concat(isShowFollowUp ? followUpList : [])
            )}
            isReverseTime={true}
            btnChildren={
                <>
                    <Tooltip title={`${todoShowBeforeToday?.text}`}>
                        <Button
                            type={isShowLastLimit ? "primary" : "default"}
                            onClick={updateIsShowLastLimit}
                        >
                            {todoShowBeforeToday?.limit}
                        </Button>
                    </Tooltip>
                    {followUpList.length ? (
                        <Tooltip title={`查看 ${todoNameMap?.followUp}`}>
                            <Button
                                type={isShowFollowUp ? "primary" : "default"}
                                onClick={() =>
                                    setIsShowFollowUp((prev) => !prev)
                                }
                                icon={
                                    <TodoTypeIcon
                                        type="followUp"
                                        style={
                                            !isShowFollowUp
                                                ? { color: "#ffeb3b" }
                                                : {}
                                        }
                                    />
                                }
                            ></Button>
                        </Tooltip>
                    ) : null}
                </>
            }
            renderDateBtn={(time: string) => {
                return (
                    <Space size={6}>
                        {time < Today() && (
                            <Popconfirm
                                title={`是否将 ${time} 的 Todo 日期调整成今天`}
                                onConfirm={() =>
                                    changeExpireToToday(
                                        formatArrayToTimeMap(
                                            todoList
                                                .filter((item) => item.time <= Today())
                                                .concat(isShowFollowUp ? followUpList : [])
                                        )[time]
                                    )
                                }
                                okText="Yes"
                                cancelText="No"
                            >
                                <Tooltip title={"调整日期"}>
                                    <VerticalAlignTopOutlined
                                        title="调整日期"
                                        className={
                                            styles.icon
                                        }
                                    />
                                </Tooltip>
                            </Popconfirm>
                        )}
                    </Space>
                )
            }}
        />
    );
};

export default TodoList;
