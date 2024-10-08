import React, { useContext, useEffect, useState } from "react";
import { Button, Tooltip } from "antd";
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

const TodoToday = () => {
    const { todoNameMap, todoDescriptionMap } = useContext(SettingsContext);

    const Today = () => getToday().format("YYYY-MM-DD");

    const todoLoading = useSelector(
        (state: RootState) => state.data.todoLoading
    );
    const todoList = useSelector((state: RootState) => state.data.todoList);
    const todoListOrigin = useSelector(
        (state: RootState) => state.data.todoListOrigin
    );
    const dispatch = useDispatch<Dispatch>();
    const { setTodoList, getFilterList } = dispatch.data;

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

    // console.log('todoList', todoList)
    // console.log('followUpList', followUpList)

    // console.log('formatArrayToTimeMap', formatArrayToTimeMap(
    //     todoList
    //         .filter((item) => item.time <= Today())
    //         .concat(isShowFollowUp ? followUpList : [])
    // ))

    return (
        <List
            loading={todoLoading || followUpLoading}
            sortKey={SortKeyMap.todo}
            showDoingBtn={true}
            title={
                <>
                    {todoNameMap["today"]}{" "}
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
            showDoneIcon={true}
            isReverseTime={true}
            btnChildren={
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
        />
    );
};

export default TodoToday;
