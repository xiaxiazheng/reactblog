import React, { useContext, useEffect, useState } from "react";
import {
    DrawerProps,
    Input,
    Modal,
    Space,
    Spin,
    Checkbox,
} from "antd";
import { getTodoChainById, TodoItemType, useSettingsContext } from "@xiaxiazheng/blog-libs";
import { useUpdateFlag } from "../../hooks";
import ModalWrapper from "@/components/modal-wrapper";
import { ThemeContext } from "@/context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import styles from "./index.module.scss";
import TodoTreeWeb from "../todo-tree-web";

interface IProps extends DrawerProps { }

const TodoChainModal: React.FC<IProps> = (props) => {
    const { theme } = useContext(ThemeContext);
    const { todoColorMap, todoColorNameMap } = useSettingsContext();

    const visible = useSelector(
        (state: RootState) => state.edit.showChainModal
    );
    const chainId = useSelector((state: RootState) => state.edit.chainId);
    const dispatch = useDispatch<Dispatch>();
    const { setShowChainModal } = dispatch.edit;

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

    const [selectedColorList, setSelectedColorList] = useState<string[]>(
        Object.keys(todoColorMap || {})
    );

    const [localKeyword, setLocalKeyword] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");

    const getFilterList = () => {
        setShowList(handleFilterTree(todoChainList));
    };

    // 根据 keyword 递归筛选整棵树
    const handleFilterTree = (list: TodoItemType[]): TodoItemType[] => {
        return list.reduce((prev: TodoItemType[], item) => {
            const newItem = {
                ...item,
            }
            // 递归，先把所有子节点筛一遍
            if (newItem.child_todo_list) {
                newItem.child_todo_list = handleFilterTree(newItem.child_todo_list);
            }
            // 再判断父节点，因为如果有符合条件的子节点，那父节点就没事；依赖子节点的状态
            if (judgeSearch(newItem) || newItem?.child_todo_list?.length !== 0) {
                prev.push(newItem);
            }
            return prev;
        }, []);
    };

    // 实际上的 keyword 判断 + color 判断
    const judgeSearch = (item: TodoItemType) => {
        return (item.name.toLowerCase().indexOf(localKeyword.toLowerCase()) !==
            -1 ||
            item.description
                .toLowerCase()
                .indexOf(localKeyword.toLowerCase()) !== -1) && (selectedColorList.includes(item.color))
    }

    const [showList, setShowList] = useState<TodoItemType[]>([]);
    useEffect(() => {
        getFilterList();
    }, [todoChainList, selectedColorList]);

    return (
        <ModalWrapper
            className={theme === "dark" ? "darkTheme" : ""}
            title={
                <Space size={16}>
                    <span>todo chain</span>
                    <Input
                        value={localKeyword}
                        onChange={(e) => setLocalKeyword(e.target.value)}
                        onPressEnter={() => {
                            getFilterList();
                            setKeyword(localKeyword);
                        }}
                    />
                </Space>
            }
            open={visible}
            destroyOnHidden
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
                    options={
                        todoColorMap &&
                        Object.keys(todoColorMap).map((item) => {
                            return {
                                label: (
                                    <span style={{ color: todoColorMap[item] }}>
                                        {todoColorNameMap?.[item]}
                                    </span>
                                ),
                                value: item,
                            };
                        })
                    }
                    value={selectedColorList}
                    onChange={(val: any) => setSelectedColorList(val)}
                />
                <TodoTreeWeb todoList={showList} dataMode="tree" getTodoItemProps={(item) => {
                    return {
                        showPointIcon: chainId === item.todo_id,
                        showTime: true,
                        showTimeRange: true,
                        keyword,
                    }
                }} />
            </Spin>
        </ModalWrapper>
    );
};

export default TodoChainModal;
