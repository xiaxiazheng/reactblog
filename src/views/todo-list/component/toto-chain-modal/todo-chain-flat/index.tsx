import React, { ReactNode, useContext, useState } from "react";
import { Button, Checkbox, Divider, Space } from "antd";
import { TodoItemType } from "../../../types";
import TodoItem from "../../todo-item";
import styles from "./index.module.scss";
import dayjs, { ManipulateType } from "dayjs";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

interface IProps {
    localKeyword: string;
    todoChainList: TodoItemType[];
    nowTodo: TodoItemType | undefined;
    chainId: string;
}

interface CollapseProps {
    title: ReactNode | string;
    children: any;
}

const Collapse: React.FC<CollapseProps> = (props) => {
    const [isShow, setIsShow] = useState<boolean>(true);

    return (
        <>
            <h4
                onClick={() => setIsShow((prev) => !prev)}
                style={{ cursor: "pointer" }}
            >
                {isShow ? <CaretDownOutlined /> : <CaretUpOutlined />}&nbsp;
                {props.title}
            </h4>
            {isShow && <div className={styles.children}>{props.children}</div>}
        </>
    );
};

const TodoChainFlat: React.FC<IProps> = (props) => {
    const { localKeyword, todoChainList, nowTodo, chainId } = props;

    const handleFilter = (list: TodoItemType[]): TodoItemType[] => {
        return list
            .filter(
                (item) =>
                    !localKeyword ||
                    item.name
                        .toLowerCase()
                        .indexOf(localKeyword.toLowerCase()) !== -1 ||
                    item.description
                        .toLowerCase()
                        .indexOf(localKeyword.toLowerCase()) !== -1
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
                    (isSortTime ? item.time : item.mTime) || "2018-01-01"
                );
                return time.isBefore(range[0]) && time.isAfter(range[1]);
            });
            prev[cur] = l;
            return prev;
        }, {} as Record<string, TodoItemType[]>);
    };

    const renderChildTodo = (
        list: TodoItemType[],
        params: { isReverse: boolean; isReverseList?: boolean }
    ) => {
        const { isReverse, isReverseList = false } = params;
        const map = handleSplitListByTimeRange(
            list.sort(
                (a, b) =>
                    new Date(a.time).getTime() - new Date(b.time).getTime()
            )
        );

        return (isReverse ? Object.keys(map).reverse() : Object.keys(map)).map(
            (time) => {
                if (map[time].length === 0) return null;
                return (
                    <div key={time}>
                        <Collapse
                            title={
                                <span
                                    style={{
                                        color: "#1890ffcc",
                                    }}
                                >
                                    {time}
                                </span>
                            }
                        >
                            <div>
                                {(isReverseList
                                    ? map[time].reverse()
                                    : map[time]
                                ).map((item) => (
                                    <div key={item.todo_id}>
                                        <TodoItem
                                            key={item.todo_id}
                                            item={item}
                                            showDoneIcon={false}
                                            isChain={true}
                                            isChainNext={true}
                                            isModalOrDrawer={true}
                                            isShowTime={true}
                                            isShowTimeRange={true}
                                            style={
                                                item.todo_id ===
                                                nowTodo?.todo_id
                                                    ? { color: "yellow" }
                                                    : {}
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </Collapse>
                    </div>
                );
            }
        );
    };

    const beforeList = handleFilter(
        handleFlat(todoChainList.filter((item) => item.todo_id !== chainId))
    ).filter((item) => item.todo_id !== chainId);
    const afterList = handleFilter(handleFlat(nowTodo?.child_todo_list || []));

    const [isSplitTime, setIsSplitTime] = useState<boolean>(false);

    return (
        <>
            <Space>
                <Button
                    type="primary"
                    onClick={() => setIsSortTime((prev) => !prev)}
                >
                    {isSortTime ? "time" : "mTime"}
                </Button>
                <Button
                    type="primary"
                    onClick={() => setIsSplitTime((prev) => !prev)}
                >
                    {isSplitTime ? "区分" : "不区分"}前中后
                </Button>
            </Space>
            <div className={styles.content}>
                {isSplitTime && (
                    <>
                        {/* 前置 */}
                        {beforeList?.length !== 0 && (
                            <>
                                <Collapse
                                    title={
                                        <span
                                            style={{
                                                color: "#40a9ff",
                                                fontSize: "16px",
                                            }}
                                        >
                                            前置：
                                        </span>
                                    }
                                >
                                    {renderChildTodo(beforeList, {
                                        isReverse: true,
                                    })}
                                </Collapse>
                                <Divider style={{ margin: "12px 0" }} />
                            </>
                        )}
                        {/* 当前 */}
                        {nowTodo && handleFilter([nowTodo])?.length !== 0 && (
                            <Collapse
                                title={
                                    <span
                                        style={{
                                            color: "#40a9ff",
                                            fontSize: "16px",
                                        }}
                                    >
                                        当前：
                                    </span>
                                }
                            >
                                <TodoItem
                                    item={nowTodo}
                                    showDoneIcon={false}
                                    isChain={true}
                                    isModalOrDrawer={true}
                                    style={{ color: "yellow" }}
                                    isShowTime={true}
                                    isShowTimeRange={true}
                                />
                            </Collapse>
                        )}
                        {/* 后续 */}
                        {nowTodo && afterList?.length !== 0 && (
                            <>
                                <Divider style={{ margin: "12px 0" }} />
                                <Collapse
                                    title={
                                        <span
                                            style={{
                                                color: "#52d19c",
                                                fontSize: "16px",
                                            }}
                                        >
                                            后续：
                                        </span>
                                    }
                                >
                                    {renderChildTodo(afterList, {
                                        isReverse: false,
                                        isReverseList: true,
                                    })}
                                </Collapse>
                            </>
                        )}
                    </>
                )}
                {!isSplitTime && (
                    <>
                        {nowTodo &&
                            renderChildTodo(
                                [
                                    ...(beforeList || []),
                                    nowTodo,
                                    ...(afterList || []),
                                ],
                                {
                                    isReverse: false,
                                    isReverseList: true,
                                }
                            )}
                    </>
                )}
            </div>
        </>
    );
};

export default TodoChainFlat;
