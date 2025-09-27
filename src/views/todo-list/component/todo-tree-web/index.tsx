import React, { useEffect, useState } from "react";
import { TodoItemType, TodoTree, TodoTreeProps } from "@xiaxiazheng/blog-libs";
import TodoItemWeb, { TodoItemWebProps } from "./todo-item-web";

interface Props extends TodoTreeProps {
    getTodoItemProps: (item: TodoItemType) => Partial<TodoItemWebProps>;
}

/** 基于 todo-tree 的封装，主要是为了替换掉拓展过的 todo-item */
const TodoTreeWeb: React.FC<Props> = (props) => {

    return (
        <TodoTree
            {...props}
            TodoItemCompent={TodoItemWeb}
        />
    );
};

export default TodoTreeWeb;
