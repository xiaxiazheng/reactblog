import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Button,
    Collapse,
    Divider,
    DrawerProps,
    Input,
    Modal,
    Space,
    Spin,
    Checkbox,
} from "antd";
import { getTodoChainById } from "@/client/TodoListHelper";
import { TodoItemType } from "../../types";
import TodoItem from "../todo-item";
import { useUpdateFlag } from "../../hooks";
import { ThemeContext } from "@/context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import styles from "./index.module.scss";
import TodoChainLevel from "./todo-chain-level";
import TodoChainFlat from "./todo-chain-flat";
import TodoTimeLine from "./todo-time-line";
import { SettingsContext } from "@/context/SettingsContext";

interface IProps extends DrawerProps {}

const TodoChainModal: React.FC<IProps> = (props) => {
    const { theme } = useContext(ThemeContext);
    const { todoColorMap, todoColorNameMap } = useContext(SettingsContext);

    const visible = useSelector(
        (state: RootState) => state.edit.showChainModal
    );
    const chainId = useSelector((state: RootState) => state.edit.chainId);
    const localKeyword = useSelector(
        (state: RootState) => state.filter.localKeyword
    );
    const dispatch = useDispatch<Dispatch>();
    const { setShowChainModal } = dispatch.edit;
    const { setLocalKeyword } = dispatch.filter;

    const [todoChainList, setTodoChainList] = useState<TodoItemType[]>([]);

    const { flag } = useUpdateFlag();

    useEffect(() => {
        if (visible) {
            if (chainId) {
                getTodoChain(chainId);
            } else {
                setTodoChainList([]);
            }
        }
    }, [chainId, visible, flag]);

    const [loading, setLoading] = useState<boolean>(false);

    const getTodoChain = async (todo_id: string) => {
        setLoading(true);
        const res = await getTodoChainById(todo_id);
        setTodoChainList(res.data);
        setLoading(false);
    };

    const nowTodo = todoChainList.find((item) => item.todo_id === chainId);

    const [showType, setShowType] = useState<"flat" | "level" | "timeline">(
        "timeline"
    );

    const [selectedColorList, setSelectedColorList] = useState<string[]>(
        Object.keys(todoColorMap)
    );

    const getFilterList = (list: TodoItemType[]) => {
        return list.filter((item) => selectedColorList.includes(item.color));
    };

    return (
        <Modal
            className={theme === "dark" ? "darkTheme" : ""}
            title={
                <Space size={16}>
                    <span>todo chain</span>
                    <Input
                        value={localKeyword}
                        onChange={(e) => setLocalKeyword(e.target.value)}
                    />
                    <Button
                        type="primary"
                        onClick={() =>
                            setShowType((prev) =>
                                prev === "flat"
                                    ? "level"
                                    : prev === "level"
                                    ? "timeline"
                                    : "flat"
                            )
                        }
                    >
                        {showType}
                    </Button>
                </Space>
            }
            open={visible}
            destroyOnClose
            onCancel={() => {
                setShowChainModal(false);
                setLocalKeyword("");
            }}
            footer={null}
            width={1000}
        >
            <Spin spinning={loading}>
                <Checkbox.Group
                    className={styles.checkboxGroup}
                    options={Object.keys(todoColorMap).map((item) => {
                        return {
                            label: (
                                <span style={{ color: todoColorMap[item] }}>
                                    {todoColorNameMap[item]}
                                </span>
                            ),
                            value: item,
                        };
                    })}
                    value={selectedColorList}
                    onChange={(val: any) => setSelectedColorList(val)}
                />
                {showType === "timeline" && (
                    <TodoTimeLine
                        todoChainList={getFilterList(todoChainList)}
                        chainId={chainId}
                        localKeyword={localKeyword}
                    />
                )}
                {showType === "level" && (
                    <TodoChainLevel
                        localKeyword={localKeyword}
                        nowTodo={nowTodo}
                        todoChainList={getFilterList(todoChainList)}
                        chainId={chainId}
                    />
                )}
                {showType === "flat" && (
                    <TodoChainFlat
                        localKeyword={localKeyword}
                        nowTodo={nowTodo}
                        todoChainList={getFilterList(todoChainList)}
                        chainId={chainId}
                    />
                )}
            </Spin>
        </Modal>
    );
};

export default TodoChainModal;
