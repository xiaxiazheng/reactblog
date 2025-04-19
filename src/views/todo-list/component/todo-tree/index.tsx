import React, { useEffect, useState } from "react";
import { TodoItemType } from "../../types";
import TodoItem, { TodoItemProps } from "../todo-item";
import styles from "./index.module.scss";
import Tree from "./tree";
import { handleListToTree, handleTreeToList, TodoTreeItemType } from "./todo-tree-utils";

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
    /** 
     * 外部传入，可对树结构进行筛选，筛选规则外面自定
    */
    handleFilterTree?: (list: TodoTreeItemType[]) => TodoTreeItemType[];
    refreshFlag?: any;
}

const TodoTree: React.FC<Props> = (props) => {
    const { todoList, dataMode = "flat", onClick, getTodoItemProps, handleFilterTree = (list) => list, refreshFlag } = props;

    const [treeList, setTreeList] = useState<TodoItemType[]>([]);
    useEffect(() => {
        let list: TodoItemType[] = [];
        if (dataMode === "flat") {
            list = todoList;
        }
        if (dataMode === "tree") {
            list = handleTreeToList(todoList);
        }
        setTreeList(handleFilterTree(handleListToTree(list)));
    }, [todoList, refreshFlag]);

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
