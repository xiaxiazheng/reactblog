import { getTodoByIdList } from "@/client/TodoListHelper";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { SortKeyMap } from "../component/sort-btn";
import PoolList from "../pool-list";
import { TodoItemType } from "../types";

interface IProps {
    visible: boolean;
}

const key = "todo_footprint_id_list";

export const getFootPrintList = () => {
    const str = localStorage.getItem(key);
    return str ? JSON.parse(str) : [];
};

export const setFootPrintList = (id: string) => {
    const list = getFootPrintList();
    localStorage.setItem(key, JSON.stringify([id].concat(list.slice(0, 15))));
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
        const todoIdList = getFootPrintList();
        if (todoIdList.length !== 0) {
            const res = await getTodoByIdList({ todoIdList });
            res && setList(res.data);
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
