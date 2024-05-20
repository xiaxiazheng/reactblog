import { createModel } from "@rematch/core";
import type { RootModel } from "./index";

interface FilterType {
    keyword: string; // 这个是 todo 的全局 keyword
    localKeyword: string; // 这个是 modal 和 drawer 用的局部 keyword
    activeColor: string[];
    activeCategory: string[];
    startEndTime: any;
    isWork: string; // 是否是工作
    isTarget: string;
    isNote: string;
    isHabit: string;
    pageNo: number;
    pageSize: number;
}

export const filter = createModel<RootModel>()({
    state: {
        keyword: "",
        localKeyword: "",
        activeColor: [],
        activeCategory: [],
        startEndTime: "",
        isWork: localStorage.getItem("todoGlobalSearchIsWork") || "",
        isTarget: "0",
        isNote: "0",
        isHabit: "0",
        pageNo: 1,
        pageSize: localStorage.getItem("todoDonePageSize") || 15,
    } as FilterType,
    reducers: {
        setKeyword: (state, payload) => {
            return {
                ...state,
                keyword: payload,
            };
        },
        setLocalKeyword: (state, payload) => {
            return {
                ...state,
                localKeyword: payload,
            };
        },
        setActiveColor: (state, payload) => {
            return {
                ...state,
                activeColor: payload,
            };
        },
        setActiveCategory: (state, payload) => {
            return {
                ...state,
                activeCategory: payload,
            };
        },
        setStartEndTime: (state, payload) => {
            return {
                ...state,
                startEndTime: payload,
            };
        },
        setIsWork: (state, payload) => {
            localStorage.setItem("todoGlobalSearchIsWork", payload);
            return {
                ...state,
                isWork: payload,
            };
        },
        setIsTarget: (state, payload) => {
            return {
                ...state,
                isTarget: payload,
            };
        },
        setIsNote: (state, payload) => {
            return {
                ...state,
                isNote: payload,
            };
        },
        setIsHabit: (state, payload) => {
            return {
                ...state,
                isHabit: payload,
            };
        },
        setPageNo: (state, payload) => {
            return {
                ...state,
                pageNo: payload,
            };
        },
        setPageSize: (state, payload) => {
            return {
                ...state,
                pageSize: payload,
            };
        },
    },
    effects: (dispatch) => ({
        handleClear(payload, state): void {
            const {
                setActiveCategory,
                setActiveColor,
                setKeyword,
                setStartEndTime,
                // setIsWork,
                setPageNo,
                setIsTarget,
                setIsNote,
                setIsHabit,
            } = dispatch.filter;
            setActiveCategory([]);
            setActiveColor([]);
            setKeyword("");
            // setIsWork("");
            setIsTarget("0");
            setIsNote("0");
            setIsHabit("0");
            setStartEndTime(undefined);
            setPageNo(1);
        },
        handleSpecialStatus(params: { type: 'isTarget' | 'isHabit', status: '0' | '1'}, state): void {
            const {
                setIsHabit,
                setIsTarget,
            } = dispatch.filter;
            const { status, type } = params;
            if (type === 'isHabit') {
                setIsHabit(status);
                if (status === '1') {
                    setIsTarget('0')
                }
            }
            if (type === 'isTarget') {
                setIsTarget(status);
                if (status === '1') {
                    setIsHabit('0');
                }
            }
        }
    }),
});
