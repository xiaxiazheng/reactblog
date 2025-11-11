import React, { useContext, useEffect, useReducer, useState } from "react";
import {
    DrawerProps,
    Input,
    Checkbox,
    Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import styles from "./index.module.scss";
import { useSettingsContext, TodoTreeItemType } from "@xiaxiazheng/blog-libs";
import TodoTreeWeb from "../todo-tree-web";

interface IProps extends DrawerProps { }

/** "知识目录"弹窗里的展示内容，暂时废弃 */
const TodoCategoryShow: React.FC<IProps> = () => {
    const { todoColorMap, todoColorNameMap } = useSettingsContext();

    const dispatch = useDispatch<Dispatch>();

    const [tempKeyword, setTempKeyword] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");

    const categoryListOrigin = useSelector(
        (state: RootState) => state.data.categoryListOrigin
    );

    // 根据 judgeSearch 递归筛选整棵树
    const handleFilterTree = (list: TodoTreeItemType[], judgeSearch: (item: TodoTreeItemType) => Boolean): TodoTreeItemType[] => {
        return list.reduce((prev: TodoTreeItemType[], item) => {
            const newItem = {
                ...item,
            }
            // 递归，先把所有子节点筛一遍
            if (newItem?.children) {
                newItem.children = handleFilterTree(newItem?.children, judgeSearch);
            }
            // 再判断父节点，因为如果有符合条件的子节点，那父节点就没事；依赖子节点的状态
            if (judgeSearch(newItem) || newItem?.children?.length !== 0) {
                prev.push(newItem);
            }
            return prev;
        }, []);
    };

    // 实际上的 keyword 判断 + color 判断
    const judgeSearch = (item: TodoTreeItemType) => {
        return (item.name.toLowerCase().indexOf(tempKeyword.toLowerCase()) !==
            -1 ||
            item.description
                .toLowerCase()
                .indexOf(tempKeyword.toLowerCase()) !== -1) && (selectedColorList.includes(item.color))
    }

    const [selectedColorList, setSelectedColorList] = useState<string[]>(
        Object.keys(todoColorMap || {})
    );

    /** 强制刷新 TodoTreeWeb */
    const [flag, forceRender] = useReducer(s => s + 1, 0);

    return (
        <>
            <Space>
                <Input
                    style={{ width: 200 }}
                    value={tempKeyword}
                    onChange={(e) => setTempKeyword(e.target.value)}
                    onPressEnter={() => {
                        setKeyword(tempKeyword);
                        forceRender();
                    }}
                />
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
                    onChange={(val: any) => {
                        setSelectedColorList(val);
                        forceRender();
                    }}
                />
            </Space>
            <TodoTreeWeb
                todoList={categoryListOrigin}
                dataMode="flat"
                getTodoItemProps={() => {
                    return {
                        showTime: true,
                        showTimeRange: true,
                        keyword,
                    }
                }}
                handleFilterTree={(list) => handleFilterTree(list, judgeSearch)}
            />
        </>
    );
};

export default TodoCategoryShow;