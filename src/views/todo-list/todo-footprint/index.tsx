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

const showLength = 15;
const maxLength = 50;

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
    ]
        .concat(list.filter((item) => item.todo_id !== todo_id))
        .slice(0, maxLength);
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
            const todoIdList = list
                .slice(0, isShowAll ? maxLength : showLength)
                .map((item) => item.todo_id);

            const res = await getTodoByIdList({
                todoIdList,
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

    const [isShowAll, setIsShowAll] = useState<boolean>(false);
    useEffect(() => {
        getData();
    }, [isShowAll]);

    const total = getFootPrintList()?.length;

    return (
        <div className="ScrollBar">
            {loading && <Loading />}
            <div className={styles.header}>
                <span>足迹 ({total})</span>
                {total > showLength && (
                    <Button
                        className={styles.showAll}
                        onClick={() => setIsShowAll((prev) => !prev)}
                        type={isShowAll ? "primary" : "default"}
                    >
                        show All (max: {isShowAll ? maxLength : showLength})
                    </Button>
                )}
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
