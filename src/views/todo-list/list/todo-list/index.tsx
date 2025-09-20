import React, { useContext, useEffect, useState } from "react";
import { Button, message, Tooltip } from "antd";
import { formatArrayToTimeMap } from "../../utils";
import List from "../../todo-split-day-list";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { SortKeyMap } from "../../component/sort-btn";
import { Dispatch, RootState } from "../../rematch";
import { useDispatch, useSelector } from "react-redux";
import { TodoTypeIcon } from "@xiaxiazheng/blog-libs";
import { SettingsContext } from "@/context/SettingsContext";
import { getToday } from "@/components/amdin-header/utils";

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
        useContext(SettingsContext);

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
        />
    );
};

export default TodoList;
