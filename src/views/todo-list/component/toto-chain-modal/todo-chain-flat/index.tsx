import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Collapse, Divider } from "antd";
import { TodoItemType } from "../../../types";
import TodoItem from "../../todo-item";
import styles from "./index.module.scss";
import dayjs, { ManipulateType } from "dayjs";

interface IProps {
    localKeyword: string;
    todoChainList: TodoItemType[];
    nowTodo: TodoItemType | undefined;
    chainId: string;
}

const TodoChainFlat: React.FC<IProps> = (props) => {
    const { localKeyword, todoChainList, nowTodo, chainId } = props;

    const handleFilter = (list: TodoItemType[]): TodoItemType[] => {
        return list.filter(
            (item) =>
                !localKeyword ||
                item.name.toLowerCase().indexOf(localKeyword.toLowerCase()) !==
                    -1 ||
                item.description
                    .toLowerCase()
                    .indexOf(localKeyword.toLowerCase()) !== -1 ||
                handleFilter(item?.child_todo_list || [])?.length !== 0
        );
    };

    const handleFlat = (list: TodoItemType[]) => {
        return list.reduce((prev, cur) => {
            prev = prev.concat(cur);
            if (cur.child_todo_list_length !== 0 && cur.child_todo_list) {
                prev = prev.concat(handleFlat(cur.child_todo_list));
            }
            return prev;
        }, [] as TodoItemType[]);
    };

    const getTimeRange = (
        start: number,
        end: number,
        type: ManipulateType = "day"
    ) => {
        return [dayjs().subtract(start, type), dayjs().subtract(end, type)];
    };

    const [isSortTime, setIsSortTime] = useState<boolean>(true);

    const handleSplitListByTimeRange = (
        list: TodoItemType[]
    ): Record<string, TodoItemType[]> => {
        const timeRange: Record<string, dayjs.Dayjs[]> = {
            一天内: getTimeRange(0, 1),
            两天内: getTimeRange(1, 2),
            三天内: getTimeRange(2, 3),
            五天内: getTimeRange(3, 5),
            七天内: getTimeRange(5, 7),
            半月内: getTimeRange(7, 15),
            一月内: getTimeRange(15, 30),
            三月内: getTimeRange(1, 3, "month"),
            半年内: getTimeRange(3, 6, "month"),
            一年内: getTimeRange(6, 12, "month"),
            一年前: getTimeRange(1, 10, "year"),
        };
        return Object.keys(timeRange).reduce((prev, cur) => {
            const range = timeRange[cur];
            const l = list.filter((item) => {
                const time = dayjs(
                    (isSortTime ? item.cTime : item.mTime) || "2018-01-01"
                );
                return time.isBefore(range[0]) && time.isAfter(range[1]);
            });
            prev[cur] = l;
            return prev;
        }, {} as Record<string, TodoItemType[]>);
    };

    const renderChildTodo = (
        list: TodoItemType[],
        params: { isReverse: boolean }
    ) => {
        const { isReverse } = params;
        const map = handleSplitListByTimeRange(
            handleFilter(handleFlat(list)).sort(
                (a, b) =>
                    new Date(a.time).getTime() - new Date(b.time).getTime()
            )
        );

        return (isReverse ? Object.keys(map).reverse() : Object.keys(map)).map(
            (time) => {
                if (map[time].length === 0) return null;
                return (
                    <div key={time}>
                        <div
                            style={{
                                color: "#1890ffcc",
                                fontSize: "15px",
                                borderBottom: "1px solid #ccc",
                            }}
                        >
                            {time}
                        </div>
                        <div>
                            {map[time].map((item) => (
                                <div key={item.todo_id}>
                                    <TodoItem
                                        key={item.todo_id}
                                        item={item}
                                        showDoneIcon={false}
                                        isChain={true}
                                        isChainNext={true}
                                        isModalOrDrawer={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
        );
    };

    const [sortTime, setSortTime] = useState<"cTime" | "mTime">("mTime");

    const beforeList = handleFilter(
        todoChainList.filter((item) => item.todo_id !== chainId)
    ).filter((item) => item.todo_id !== chainId);

    return (
        <>
            <Button
                type="primary"
                onClick={() =>
                    setSortTime((prev) =>
                        prev === "cTime" ? "mTime" : "cTime"
                    )
                }
            >
                {sortTime}
            </Button>
            <div className={styles.content}>
                {/* 前置 */}
                {beforeList?.length !== 0 && (
                    <>
                        <h4>
                            <span
                                style={{
                                    color: "#40a9ff",
                                    fontSize: "16px",
                                }}
                            >
                                前置：
                            </span>
                        </h4>
                        {renderChildTodo(beforeList, { isReverse: true })}
                        <Divider style={{ margin: "12px 0" }} />
                    </>
                )}
                {/* 当前 */}
                {nowTodo && handleFilter([nowTodo])?.length !== 0 && (
                    <>
                        <h4>
                            <span
                                style={{
                                    color: "#40a9ff",
                                    fontSize: "16px",
                                }}
                            >
                                当前：
                            </span>
                        </h4>
                        <TodoItem
                            item={nowTodo}
                            showDoneIcon={false}
                            isChain={true}
                            isModalOrDrawer={true}
                        />
                    </>
                )}
                {/* 后续 */}
                {nowTodo &&
                    nowTodo.child_todo_list_length !== 0 &&
                    nowTodo.child_todo_list &&
                    handleFilter(nowTodo.child_todo_list)?.length !== 0 && (
                        <>
                            <Divider style={{ margin: "12px 0" }} />
                            <h4>
                                <span
                                    style={{
                                        color: "#52d19c",
                                        fontSize: "16px",
                                    }}
                                >
                                    后续：
                                </span>
                            </h4>
                            {renderChildTodo(nowTodo.child_todo_list, {
                                isReverse: false,
                            })}
                        </>
                    )}
            </div>
        </>
    );
};

export default TodoChainFlat;
