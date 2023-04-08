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
} from "antd";
import { getTodoChainById } from "@/client/TodoListHelper";
import { TodoItemType } from "../../types";
import TodoItem from "../todo-item";
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

    const nowTodo = todoChainList.find((item) => item.todo_id === chainId);

    const handleFilter = (list: TodoItemType[]): TodoItemType[] => {
        return list.filter(
            (item) =>
                !localKeyword ||
                item.name.toLowerCase().indexOf(localKeyword.toLowerCase()) !==
                    -1 ||
                item.description
                    .toLowerCase()
                    .indexOf(localKeyword.toLowerCase()) !== -1 ||
                handleFilter(item?.child_todo_list || [])?.length !== 0
        );
    };

    const renderChildTodo = (list: TodoItemType[]) => {
        return handleFilter(list)
            .sort(
                (a, b) =>
                    new Date(a.time).getTime() - new Date(b.time).getTime()
            )
            .map((item) => (
                <div key={item.todo_id}>
                    {item.child_todo_list_length !== 0 && isShowAll ? (
                        <Collapse ghost defaultActiveKey={[item.todo_id]}>
                            <Collapse.Panel
                                key={item.todo_id}
                                header={
                                    <TodoItem
                                        key={item.todo_id}
                                        item={item}
                                        showDoneIcon={false}
                                        isChain={true}
                                        isChainNext={true}
                                        isModalOrDrawer={true}
                                    />
                                }
                            >
                                {item.child_todo_list_length !== 0 &&
                                    renderChildTodo(item.child_todo_list)}
                            </Collapse.Panel>
                        </Collapse>
                    ) : (
                        <div style={{ paddingLeft: isShowAll ? 24 : 0 }}>
                            <TodoItem
                                key={item.todo_id}
                                item={item}
                                showDoneIcon={false}
                                isChain={true}
                                isChainNext={true}
                                isModalOrDrawer={true}
                            />
                        </div>
                    )}
                </div>
            ));
    };

    const [isShowAll, setIsShowAll] = useState<boolean>(false);

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
                        type={isShowAll ? "primary" : "default"}
                        onClick={() => setIsShowAll((prev) => !prev)}
                    >
                        show All
                    </Button>
                </Space>
            }
            open={visible}
            destroyOnClose
            onCancel={() => {
                setShowChainModal(false);
                setLocalKeyword("");
                setIsShowAll(false);
            }}
            footer={null}
            width={650}
        >
            <Spin spinning={loading}>
                {/* 前置 */}
                {handleFilter(
                    todoChainList.filter((item) => item.todo_id !== chainId)
                )?.length !== 0 && (
                    <>
                        <h4>前置：</h4>
                        {handleFilter(
                            todoChainList.filter(
                                (item) => item.todo_id !== chainId
                            )
                        )
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
                {nowTodo && handleFilter([nowTodo])?.length !== 0 && (
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
                            item={nowTodo}
                            showDoneIcon={false}
                            isChain={true}
                            isModalOrDrawer={true}
                        />
                    </>
                )}
                {/* 后续 */}
                {nowTodo &&
                    nowTodo.child_todo_list_length !== 0 &&
                    handleFilter(nowTodo.child_todo_list)?.length !== 0 && (
                        <>
                            <Divider style={{ margin: "12px 0" }} />
                            <h4>后续：</h4>
                            {renderChildTodo(nowTodo.child_todo_list)}
                        </>
                    )}
            </Spin>
        </Modal>
    );
};

export default TodoChainModal;
