import {
    addTodoItem,
    getTodoCategory,
    getTodoList,
} from "@/client/TodoListHelper";
import { createModel } from "@rematch/core";
import { message } from "antd";
import {
    CategoryType,
    StatusType,
    TodoStatus,
} from "../../types";
import {
    CreateTodoItemReq,
    TodoItemType,
} from "@xiaxiazheng/blog-libs";
import type { RootModel } from "./index";
import dayjs from "dayjs";

interface DataType {
    todoLoading: boolean;
    doneLoading: boolean;
    targetLoading: boolean;
    followUpLoading: boolean;
    habitLoading: boolean;
    bookMarkLoading: boolean;
    isRefreshNote: boolean;
    todoListOrigin: TodoItemType[];
    targetListOrigin: TodoItemType[];
    followUpListOrigin: TodoItemType[];
    habitListOrigin: TodoItemType[];
    bookMarkListOrigin: TodoItemType[];
    todoList: TodoItemType[];
    doneList: TodoItemType[];
    doneTotal: number;
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
        targetLoading: false,
        followUpLoading: false,
        habitLoading: false,
        bookMarkLoading: false,
        isRefreshNote: false,
        todoListOrigin: [],
        targetListOrigin: [],
        followUpListOrigin: [],
        habitListOrigin: [],
        bookMarkListOrigin: [],
        todoList: [],
        doneList: [],
        doneTotal: 0,
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
        async getTodo(payload: { type: StatusType }, state) {
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
                isKeyNode,
            } = state.filter;

            const { type } = payload;

            switch (type) {
                case "bookMark": {
                    setBookMarkLoading(true);
                    const req: any = {
                        isBookMark: "1",
                        pageNo: 1,
                        pageSize: 300,
                        isWork,
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
                        pageSize: 300,
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
                        pageSize: 200,
                        // status: TodoStatus["todo"],
                        isWork,
                        isHabit: "1",
                        sortBy: [["color"], ["name"]],
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
                    if (isTarget === "1") {
                        req["isTarget"] = isTarget;
                    }
                    if (isNote === "1") {
                        req["isNote"] = isNote;
                    }
                    if (isHabit === "1") {
                        req["isHabit"] = isHabit;
                    }
                    if (isKeyNode === "1") {
                        req["isKeyNode"] = isKeyNode;
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

                    // 只看前 x 条 todo，这数据来自 settings，又存到了 storage 里面
                    const limit = localStorage.getItem('isShowLastLimit');

                    const req: any = {
                        status: TodoStatus[type],
                        pageSize: limit || 500,
                        isBookMark: "0",
                        isTarget: "0",
                        isFollowUp: "0",
                        sortBy: [["time", "DESC"], ["color"], ["isWork", "DESC"], ["category"], ["name"]],
                        isWork,
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
            }
        },
        refreshData(type?: StatusType) {
            this.getCategory();
            if (!type) {
                this.getTodo({ type: "todo" });
                this.getTodo({ type: "done" });
                this.getTodo({ type: "target" });
                this.getTodo({ type: "bookMark" });
                this.getTodo({ type: "habit" });
                this.getTodo({ type: "followUp" });
            } else {
                type === "todo" && this.getTodo({ type: "todo" });
                type === "done" && this.getTodo({ type: "done" });
                type === "target" && this.getTodo({ type: "target" });
                type === "bookMark" && this.getTodo({ type: "bookMark" });
                type === "note" && this.getTodo({ type: "note" });
                type === "habit" && this.getTodo({ type: "habit" });
                type === "followUp" && this.getTodo({ type: "followUp" });
            }
        },
        getFilterList(
            payload: { list: TodoItemType[]; type: StatusType },
            state
        ) {
            const { list, type } = payload;
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
                l = l.filter((item) => item.isHabit !== "1");
            }
            return l;
        },
        handleSearch(payload, state): void {
            const {
                todoListOrigin,
                targetListOrigin,
                habitListOrigin,
                followUpListOrigin,
                bookMarkListOrigin,
            } = state.data;
            const {
                setTodoList,
                setHabitList,
                setTargetList,
                setFollowUpList,
                setBookMarkList,
            } = dispatch.data;
            // 其他模块直接过滤不用发请求
            setTodoList(
                this.getFilterList({ list: todoListOrigin, type: "todo" })
            );
            setTargetList(
                this.getFilterList({ list: targetListOrigin, type: "target" })
            );
            setHabitList(
                this.getFilterList({ list: habitListOrigin, type: "habit" })
            );
            setFollowUpList(
                this.getFilterList({
                    list: followUpListOrigin,
                    type: "followUp",
                })
            );
            setBookMarkList(
                this.getFilterList({
                    list: bookMarkListOrigin,
                    type: "bookmark",
                })
            );
            // 已完成模块除外
            this.getTodo({ type: "done" });
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
                    color: `${
                        active.color === "4" ? "4" : Number(active.color) + 1
                    }`,
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
        },
    }),
});
