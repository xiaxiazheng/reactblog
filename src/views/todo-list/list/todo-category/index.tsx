import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import TodoTypeIcon from "../../component/todo-type-icon";
import TodoTreeList from "../../todo-tree-list";
import { SortKeyMap } from "../../component/sort-btn";
import { SettingsContext } from "@/context/SettingsContext";
import { Button, Modal } from "antd";
import { ThemeContext } from "@/context/ThemeContext";
import TodoCategoryShow from "../../component/todo-category-show";

const TodoCategory = () => {
    const { todoNameMap } = useContext(SettingsContext);
    const { theme } = useContext(ThemeContext);

    const habitLoading = useSelector(
        (state: RootState) => state.data.habitLoading
    );
    const habitList = useSelector((state: RootState) => state.data.habitList);
    const habitListOrigin = useSelector(
        (state: RootState) => state.data.habitListOrigin
    );
    const dispatch = useDispatch<Dispatch>();
    const { setHabitList, getFilterList } = dispatch.data;
    useEffect(() => {
        setHabitList(getFilterList({ list: habitListOrigin, type: "habit" }));
    }, [habitListOrigin]);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <TodoTreeList
                loading={habitLoading}
                sortKey={SortKeyMap.habit}
                title={
                    <>
                        <TodoTypeIcon type="habit" /> {todoNameMap?.habit}
                    </>
                }
                mapList={habitList.sort(
                    (a, b) => Number(a.color) - Number(b.color)
                )}
                btn={<Button onClick={() => setIsOpen(true)}>show modal</Button>}
            />
            <Modal
                className={`${theme === "dark" ? "darkTheme" : ""}`}
                title={<><TodoTypeIcon type="habit" /> {todoNameMap?.habit}</>}
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                width={'90vw'}
            >
                {isOpen && <TodoCategoryShow />}
            </Modal>
        </>
    );
};

export default TodoCategory;
