import React, { useEffect, useState } from "react";
import { TodoItemType } from "../../types";
import TodoItem from "../todo-item";
import styles from "./index.module.scss";
import Tree from "./tree";

interface Props {
    todoList: TodoItemType[];
    /**
     * flat 的话就是给一个平铺的数组，只展示这些数组的数据，会用这些数据自动组成一棵树
     * tree 的话就是直接展示这个节点以及该节点以下的所有 child 数据，可能不止一层
     */
    dataMode?: "flat" | "tree";
    /** 用于高亮某个 todo 的情况 */
    highlightId?: string;
    onClick?: (
        item: TodoItemType,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => void;
}

const TodoTree: React.FC<Props> = (props) => {
    const { todoList, dataMode = "flat", highlightId, onClick } = props;

    // 把平铺的数据变成树
    function getTreeList(prelist: TodoItemType[]) {
        const list = [...prelist];
        const map = list.reduce((prev: any, cur: any) => {
            prev[cur.todo_id] = cur;
            cur.children = [];
            return prev;
        }, {});
        const l: TodoItemType[] = [];
        list.forEach((item: any) => {
            item.key = item.todo_id;
            item.label = item.name;
            if (item?.other_id && map[item?.other_id]) {
                map[item?.other_id].children.push(item);
            } else {
                l.push(item);
            }
        });
        return l;
    }

    function handleTreeList(prelist: TodoItemType[]): TodoItemType[] {
        return prelist?.reduce((prev: TodoItemType[], item: TodoItemType) => {
            return prev
                .concat(item)
                ?.concat(handleTreeList(item?.child_todo_list || []));
        }, []);
    }

    const [treeList, setTreeList] = useState<TodoItemType[]>([]);
    useEffect(() => {
        dataMode === "flat" && setTreeList(getTreeList(todoList));
        dataMode === "tree" &&
            setTreeList(getTreeList(handleTreeList(todoList)));
    }, [todoList]);

    return (
        <Tree
            treeList={treeList}
            renderTitle={(item) => (
                <TodoItem
                    item={item}
                    onClick={onClick}
                    isShowPointIcon={item.todo_id === highlightId}
                />
            )}
            renderChildren={(item) => (
                <TodoItem
                    item={item}
                    onClick={onClick}
                    isShowPointIcon={item.todo_id === highlightId}
                />
            )}
        />
    );
};

export default TodoTree;
