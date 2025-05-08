import React, { useContext, useEffect, useState } from "react";
import { Button, message, Tooltip } from "antd";
import { formatArrayToTimeMap } from "../../utils";
import List from "../../todo-split-day-list";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { SortKeyMap } from "../../component/sort-btn";
import { Dispatch, RootState } from "../../rematch";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import TodoTypeIcon from "../../component/todo-type-icon";
import { SettingsContext } from "@/context/SettingsContext";
import styles from "./index.module.scss";
import { getExtraDayjs, getToday } from "@/components/amdin-header/utils";
import { TodoItemType } from "../../types";

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
    const { todoNameMap, todoDescriptionMap, todoShowBeforeToday } = useContext(SettingsContext);

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

    const [isShowFollowUp, setIsShowFollowUp] = useState<boolean>(true);
    const [isShowLastXdays, setIsShowLastXdays] = useState<boolean>(true);
    useEffect(() => {
        setIsShowLastXdays(localStorage.getItem('isShowLastXdays') === 'true');
    }, []);
    const updateIsShowLastXdays = () => {
        const temp = !isShowLastXdays;
        message.info(temp ? todoShowBeforeToday?.text : '看所有 todo', 1);
        setIsShowLastXdays(temp);
        localStorage.setItem('isShowLastXdays', temp ? todoShowBeforeToday?.days : 0);
        getTodo({ type: 'todo' });
    }

    // 获取最近 x 天的 todo
    const getLastXDayList = (list: TodoItemType[]) => {
        const d = todoShowBeforeToday?.days || 0;
        return list.filter(item => {
            if (item.time === getToday().format('YYYY-MM-DD')) {
                return true;
            }
            if (getExtraDayjs(item.time).isBefore(getExtraDayjs(dayjs())) && getExtraDayjs(item.time).isAfter(getExtraDayjs(dayjs()).subtract(d + 1, 'day'))) {
                return true;
            }
        });
    }

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
                isShowLastXdays ? getLastXDayList(todoList
                    .concat(isShowFollowUp ? followUpList : [])) :
                    todoList
                        .filter((item) => item.time <= Today())
                        .concat(isShowFollowUp ? followUpList : [])
            )}
            showDoneIcon={true}
            isReverseTime={true}
            btnChildren={
                <>
                    <Tooltip title={`${todoShowBeforeToday?.text}`}>
                        <Button
                            type={isShowLastXdays ? "primary" : "default"}
                            onClick={updateIsShowLastXdays}
                            icon={
                                <TodoTypeIcon
                                    type="onlyToday"
                                    style={
                                        !isShowLastXdays
                                            ? { color: "#ffeb3b" }
                                            : {}
                                    }
                                />
                            }
                        ></Button>
                    </Tooltip>
                    {
                        followUpList.length ? (
                            <Tooltip title={`查看 ${todoNameMap?.followUp}`}>
                                <Button
                                    type={isShowFollowUp ? "primary" : "default"}
                                    onClick={() => setIsShowFollowUp((prev) => !prev)}
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
                        ) : null
                    }
                </>
            }
        />
    );
};

export default TodoList;
