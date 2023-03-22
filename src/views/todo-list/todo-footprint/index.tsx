import { getTodoByIdList } from "@/client/TodoListHelper";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { SortKeyMap } from "../component/sort-btn";
import PoolList from "../pool-list";
import { TodoItemType } from "../types";
import dayjs from "dayjs";

interface IProps {
    visible: boolean;
}

const key = "todo_footprint_id_list";

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
            edit_time: dayjs().format("YYYY-MM-DD HH-mm-ss"),
        },
    ].concat(list.filter((item) => item.todo_id !== todo_id));
    localStorage.setItem(key, JSON.stringify(l));
};

const TodoFootPrint: React.FC<IProps> = (props) => {
    const { visible } = props;
    useEffect(() => {
        visible && getData();
    }, [visible]);

    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<TodoItemType[]>([]);

    const getData = async () => {
        setLoading(true);
        const list = getFootPrintList();
        if (list.length !== 0) {
            const res = await getTodoByIdList({
                todoIdList: list.map((item) => item.todo_id),
            });
            res &&
                setList(
                    res.data.sort(
                        (a: TodoItemType, b: TodoItemType) =>
                            list.findIndex(
                                (item) => item.todo_id === a.todo_id
                            ) -
                            list.findIndex((item) => item.todo_id === b.todo_id)
                    )
                );
        }
        setLoading(false);
    };

    return (
        <div>
            <PoolList
                loading={loading}
                title="足迹"
                sortKey={SortKeyMap.footprint}
                mapList={list}
                btn={<Button onClick={() => getData()}> refresh</Button>}
            />
        </div>
    );
};

export default TodoFootPrint;
