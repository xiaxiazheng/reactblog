import React, { useContext, useEffect, useMemo, useState } from "react";
import { TodoItemType } from "../../../types";
import TodoItem from "../../todo-item";
import styles from "../index.module.scss";
import {
    formatArrayToTimeMap,
    getRangeFormToday,
    getWeek,
} from "../../../utils";
import dayjs from "dayjs";
import { getToday } from "@/components/amdin-header/utils";

interface IProps {
    todoChainList: TodoItemType[];
    chainId: string;
    localKeyword: string;
}

const TodoTimeLine: React.FC<IProps> = (props) => {
    const { todoChainList, chainId, localKeyword } = props;

    const Today = () => getToday().format("YYYY-MM-DD");

    const dfs = (l: TodoItemType[]): TodoItemType[] => {
        return l.reduce((prev, cur) => {
            return prev
                .concat(cur)
                .concat(cur.child_todo_list ? dfs(cur.child_todo_list) : []);
        }, [] as TodoItemType[]);
    };

    const handleTimeMap = (list: TodoItemType[]) => {
        let l = dfs(list);
        if (!localKeyword) return formatArrayToTimeMap(l);
        l = l.filter(
            (item: TodoItemType) =>
                !localKeyword ||
                item.name.toLowerCase().indexOf(localKeyword.toLowerCase()) !==
                    -1 ||
                item.description
                    .toLowerCase()
                    .indexOf(localKeyword.toLowerCase()) !== -1
        );
        return formatArrayToTimeMap(l);
    };
    const timeMap = handleTimeMap(todoChainList);

    return (
        <div className={`${styles.OneDayListWrap} ScrollBar`}>
            {Object.keys(timeMap)
                .sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? 1 : -1))
                .map((time) => {
                    return (
                        <div className={styles.oneDay} key={time}>
                            <div
                                className={`${styles.time} ${
                                    time === Today()
                                        ? styles.today
                                        : time > Today()
                                        ? styles.future
                                        : ""
                                }`}
                            >
                                {time}&nbsp; ({getWeek(time)}，
                                {getRangeFormToday(time)})
                                {timeMap[time]?.length > 6
                                    ? ` ${timeMap[time]?.length}`
                                    : null}
                            </div>
                            {timeMap[time].map((item: TodoItemType) => (
                                <TodoItem
                                    key={item.todo_id}
                                    item={item}
                                    isShowPointIcon={item.todo_id === chainId}
                                    keyword={localKeyword}
                                />
                            ))}
                        </div>
                    );
                })}
        </div>
    );
};

export default TodoTimeLine;
