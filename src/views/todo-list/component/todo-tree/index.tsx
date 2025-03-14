import React, { useEffect, useState } from "react";
import { TodoItemType } from "../../types";
import TodoItem, { TodoItemProps } from "../todo-item";
import styles from "./index.module.scss";
import Tree from "./tree";

interface Props {
    todoList: TodoItemType[];
    /**
     * flat 的话就是给一个平铺的数组，只展示这些数组的数据，会用这些数据自动组成一棵树
     * tree 的话就是直接展示这个节点以及该节点以下的所有 child 数据，可能不止一层
     */
    dataMode?: "flat" | "tree";
    onClick?: (
        item: TodoItemType,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => void;
    getTodoItemProps?: (item: TodoItemType) => Partial<TodoItemProps>;
}

const TodoTree: React.FC<Props> = (props) => {
    const { todoList, dataMode = "flat", onClick, getTodoItemProps } = props;

    // 把平铺的数据变成树
    function handleListToTree(prelist: TodoItemType[]) {
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

    // 把树平铺，把子节点都抽出来
    function handleTreeToList(prelist: TodoItemType[]): TodoItemType[] {
        return prelist?.reduce((prev: TodoItemType[], item: TodoItemType) => {
            return prev
                .concat(item)
                ?.concat(handleTreeToList(item?.child_todo_list || []));
        }, []);
    }

    const [treeList, setTreeList] = useState<TodoItemType[]>([]);
    useEffect(() => {
        dataMode === "flat" && setTreeList(handleListToTree(todoList));
        dataMode === "tree" &&
            setTreeList(handleListToTree(handleTreeToList(todoList)));
    }, [todoList]);

    return (
        <Tree
            treeList={treeList}
            renderTitle={(item) => (
                <TodoItem
                    item={item}
                    onClick={onClick}
                    {...getTodoItemProps?.(item)}
                />
            )}
            renderChildren={(item) => (
                <TodoItem
                    item={item}
                    onClick={onClick}
                    {...getTodoItemProps?.(item)}
                />
            )}
        />
    );
};

export default TodoTree;
