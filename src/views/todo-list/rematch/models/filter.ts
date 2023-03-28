import { createModel } from "@rematch/core";
import type { RootModel } from "./index";

interface FilterType {
    keyword: string;
    activeColor: string;
    activeCategory: string;
    startEndTime: any;
    pageNo: number;
    pageSize: number;
}

export const filter = createModel<RootModel>()({
    state: {
        keyword: "",
        activeColor: "",
        activeCategory: "",
        startEndTime: "",
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
                setPageNo,
            } = dispatch.filter;
            setActiveCategory("");
            setActiveColor("");
            setKeyword("");
            setStartEndTime(undefined);
            setPageNo(1);
        },
    }),
});
