import moment from "moment";
import React, { createContext, useEffect, useState } from "react";
import { OperatorType, StatusType, TodoItemType, TodoStatus } from "./types";
import { Form, FormInstance, message } from "antd";
import { getTodoList } from "@/client/TodoListHelper";

interface ContextType {
    todoLoading: boolean;
    poolLoading: boolean;
    targetLoading: boolean;
    bookMarkLoading: boolean;
    isRefreshDone: boolean;
    isRefreshNote: boolean;
    todoListOrigin: TodoItemType[];
    poolListOrigin: TodoItemType[];
    targetListOrigin: TodoItemType[];
    bookMarkListOrigin: TodoItemType[];
    todoList: TodoItemType[];
    poolList: TodoItemType[];
    targetList: TodoItemType[];
    bookMarkList: TodoItemType[];
    setTodoList: React.Dispatch<React.SetStateAction<TodoItemType[]>>;
    setPoolList: React.Dispatch<React.SetStateAction<TodoItemType[]>>;
    setTargetList: React.Dispatch<React.SetStateAction<TodoItemType[]>>;
    setBookMarkList: React.Dispatch<React.SetStateAction<TodoItemType[]>>;
    setIsRefreshDone: React.Dispatch<React.SetStateAction<boolean>>;
    setIsRefreshNote: React.Dispatch<React.SetStateAction<boolean>>;
    refreshData: (type?: StatusType) => void;
    getTodo: (type: StatusType) => Promise<void>;
}

export const TodoDataContext = createContext({} as ContextType);

/** 保存 todo 信息 */
export const TodoDataProvider: React.FC = (props) => {
    const [todoLoading, setTodoLoading] = useState<boolean>(false);
    const [poolLoading, setPoolLoading] = useState<boolean>(false);
    const [targetLoading, setTargetLoading] = useState<boolean>(false);
    const [bookMarkLoading, setBookMarkLoading] = useState<boolean>(false);

    const [isRefreshDone, setIsRefreshDone] = useState<boolean>(false);
    const [isRefreshNote, setIsRefreshNote] = useState<boolean>(false);

    const getTodo = async (type: StatusType) => {
        switch (type) {
            case "bookMark": {
                setBookMarkLoading(true);
                const req: any = {
                    isBookMark: "1",
                    pageNo: 1,
                    pageSize: 100,
                };
                const res = await getTodoList(req);
                if (res) {
                    setBookMarkListOrigin(res.data.list);
                    setBookMarkList(res.data.list);
                    setBookMarkLoading(false);
                } else {
                    message.error("获取 todolist 失败");
                }
                break;
            }
            case "target": {
                setTargetLoading(true);
                const req: any = {
                    isTarget: "1",
                    pageNo: 1,
                    pageSize: 100,
                };
                const res = await getTodoList(req);
                if (res) {
                    setTargetListOrigin(res.data.list);
                    setTargetList(res.data.list);
                    setTargetLoading(false);
                } else {
                    message.error("获取 todolist 失败");
                }
                break;
            }
            case "note": {
                setIsRefreshNote(true);
                break;
            }
            case "done": {
                setIsRefreshDone(true);
                break;
            }
            case "todo":
            case "pool": {
                type === "todo" && setTodoLoading(true);
                type === "pool" && setPoolLoading(true);

                const req: any = {
                    status: TodoStatus[type],
                };

                const res = await getTodoList(req);
                if (res) {
                    if (type === "todo") {
                        setTodoListOrigin(res.data);
                        setTodoList(res.data);
                        setTodoLoading(false);
                    }
                    if (type === "pool") {
                        setPoolListOrigin(res.data);
                        setPoolList(res.data);
                        setPoolLoading(false);
                    }
                } else {
                    message.error("获取 todolist 失败");
                }
                break;
            }
        }
    };

    useEffect(() => {
        getTodo("todo");
        getTodo("pool");
        getTodo("target");
    }, []);

    const [todoListOrigin, setTodoListOrigin] = useState<TodoItemType[]>([]);
    const [poolListOrigin, setPoolListOrigin] = useState<TodoItemType[]>([]);
    const [targetListOrigin, setTargetListOrigin] = useState<TodoItemType[]>(
        []
    );
    const [bookMarkListOrigin, setBookMarkListOrigin] = useState<
        TodoItemType[]
    >([]);

    // 列表
    const [todoList, setTodoList] = useState<TodoItemType[]>([]);
    const [poolList, setPoolList] = useState<TodoItemType[]>([]);
    const [targetList, setTargetList] = useState<TodoItemType[]>([]);
    const [bookMarkList, setBookMarkList] = useState<TodoItemType[]>([]);

    const refreshData = (type?: StatusType) => {
        if (!type) {
            getTodo("todo");
            getTodo("done");
            getTodo("pool");
            getTodo("target");
            getTodo("bookMark");
            getTodo("note");
        } else {
            type === "todo" && getTodo("todo");
            type === "done" && getTodo("done");
            type === "pool" && getTodo("pool");
            type === "target" && getTodo("target");
            type === "bookMark" && getTodo("bookMark");
            type === "note" && getTodo("note");
        }
    };

    return (
        <TodoDataContext.Provider
            value={{
                todoLoading,
                poolLoading,
                targetLoading,
                bookMarkLoading,
                isRefreshDone,
                isRefreshNote,
                todoListOrigin,
                poolListOrigin,
                targetListOrigin,
                bookMarkListOrigin,
                todoList,
                poolList,
                targetList,
                bookMarkList,
                setTodoList,
                setPoolList,
                setTargetList,
                setBookMarkList,
                setIsRefreshDone,
                setIsRefreshNote,
                refreshData,
                getTodo,
            }}
        >
            {props.children}
        </TodoDataContext.Provider>
    );
};

export const TodoDataConsumer = TodoDataContext.Consumer;
