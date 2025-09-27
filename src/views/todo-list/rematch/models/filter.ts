import { createModel } from "@rematch/core";
import type { RootModel } from "./index";

interface FilterType {
    keyword: string; // 这个是 todo 的全局 keyword
    activeColor: string[];
    activeCategory: string[];
    startEndTime: any;
    isWork: string; // 是否是工作
    isTarget: string;
    isNote: string;
    isCategory: string;
    isEncode: string;
    pageNo: number;
    pageSize: number;
}

export const filter = createModel<RootModel>()({
    state: {
        keyword: "",
        activeColor: [],
        activeCategory: [],
        startEndTime: "",
        isWork: localStorage.getItem("WorkOrLife") || "",
        isTarget: "0",
        isNote: "0",
        isCategory: "0",
        isEncode: "0",
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
            localStorage.setItem("WorkOrLife", payload);
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
        setIsCategory: (state, payload) => {
            return {
                ...state,
                isCategory: payload,
            };
        },
        setIsEncode: (state, payload) => {
            return {
                ...state,
                isEncode: payload,
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
                setIsCategory,
                setIsEncode,
            } = dispatch.filter;
            setActiveCategory([]);
            setActiveColor([]);
            setKeyword("");
            // setIsWork("");
            setIsTarget("0");
            setIsNote("0");
            setIsCategory("0");
            setStartEndTime(undefined);
            setPageNo(1);
            setIsEncode("0");
        },
    }),
});
