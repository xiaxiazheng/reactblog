import moment from "moment";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { OperatorType, TodoItemType, TodoStatus } from "./types";
import { Form, FormInstance } from "antd";
import { setFootPrintList } from "./todo-footprint";

interface ContextType {
    flag: number;
    setFlag: React.Dispatch<React.SetStateAction<number>>;

    activeTodo: TodoItemType | undefined;
    setActiveTodo: React.Dispatch<
        React.SetStateAction<TodoItemType | undefined>
    >;
    operatorType: OperatorType | undefined;
    setOperatorType: React.Dispatch<
        React.SetStateAction<OperatorType | undefined>
    >;
    form: FormInstance<any>;
    showEdit: boolean;
    setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
    showChainModal: boolean;
    setShowChainModal: React.Dispatch<React.SetStateAction<boolean>>;
    chainId: string;
    setChainId: React.Dispatch<React.SetStateAction<string>>;

    showPunchTheClockModal: boolean;
    setShowPunchTheClockModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ContextTypeStable {
    handleAdd: () => void;
    handleEdit: (item: TodoItemType) => void;
}

export const TodoEditContext = createContext({} as ContextType);
export const TodoEditContextStable = createContext({} as ContextTypeStable);

/** 保存 todo 信息 */
export const TodoEditProvider: React.FC = (props) => {
    const [flag, setFlag] = useState<number>(0);
    const [form] = Form.useForm();

    // 编辑相关
    const [operatorType, setOperatorType] = useState<OperatorType>();
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();

    const handleAdd = () => {
        setActiveTodo(undefined);
        setOperatorType("add");
        setShowEdit(true);
        form.setFieldsValue({
            time: moment(),
            status: TodoStatus.todo,
            color: "3",
            category: "个人",
            doing: "0",
            isNote: "0",
            isTarget: "0",
            isBookMark: "0",
        });
    };

    const handleEdit = (item: TodoItemType) => {
        setActiveTodo(item);
        setOperatorType("edit");
        setShowEdit(true);
    };

    useEffect(() => {
        if (activeTodo) {
            const item = activeTodo;
            form.setFieldsValue({
                name: item.name,
                description: item.description,
                time: moment(item.time),
                status: Number(item.status),
                color: item.color,
                category: item.category,
                other_id: item.other_id,
                doing: item.doing,
                isNote: item.isNote,
                isTarget: item.isTarget,
                isBookMark: item.isBookMark,
            });

            // 保存足迹
            setFootPrintList(item.todo_id);
        }
    }, [activeTodo]);

    // chain 相关
    const [showChainModal, setShowChainModal] = useState<boolean>(false);
    const [chainId, setChainId] = useState<string>("");

    // 打卡相关
    const [showPunchTheClockModal, setShowPunchTheClockModal] =
        useState<boolean>(false);

    const value = useMemo(() => {
        return { handleAdd, handleEdit };
    }, []);

    return (
        <TodoEditContextStable.Provider
            value={value}
        >
            <TodoEditContext.Provider
                value={{
                    activeTodo,
                    setActiveTodo,
                    operatorType,
                    setOperatorType,
                    form,
                    showEdit,
                    setShowEdit,
                    flag,
                    setFlag,
                    showChainModal,
                    setShowChainModal,
                    chainId,
                    setChainId,
                    showPunchTheClockModal,
                    setShowPunchTheClockModal,
                }}
            >
                {props.children}
            </TodoEditContext.Provider>
        </TodoEditContextStable.Provider>
    );
};

export const TodoConsumer = TodoEditContext.Consumer;
export const TodoConsumerStable = TodoEditContextStable.Consumer;
