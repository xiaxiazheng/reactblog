import { getTodoByIdList } from "@/client/TodoListHelper";
import { Button, Space } from "antd";
import React, { useEffect, useState } from "react";
import { SortKeyMap } from "../component/sort-btn";
import PoolList from "../pool-list";
import { TodoItemType } from "../types";
import dayjs from "dayjs";
import TodoItem from "../component/one-day-list/todo-item";
import styles from "./index.module.scss";
import Loading from "@/components/loading";

interface IProps {
    visible: boolean;
}

const key = "todo_footprint_id_list";

interface NewTodoItemType extends TodoItemType {
    edit_time: string;
}

interface FootprintType {
    todo_id: string;
    edit_time: string;
}

export const getFootPrintList = (): FootprintType[] => {
    const str = localStorage.getItem(key);
    return str ? JSON.parse(str) : [];
};

export const setFootPrintList = (todo_id: string) => {
    const list = getFootPrintList();
    const l = [
        {
            todo_id,
            edit_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        },
    ].concat(list.filter((item) => item.todo_id !== todo_id));
    localStorage.setItem(key, JSON.stringify(l));
};

const transferToMap = (list: FootprintType[]) => {
    return list.reduce((prev: any, cur) => {
        prev[cur.todo_id] = cur.edit_time;
        return prev;
    }, {});
};

const TodoFootPrint: React.FC<IProps> = (props) => {
    const { visible } = props;
    useEffect(() => {
        visible && getData();
    }, [visible]);

    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<NewTodoItemType[]>([]);

    const getData = async () => {
        setLoading(true);
        const list = getFootPrintList();
        if (list.length !== 0) {
            const res = await getTodoByIdList({
                todoIdList: list.map((item) => item.todo_id),
            });
            if (res) {
                const map = transferToMap(list);
                const l: NewTodoItemType[] = res.data.map(
                    (item: TodoItemType) => {
                        return {
                            ...item,
                            edit_time: map[item.todo_id],
                        };
                    }
                );

                // 返回的数据，按照足迹的顺序排序
                setList(
                    l.sort(
                        (a: NewTodoItemType, b: NewTodoItemType) =>
                            list.findIndex(
                                (item) => item.todo_id === a.todo_id
                            ) -
                            list.findIndex((item) => item.todo_id === b.todo_id)
                    )
                );
            }
        }
        setLoading(false);
    };

    const handleTime = (time: string) => {
        return dayjs(time).isSame(dayjs(), "d") ? time.split(" ")?.[1] : time;
    };

    return (
        <div>
            {loading && <Loading />}
            <div className={styles.header}>
                <span>足迹 ({list.length})</span>
            </div>
            <Space className={styles.content} direction="vertical" size={10}>
                {list?.map((item) => {
                    return (
                        <div key={item.todo_id} className={styles.item}>
                            <div className={styles.time}>
                                {handleTime(item.edit_time)}
                            </div>
                            <TodoItem item={item} isShowTime={true} />
                        </div>
                    );
                })}
            </Space>
        </div>
    );
};

export default TodoFootPrint;
