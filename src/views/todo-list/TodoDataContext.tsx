import React, { createContext, useEffect, useState } from "react";
import { StatusType, TodoItemType, TodoStatus } from "./types";
import { message } from "antd";
import { getTodoList } from "@/client/TodoListHelper";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { debounce } from "./utils";

interface ContextType {
    todoLoading: boolean;
    doneLoading: boolean;
    targetLoading: boolean;
    bookMarkLoading: boolean;
    isRefreshNote: boolean;
    todoListOrigin: TodoItemType[];
    targetListOrigin: TodoItemType[];
    todoList: TodoItemType[];
    doneList: TodoItemType[];
    doneTotal: number;
    targetList: TodoItemType[];
    bookMarkList: TodoItemType[];
    setTodoList: React.Dispatch<React.SetStateAction<TodoItemType[]>>;
    setTargetList: React.Dispatch<React.SetStateAction<TodoItemType[]>>;
    setBookMarkList: React.Dispatch<React.SetStateAction<TodoItemType[]>>;
    setIsRefreshNote: React.Dispatch<React.SetStateAction<boolean>>;
    refreshData: (type?: StatusType) => void;
    getTodo: (type: StatusType, params?: any) => Promise<void>;

    activeColor: string[];
    setActiveColor: React.Dispatch<React.SetStateAction<string[]>>;
    activeCategory: string[];
    setActiveCategory: React.Dispatch<React.SetStateAction<string[]>>;
    startEndTime: any;
    setStartEndTime: React.Dispatch<React.SetStateAction<any>>;
    keyword: string;
    setKeyword: React.Dispatch<React.SetStateAction<string>>;
    pageNo: number;
    setPageNo: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    handleSearch: (keyword: string) => void;
    handleClear: Function;
    isFilter: () => boolean;
}

export const TodoDataContext = createContext({} as ContextType);

/**
 * 已废弃不再使用，留个纪念
 */

/** 保存 todo 信息 */
export const TodoDataProvider: React.FC = (props) => {
    const [todoLoading, setTodoLoading] = useState<boolean>(false);
    const [doneLoading, setDoneLoading] = useState<boolean>(false);
    const [targetLoading, setTargetLoading] = useState<boolean>(false);
    const [bookMarkLoading, setBookMarkLoading] = useState<boolean>(false);

    const [isRefreshNote, setIsRefreshNote] = useState<boolean>(false);

    const [todoListOrigin, setTodoListOrigin] = useState<TodoItemType[]>([]);
    const [targetListOrigin, setTargetListOrigin] = useState<TodoItemType[]>(
        []
    );
    // 列表
    const [todoList, setTodoList] = useState<TodoItemType[]>([]);
    const [doneList, setDoneList] = useState<TodoItemType[]>([]);
    const [doneTotal, setDoneTotal] = useState<number>(0);
    const [targetList, setTargetList] = useState<TodoItemType[]>([]);
    const [bookMarkList, setBookMarkList] = useState<TodoItemType[]>([]);

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
                setDoneLoading(true);
                const req: any = {
                    status: TodoStatus["done"],
                    keyword: keyword?.replace(" ", "%"),
                    pageNo,
                    pageSize,
                    startTime: startEndTime?.[0]?.format("YYYY-MM-DD"),
                    endTime: startEndTime?.[1]?.format("YYYY-MM-DD"),
                };

                if (activeCategory) {
                    req["category"] = activeCategory;
                }
                if (activeColor) {
                    req["color"] = activeColor;
                }

                const res = await getTodoList(req);
                if (res) {
                    setDoneList(res.data.list);
                    setDoneTotal(res.data.total);
                    setDoneLoading(false);
                } else {
                    message.error("获取 todolist 失败");
                }
                break;
            }
            case "todo": {
                type === "todo" && setTodoLoading(true);

                const req: any = {
                    status: TodoStatus[type],
                };

                const res = await getTodoList(req);
                if (res) {
                    if (type === "todo") {
                        setTodoListOrigin(res.data);
                        setTodoLoading(false);
                    }
                } else {
                    message.error("获取 todolist 失败");
                }
                break;
            }
        }
    };

    const refreshData = (type?: StatusType) => {
        if (!type) {
            getTodo("todo");
            getTodo("done");
            getTodo("target");
        } else {
            type === "todo" && getTodo("todo");
            type === "done" && getTodo("done");
            type === "target" && getTodo("target");
        }
    };

    // 筛选相关，根据颜色和类别筛选
    // 根据颜色和类别筛选
    const [keyword, setKeyword] = useState<string>("");
    const [activeColor, setActiveColor] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState<string[]>([]);
    const [startEndTime, setStartEndTime] = useState<any>(undefined);
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(
        Number(localStorage.getItem("todoDonePageSize")) || 15
    );

    const getFilterList = (list: TodoItemType[]) => {
        let l = list;
        if (activeColor?.length !== 0) {
            l = l.filter((item) => activeColor.includes(item.color));
        }
        if (activeCategory?.length !== 0) {
            l = l.filter((item) => activeCategory.includes(item.category));
        }
        if (keyword !== "") {
            if (keyword.includes(" ")) {
                const kList = keyword.split(" ");
                l = l.filter((item) => {
                    return kList.some(
                        (key) =>
                            item.name.includes(key) ||
                            item.description.includes(key)
                    );
                });
            } else {
                l = l.filter(
                    (item) =>
                        item.name.includes(keyword) ||
                        item.description.includes(keyword)
                );
            }
        }
        return l;
    };

    const handleSearch = () => {
        setTodoList(getFilterList(todoListOrigin));
        setTargetList(getFilterList(targetListOrigin));
        getTodo("done");
    };

    useEffect(() => {
        setTodoList(getFilterList(todoListOrigin));
        setTargetList(getFilterList(targetListOrigin));
    }, [todoListOrigin, targetListOrigin]);

    const handleClear = () => {
        setActiveCategory([]);
        setActiveColor([]);
        setKeyword("");
        setStartEndTime(undefined);
        setPageNo(1);
    };

    // 是否是正在筛选状态
    const isFilter = () => {
        return (
            activeColor?.length !== 0 ||
            activeCategory?.length !== 0 ||
            keyword !== "" ||
            !!startEndTime ||
            pageNo !== 1
        );
    };

    useEffect(() => {
        handleSearch();
    }, [keyword, activeColor, activeCategory, startEndTime, pageNo, pageSize]);

    return (
        <TodoDataContext.Provider
            value={{
                todoLoading,
                doneLoading,
                targetLoading,
                bookMarkLoading,
                isRefreshNote,
                todoListOrigin,
                targetListOrigin,
                todoList,
                doneList,
                doneTotal,
                targetList,
                bookMarkList,
                setTodoList,
                setTargetList,
                setBookMarkList,
                setIsRefreshNote,
                refreshData,
                getTodo,

                activeColor,
                setActiveColor,
                activeCategory,
                setActiveCategory,
                startEndTime,
                setStartEndTime,
                keyword,
                setKeyword,
                pageNo,
                setPageNo,
                pageSize,
                setPageSize,
                handleSearch,
                handleClear,
                isFilter,
            }}
        >
            {props.children}
        </TodoDataContext.Provider>
    );
};

export const TodoDataConsumer = TodoDataContext.Consumer;
