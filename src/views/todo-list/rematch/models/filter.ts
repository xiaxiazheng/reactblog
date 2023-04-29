import { createModel } from "@rematch/core";
import type { RootModel } from "./index";

interface FilterType {
    keyword: string; // 这个是 todo 的全局 keyword
    localKeyword: string; // 这个是 modal 和 drawer 用的局部 keyword
    activeColor: string;
    activeCategory: string;
    startEndTime: any;
    isWork: string; // 是否是工作
    pageNo: number;
    pageSize: number;
}

export const filter = createModel<RootModel>()({
    state: {
        keyword: "",
        localKeyword: "",
        activeColor: "",
        activeCategory: "",
        startEndTime: "",
        isWork: "",
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
            return {
                ...state,
                isWork: payload,
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
            } = dispatch.filter;
            setActiveCategory("");
            setActiveColor("");
            setKeyword("");
            // setIsWork("");
            setStartEndTime(undefined);
            setPageNo(1);
        },
    }),
});
