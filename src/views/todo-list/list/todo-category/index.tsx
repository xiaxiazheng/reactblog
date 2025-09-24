import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import { TodoTypeIcon } from "@xiaxiazheng/blog-libs";
import TodoTreeList from "../../todo-tree-list";
import { SortKeyMap } from "../../component/sort-btn";
import { useSettings } from "@xiaxiazheng/blog-libs";
import { Button, Modal } from "antd";
import { ThemeContext } from "@/context/ThemeContext";
// import TodoCategoryShow from "../../component/todo-category-modal-show";
import HomeTodo from "@/views/home/home-todo";

/** 当前的知识目录 */
const TodoCategory = () => {
    const { todoNameMap } = useSettings();
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
                btn={<Button onClick={() => setIsOpen(true)}>home todo</Button>}
            />
            <Modal
                className={`${theme === "dark" ? "darkTheme" : ""}`}
                title={<><TodoTypeIcon type="habit" /> {todoNameMap?.habit}</>}
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                width={'90vw'}
            >
                {isOpen && <HomeTodo />}
            </Modal>
        </>
    );
};

export default TodoCategory;
