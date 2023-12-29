import React, { useContext, useEffect } from "react";
import { Tooltip } from "antd";
import { formatArrayToTimeMap } from "../../utils";
import List from "../../todo-split-day-list";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { SortKeyMap } from "../../component/sort-btn";
import { Dispatch, RootState } from "../../rematch";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import TodoTypeIcon from "../../component/todo-type-icon";
import { SettingsContext } from "@/context/SettingsContext";

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

    const today = dayjs().format("YYYY-MM-DD");

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

    return (
        <List
            loading={todoLoading}
            sortKey={SortKeyMap.todo}
            showDoingBtn={true}
            title={
                <>
                    {todoNameMap['today']}{" "}
                    <RenderTodoDescriptionIcon
                        title={todoDescriptionMap?.["today"]}
                    />{" "}
                </>
            }
            mapList={formatArrayToTimeMap(
                todoList.filter((item) => item.time <= today)
            )}
            showDoneIcon={true}
        />
    );
};

export default TodoToday;
