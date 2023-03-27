import React, { useEffect } from "react";
import { Tooltip } from "antd";
import { formatArrayToTimeMap } from "../utils";
import List from "../list/todo-list";
import {
    AimOutlined,
    BookOutlined,
    QuestionCircleOutlined,
    StarFilled,
} from "@ant-design/icons";
import { SortKeyMap } from "../component/sort-btn";
import { Dispatch, RootState } from "../rematch";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const TodoToday = () => {
    const today = dayjs().format("YYYY-MM-DD");

    const todoLoading = useSelector(
        (state: RootState) => state.data.todoLoading
    );
    const todoList = useSelector((state: RootState) => state.data.todoList);
    const todoListOrigin = useSelector(
        (state: RootState) => state.data.todoListOrigin
    );
    const dispatch = useDispatch<Dispatch>();
    const { getTodo, setTodoList, getFilterList } = dispatch.data;

    useEffect(() => {
        getTodo("todo");
    }, []);

    useEffect(() => {
        setTodoList(getFilterList(todoListOrigin));
    }, [todoListOrigin]);

    return (
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
                                <div>整个 title 变黄，是指现在处理。</div>
                            </>
                        }
                        placement="bottom"
                    >
                        <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                    </Tooltip>{" "}
                </>
            }
            mapList={formatArrayToTimeMap(
                todoList.filter(
                    (item) => item.time <= today && item.isTarget !== "1"
                )
            )}
            showDoneIcon={true}
        />
    );
};

export default TodoToday;
