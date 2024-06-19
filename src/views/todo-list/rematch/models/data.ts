import { addTodoItem, getTodoCategory, getTodoList } from "@/client/TodoListHelper";
import { createModel } from "@rematch/core";
import { message } from "antd";
import {
    CategoryType,
    CreateTodoItemReq,
    StatusType,
    TodoItemType,
    TodoStatus,
} from "../../types";
import type { RootModel } from "./index";
import dayjs from 'dayjs';

interface DataType {
    todoLoading: boolean;
    doneLoading: boolean;
    poolLoading: boolean;
    targetLoading: boolean;
    followUpLoading: boolean;
    habitLoading: boolean;
    bookMarkLoading: boolean;
    isRefreshNote: boolean;
    todoListOrigin: TodoItemType[];
    poolListOrigin: TodoItemType[];
    targetListOrigin: TodoItemType[];
    followUpListOrigin: TodoItemType[];
    habitListOrigin: TodoItemType[];
    bookMarkListOrigin: TodoItemType[];
    todoList: TodoItemType[];
    doneList: TodoItemType[];
    doneTotal: number;
    poolList: TodoItemType[];
    targetList: TodoItemType[];
    followUpList: TodoItemType[];
    habitList: TodoItemType[];
    bookMarkList: TodoItemType[];
    category: CategoryType[];
}

export const data = createModel<RootModel>()({
    state: {
        todoLoading: false,
        doneLoading: false,
        poolLoading: false,
        targetLoading: false,
        followUpLoading: false,
        habitLoading: false,
        bookMarkLoading: false,
        isRefreshNote: false,
        todoListOrigin: [],
        poolListOrigin: [],
        targetListOrigin: [],
        followUpListOrigin: [],
        habitListOrigin: [],
        bookMarkListOrigin: [],
        todoList: [],
        doneList: [],
        doneTotal: 0,
        poolList: [],
        targetList: [],
        followUpList: [],
        habitList: [],
        bookMarkList: [],
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
        setFollowUpLoading: (state, payload) => {
            return {
                ...state,
                followUpLoading: payload,
            };
        },
        setHabitLoading: (state, payload) => {
            return {
                ...state,
                habitLoading: payload,
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
        setFollowUpListOrigin: (state, payload) => {
            return {
                ...state,
                followUpListOrigin: payload,
            };
        },
        setHabitListOrigin: (state, payload) => {
            return {
                ...state,
                habitListOrigin: payload,
            };
        },
        setBookMarkListOrigin: (state, payload) => {
            return {
                ...state,
                bookMarkListOrigin: payload,
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
        setFollowUpList: (state, payload) => {
            return {
                ...state,
                followUpList: payload,
            };
        },
        setHabitList: (state, payload) => {
            return {
                ...state,
                habitList: payload,
            };
        },
        setBookMarkList: (state, payload) => {
            return {
                ...state,
                bookMarkList: payload,
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
                setBookMarkListOrigin,
                setTargetLoading,
                setTargetListOrigin,
                setFollowUpLoading,
                setFollowUpListOrigin,
                setHabitLoading,
                setHabitListOrigin,
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
                isTarget,
                isNote,
                isHabit,
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
                        setBookMarkListOrigin(res.data.list);
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
                        pageSize: 60,
                        status: TodoStatus["todo"],
                        isWork,
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
                case "followUp": {
                    setFollowUpLoading(true);
                    const req: any = {
                        isFollowUp: "1",
                        pageNo: 1,
                        pageSize: 60,
                        // status: TodoStatus["todo"],
                        isWork,
                    };
                    const res = await getTodoList(req);
                    if (res) {
                        setFollowUpListOrigin(res.data.list);
                        setFollowUpLoading(false);
                    } else {
                        message.error("获取 todolist 失败");
                    }
                    break;
                }
                case "habit": {
                    setHabitLoading(true);
                    const req: any = {
                        pageNo: 1,
                        pageSize: 30,
                        status: TodoStatus["todo"],
                        isWork,
                        isHabit: "1",
                    };
                    const res = await getTodoList(req);
                    if (res) {
                        setHabitListOrigin(res.data.list);
                        setHabitLoading(false);
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
                        keyword,
                        pageNo,
                        pageSize,
                        startTime: startEndTime?.[0]?.format("YYYY-MM-DD"),
                        endTime: startEndTime?.[1]?.format("YYYY-MM-DD"),
                    };

                    if (isWork) {
                        req["isWork"] = isWork;
                    }
                    if (isTarget === '1') {
                        req["isTarget"] = isTarget;
                    }
                    if (isNote === '1') {
                        req["isNote"] = isNote;
                    }
                    if (isHabit === '1') {
                        req["isHabit"] = isHabit;
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
                case "todo": {
                    setTodoLoading(true);

                    const req: any = {
                        status: TodoStatus[type],
                        pageSize: 200,
                        isBookMark: "0",
                        isTarget: "0",
                        isFollowUp: "0",
                        sortBy: [["color"], ["isWork", "DESC"], ["category"]],
                    };

                    const res = await getTodoList(req);
                    if (res) {
                        setTodoListOrigin(res.data.list);
                        setTodoLoading(false);
                    } else {
                        message.error("获取 todolist 失败");
                    }
                    break;
                }
                case "pool": {
                    setPoolLoading(true);

                    const req: any = {
                        status: TodoStatus[type],
                        pageSize: 200,
                        sortBy: [["color"], ["isWork", "DESC"], ["category"]],
                    };

                    const res = await getTodoList(req);
                    if (res) {
                        setPoolListOrigin(res.data.list);
                        setPoolLoading(false);
                    } else {
                        message.error("获取 todolist 失败");
                    }
                    break;
                }
            }
        },
        refreshData(type?: StatusType) {
            this.getCategory();
            if (!type) {
                this.getTodo("todo");
                this.getTodo("done");
                this.getTodo("pool");
                this.getTodo("target");
                this.getTodo("bookMark");
                this.getTodo("habit");
                this.getTodo("followUp");
            } else {
                type === "todo" && this.getTodo("todo");
                type === "done" && this.getTodo("done");
                type === "pool" && this.getTodo("pool");
                type === "target" && this.getTodo("target");
                type === "bookMark" && this.getTodo("bookMark");
                type === "note" && this.getTodo("note");
                type === "habit" && this.getTodo("habit");
                type === "followUp" && this.getTodo("followUp");
            }
        },
        getFilterList(params: {list: TodoItemType[], type: StatusType }, state) {
            const { list, type } = params;
            const { activeColor, activeCategory, keyword, isWork } =
                state.filter;
            let l = list;
            if (activeColor && activeColor?.length !== 0) {
                l = l.filter((item) => activeColor.includes(item.color));
            }
            if (activeCategory && activeCategory?.length !== 0) {
                l = l.filter((item) => activeCategory.includes(item.category));
            }
            if (isWork && isWork !== "") {
                l = l.filter((item) => item.isWork === isWork);
            }
            if (keyword && keyword !== "") {
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
            if (type !== "habit") {
                l = l.filter((item) => item.isHabit !== '1');
            }
            return l;
        },
        handleSearch(payload, state): void {
            const {
                todoListOrigin,
                poolListOrigin,
                targetListOrigin,
                followUpListOrigin,
                bookMarkListOrigin,
            } = state.data;
            const { setTodoList, setPoolList, setTargetList, setFollowUpList, setBookMarkList } =
                dispatch.data;
            // 其他模块直接过滤不用发请求
            setTodoList(this.getFilterList({ list: todoListOrigin, type: 'todo' }));
            setPoolList(this.getFilterList({ list: poolListOrigin, type: 'pool' }));
            setTargetList(this.getFilterList({ list: targetListOrigin, type: 'target' }));
            setFollowUpList(this.getFilterList({ list: followUpListOrigin, type: 'followUp' }));
            setBookMarkList(this.getFilterList({ list: bookMarkListOrigin, type: 'bookmark' }));
            // 已完成模块除外
            this.getTodo("done");
        },
        async getCategory(payload, state) {
            const { isWork } = state.filter;
            const res = await getTodoCategory({ isWork });
            this.setCategory(res.data);
        },
        // 打卡
        async punchTheClock(active: TodoItemType | undefined) {
            if (active) {
                const val: CreateTodoItemReq = {
                    category: active.category,
                    color:
                        active.color !== "4" ? `${Number(active.color) + 1}` : "4",
                    description: active.description,
                    name: `打卡：${active.name}`,
                    isBookMark: "0",
                    isNote: "0",
                    isTarget: "0",
                    other_id: active.todo_id,
                    status: "1",
                    doing: "0",
                    isWork: "0",
                    time: dayjs().format("YYYY-MM-DD"),
                    isHabit: "0",
                    isKeyNode: "0",
                    isFollowUp: "0",
                };
                await addTodoItem(val);
                message.success("打卡成功");
                this.refreshData("done");
                this.refreshData("habit");
            }
        }
    }),
});
