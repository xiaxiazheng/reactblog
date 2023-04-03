import { getTodoByIdList, getTodoList } from "@/client/TodoListHelper";
import { Button, Space } from "antd";
import React, { useEffect, useState } from "react";
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

    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<NewTodoItemType[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [isShowAll, setIsShowAll] = useState<boolean>(false);

    const [type, setType] = useState<"local" | "remote">("local");

    useEffect(() => {
        visible && type === "local" && getData();
        visible && type === "remote" && getFootPrintEdit();
    }, [visible, isShowAll, type]);

    const getData = async () => {
        setLoading(true);
        const list = getFootPrintList();
        setTotal(list.length);
        if (list.length !== 0) {
            const todoIdList = list
                .slice(0, isShowAll ? maxLength : showLength)
                .map((item) => item.todo_id);

            const res = await getTodoByIdList({
                todoIdList,
            });
            if (res) {
                // 把 edit_time 放进 todoItem 里，用于下面展示
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

    // 如果是今天的，就不展示日期，只展示时间
    const handleTime = (time: string) => {
        return dayjs(time).isSame(dayjs(), "d") ? time.split(" ")?.[1] : time;
    };

    const getFootPrintEdit = async () => {
        const params = {
            pageNo: 1,
            pageSize: 30,
            sortBy: [["mTime", "DESC"]],
        };
        const res = await getTodoList(params);
        setList(
            res.data.list.map((item: TodoItemType) => {
                return {
                    ...item,
                    edit_time: item.mTime,
                };
            })
        );
        setTotal(res.data.total);
    };

    return (
        <div className={styles.footprint}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span>足迹 ({total})</span>
                <Space>
                    <Button
                        onClick={() =>
                            setType((prev) =>
                                prev === "local" ? "remote" : "local"
                            )
                        }
                    >
                        {type === "local" ? "本地" : "远端"}
                    </Button>
                    {type === "local" && total > showLength && (
                        <Button
                            className={styles.showAll}
                            onClick={() => setIsShowAll((prev) => !prev)}
                            type={isShowAll ? "primary" : "default"}
                        >
                            show All (max: {isShowAll ? maxLength : showLength})
                        </Button>
                    )}
                </Space>
            </div>
            <Space
                className={`${styles.content} ScrollBar`}
                direction="vertical"
                size={10}
            >
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
