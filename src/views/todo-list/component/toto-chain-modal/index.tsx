import React, { useContext, useEffect, useMemo, useState } from "react";
import { Divider, DrawerProps, Input, Modal, Space, Spin } from "antd";
import { getTodoChainById } from "@/client/TodoListHelper";
import { TodoItemType } from "../../types";
import TodoItem from "../one-day-list/todo-item";
import { useUpdateFlag } from "../../hooks";
import { ThemeContext } from "@/context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";

interface IProps extends DrawerProps {}

const TodoChainModal: React.FC<IProps> = (props) => {
    const { theme } = useContext(ThemeContext);

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

    const activeTodo = todoChainList.find((item) => item.todo_id === chainId);

    const handleFilter = (list: TodoItemType[]) => {
        return list.filter(
            (item) =>
                !localKeyword ||
                item.name.toLowerCase().indexOf(localKeyword.toLowerCase()) !==
                    -1 ||
                item.description
                    .toLowerCase()
                    .indexOf(localKeyword.toLowerCase()) !== -1
        );
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
                </Space>
            }
            open={visible}
            destroyOnClose
            onCancel={() => {
                setShowChainModal(false);
                setLocalKeyword("");
            }}
            footer={null}
            width={650}
        >
            <Spin spinning={loading}>
                {activeTodo && (
                    <>
                        {/* 前置 */}
                        {handleFilter(
                            todoChainList.filter(
                                (item) => item.todo_id !== chainId
                            )
                        )?.length !== 0 && (
                            <>
                                <h4>前置：</h4>
                                {todoChainList
                                    .filter((item) => item.todo_id !== chainId)
                                    .reverse()
                                    .map((item) => (
                                        <TodoItem
                                            key={item.todo_id}
                                            item={item}
                                            showDoneIcon={false}
                                            isChain={true}
                                            isModalOrDrawer={true}
                                        />
                                    ))}
                                <Divider style={{ margin: "12px 0" }} />
                            </>
                        )}
                        {/* 当前 */}
                        {handleFilter([activeTodo])?.length !== 0 && (
                            <>
                                <h4>
                                    <span
                                        style={{
                                            color: "#40a9ff",
                                        }}
                                    >
                                        当前：
                                    </span>
                                </h4>
                                <TodoItem
                                    item={activeTodo}
                                    showDoneIcon={false}
                                    isChain={true}
                                    isModalOrDrawer={true}
                                />
                            </>
                        )}
                        {/* 后续 */}
                        {handleFilter(activeTodo.child_todo_list)?.length !==
                            0 && (
                            <>
                                <Divider style={{ margin: "12px 0" }} />
                                <h4>后续：</h4>
                                {handleFilter(activeTodo.child_todo_list)
                                    .sort(
                                        (a, b) =>
                                            new Date(a.time).getTime() -
                                            new Date(b.time).getTime()
                                    )
                                    .map((item) => (
                                        <div key={item.todo_id}>
                                            <TodoItem
                                                key={item.todo_id}
                                                item={item}
                                                showDoneIcon={false}
                                                isChain={true}
                                                isChainNext={true}
                                                isModalOrDrawer={true}
                                            />
                                        </div>
                                    ))}
                            </>
                        )}
                    </>
                )}
            </Spin>
        </Modal>
    );
};

export default TodoChainModal;
