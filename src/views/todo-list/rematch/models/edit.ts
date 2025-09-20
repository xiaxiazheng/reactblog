import { createModel } from "@rematch/core";
import { FormInstance } from "antd";
import { OperatorType } from "../../types";
import type { RootModel } from "./index";
import { TodoItemType } from "@xiaxiazheng/blog-libs";

interface EditType {
    activeTodo: TodoItemType | "";
    showEdit: boolean;
    operatorType: OperatorType;
    form: FormInstance<any> | null;
    chainId: string;
    showChainModal: boolean;
    showPunchTheClockModal: boolean;
    flag: number;
    showBookMarkDrawer: boolean;
    showNoteDrawer: boolean;
    showFootprintDrawer: boolean;
}

export const edit = createModel<RootModel>()({
    state: {
        activeTodo: "",
        showEdit: false,
        operatorType: "add",
        form: null,
        chainId: "",
        showChainModal: false,
        showPunchTheClockModal: false,
        flag: 0,
        showBookMarkDrawer: false,
        showNoteDrawer: false,
        showFootprintDrawer: false,
    } as EditType,
    reducers: {
        setActiveTodo: (state, payload) => {
            return {
                ...state,
                activeTodo: payload,
            };
        },
        setShowEdit: (state, payload) => {
            return {
                ...state,
                showEdit: payload,
            };
        },
        setOperatorType: (state, payload) => {
            return {
                ...state,
                operatorType: payload,
            };
        },
        setForm: (state, payload) => {
            return {
                ...state,
                form: payload,
            };
        },
        setChainId: (state, payload) => {
            return {
                ...state,
                chainId: payload,
            };
        },
        setShowChainModal: (state, payload) => {
            return {
                ...state,
                showChainModal: payload,
            };
        },
        setShowPunchTheClockModal: (state, payload) => {
            return {
                ...state,
                showPunchTheClockModal: payload,
            };
        },
        setFlag: (state, payload) => {
            return {
                ...state,
                flag: payload,
            };
        },
        setShowBookMarkDrawer: (state, payload) => {
            return {
                ...state,
                showBookMarkDrawer: payload,
            };
        },
        setShowNoteDrawer: (state, payload) => {
            return {
                ...state,
                showNoteDrawer: payload,
            };
        },
        setShowFootprintDrawer: (state, payload) => {
            return {
                ...state,
                showFootprintDrawer: payload,
            };
        },
    },
});
