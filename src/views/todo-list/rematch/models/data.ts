import { getTodoCategory, getTodoList } from "@/client/TodoListHelper";
import { createModel } from "@rematch/core";
import { message } from "antd";
import {
    CategoryType,
    StatusType,
    TodoItemType,
    TodoStatus,
} from "../../types";
import type { RootModel } from "./index";

interface DataType {
    todoLoading: boolean;
    doneLoading: boolean;
    poolLoading: boolean;
    targetLoading: boolean;
    bookMarkLoading: boolean;
    isRefreshNote: boolean;
    todoListOrigin: TodoItemType[];
    poolListOrigin: TodoItemType[];
    targetListOrigin: TodoItemType[];
    todoList: TodoItemType[];
    doneList: TodoItemType[];
    doneTotal: number;
    poolList: TodoItemType[];
    targetList: TodoItemType[];
    bookMarkList: TodoItemType[];
    punchTheClockList: TodoItemType[];
    category: CategoryType[];
}

export const data = createModel<RootModel>()({
    state: {
        todoLoading: false,
        doneLoading: false,
        poolLoading: false,
        targetLoading: false,
        bookMarkLoading: false,
        isRefreshNote: false,
        todoListOrigin: [],
        poolListOrigin: [],
        targetListOrigin: [],
        todoList: [],
        doneList: [],
        doneTotal: 0,
        poolList: [],
        targetList: [],
        bookMarkList: [],
        punchTheClockList: [],
        category: [],
    } as DataType,
    reducers: {
        setTodoLoading: (state, payload) => {
            return {
                ...state,
                todoLoading: payload,
            };
        },
        setDoneLoading: (state, payload) => {
            return {
                ...state,
                doneLoading: payload,
            };
        },
        setPoolLoading: (state, payload) => {
            return {
                ...state,
                poolLoading: payload,
            };
        },
        setTargetLoading: (state, payload) => {
            return {
                ...state,
                targetLoading: payload,
            };
        },
        setBookMarkLoading: (state, payload) => {
            return {
                ...state,
                bookMarkLoading: payload,
            };
        },
        setIsRefreshNote: (state, payload) => {
            return {
                ...state,
                isRefreshNote: payload,
            };
        },
        setTodoListOrigin: (state, payload) => {
            return {
                ...state,
                todoListOrigin: payload,
            };
        },
        setPoolListOrigin: (state, payload) => {
            return {
                ...state,
                poolListOrigin: payload,
            };
        },
        setTargetListOrigin: (state, payload) => {
            return {
                ...state,
                targetListOrigin: payload,
            };
        },
        setTodoList: (state, payload) => {
            return {
                ...state,
                todoList: payload,
            };
        },
        setDoneList: (state, payload) => {
            return {
                ...state,
                doneList: payload,
            };
        },
        setDoneTotal: (state, payload) => {
            return {
                ...state,
                doneTotal: payload,
            };
        },
        setPoolList: (state, payload) => {
            return {
                ...state,
                poolList: payload,
            };
        },
        setTargetList: (state, payload) => {
            return {
                ...state,
                targetList: payload,
            };
        },
        setBookMarkList: (state, payload) => {
            return {
                ...state,
                bookMarkList: payload,
            };
        },
        setPunchTheClockList: (state, payload) => {
            return {
                ...state,
                punchTheClockList: payload,
            };
        },
        setCategory: (state, payload) => {
            return {
                ...state,
                category: payload,
            };
        },
    },
    effects: (dispatch) => ({
        async getTodo(type: StatusType, state) {
            const {
                setBookMarkLoading,
                setBookMarkList,
                setTargetLoading,
                setTargetListOrigin,
                setIsRefreshNote,
                setDoneLoading,
                setDoneList,
                setDoneTotal,
                setTodoListOrigin,
                setTodoLoading,
                setPoolListOrigin,
                setPoolLoading,
            } = dispatch.data;

            const {
                keyword,
                pageNo,
                pageSize,
                isWork,
                startEndTime,
                activeCategory,
                activeColor,
            } = state.filter;

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
                // 暂时跟着目标走，没必要再多发一个请求
                // case "punchTheClock": {
                //     setTargetLoading(true);
                //     const req: any = {
                //         isPunchTheClock: "1",
                //         pageNo: 1,
                //         pageSize: 100,
                //     };
                //     const res = await getTodoList(req);
                //     if (res) {
                //         setTargetListOrigin(res.data.list);
                //         setTargetLoading(false);
                //     } else {
                //         message.error("获取 todolist 失败");
                //     }
                //     break;
                // }
                case "note": {
                    setIsRefreshNote(true);
                    break;
                }
                case "done": {
                    setDoneLoading(true);
                    const req: any = {
                        status: TodoStatus["done"],
                        keyword: keyword?.replaceAll(" ", "%"),
                        pageNo,
                        pageSize,
                        startTime: startEndTime?.[0]?.format("YYYY-MM-DD"),
                        endTime: startEndTime?.[1]?.format("YYYY-MM-DD"),
                    };

                    if (isWork) {
                        req["isWork"] = isWork;
                    }
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
                case "todo":
                case "pool": {
                    type === "todo" && setTodoLoading(true);
                    type === "pool" && setPoolLoading(true);

                    const req: any = {
                        status: TodoStatus[type],
                        pageSize: 200,
                        sortBy: [["color"], ["isWork", "DESC"], ["category"]],
                    };

                    const res = await getTodoList(req);
                    if (res) {
                        if (type === "todo") {
                            setTodoListOrigin(res.data.list);
                            setTodoLoading(false);
                        }
                        if (type === "pool") {
                            setPoolListOrigin(res.data.list);
                            setPoolLoading(false);
                        }
                    } else {
                        message.error("获取 todolist 失败");
                    }
                    break;
                }
            }
        },
        refreshData(type?: StatusType) {
            this.getCategory();
            // const showBookMarkDrawer = state.edit.showBookMarkDrawer;
            if (!type) {
                this.getTodo("todo");
                this.getTodo("done");
                this.getTodo("pool");
                this.getTodo("target");
                // showBookMarkDrawer && this.getTodo("bookMark");
            } else {
                type === "todo" && this.getTodo("todo");
                type === "done" && this.getTodo("done");
                type === "pool" && this.getTodo("pool");
                type === "target" && this.getTodo("target");
                type === "bookMark" &&
                    // showBookMarkDrawer &&
                    this.getTodo("bookMark");
            }
        },
        getFilterList(list: TodoItemType[], state) {
            const { activeColor, activeCategory, keyword, isWork } =
                state.filter;
            let l = list;
            if (activeColor !== "") {
                l = l.filter((item) => item.color === activeColor);
            }
            if (activeCategory && activeCategory !== "") {
                l = l.filter((item) => item.category === activeCategory);
            }
            if (isWork && isWork !== "") {
                l = l.filter((item) => item.isWork === isWork);
            }
            if (keyword !== "") {
                if (keyword.includes(" ")) {
                    const kList = keyword.split(" ");
                    // 这里得多个关键字都包含才能返回
                    l = l.filter((item) => {
                        return kList.every(
                            (key) =>
                                item.name
                                    .toLowerCase()
                                    .includes(key.toLowerCase()) ||
                                item.description
                                    .toLowerCase()
                                    .includes(key.toLowerCase())
                        );
                    });
                } else {
                    l = l.filter(
                        (item) =>
                            item.name
                                .toLowerCase()
                                .includes(keyword.toLowerCase()) ||
                            item.description
                                .toLowerCase()
                                .includes(keyword.toLowerCase())
                    );
                }
            }
            return l;
        },
        handleSearch(payload, state): void {
            const { todoListOrigin, poolListOrigin, targetListOrigin } =
                state.data;
            const { setTodoList, setPoolList, setTargetList } = dispatch.data;
            setTodoList(this.getFilterList(todoListOrigin));
            setPoolList(this.getFilterList(poolListOrigin));
            setTargetList(this.getFilterList(targetListOrigin));
            this.getTodo("done");
        },
        async getCategory() {
            const res = await getTodoCategory();
            this.setCategory(res.data);
        },
    }),
});
