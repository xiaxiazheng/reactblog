import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import { TodoItemType, TodoTypeIcon } from "@xiaxiazheng/blog-libs";
import TodoTreeList from "../../todo-tree-list";
import { SortKeyMap } from "../../component/sort-btn";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";
import { Button, Modal, Radio, Space } from "antd";
import { ThemeContext } from "@/context/ThemeContext";
// import TodoCategoryShow from "../../component/todo-category-modal-show";
import { EyeFilled } from "@ant-design/icons";
import HomeTabs from "@/views/home/home-tabs";

/** 当前的知识目录 */
const TodoDirectory = () => {
    const { todoNameMap } = useSettingsContext();
    const { theme } = useContext(ThemeContext);

    const categoryLoading = useSelector(
        (state: RootState) => state.data.categoryLoading
    );
    const categoryList = useSelector((state: RootState) => state.data.categoryList);
    const categoryListOrigin = useSelector(
        (state: RootState) => state.data.categoryListOrigin
    );
    const dispatch = useDispatch<Dispatch>();
    const { setCategoryList, getFilterList } = dispatch.data;
    useEffect(() => {
        setCategoryList(getFilterList({ list: categoryListOrigin, type: "category" }));
    }, [categoryListOrigin]);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    // 打开编辑弹窗
    const [activeTodo, setActiveTodo] = useState<TodoItemType | null | undefined>(null);
    const handleEditTodo = () => {
        const { setActiveTodo, setShowEdit, setOperatorType } = dispatch.edit;
        setActiveTodo(activeTodo);
        setShowEdit(true);
        setOperatorType("edit");
    }

    // 关闭编辑弹窗后，接收更新信号，传给 homeTodo 更新数据
    const { flag } = useSelector((state: RootState) => state.edit);

    const [type, setType] = useState<'home' | 'all'>('all');

    return (
        <>
            <TodoTreeList
                loading={categoryLoading}
                sortKey={SortKeyMap.category}
                title={
                    <>
                        <TodoTypeIcon type="isDirectory" /> {todoNameMap?.isDirectory}
                    </>
                }
                mapList={categoryList.sort(
                    (a, b) => Number(a.color) - Number(b.color)
                )}
                btn={<Button onClick={() => setIsOpen(true)}><EyeFilled /> home todo</Button>}
            />
            <Modal
                className={`${theme === "dark" ? "darkTheme" : ""}`}
                title={<Space>
                    <EyeFilled /> Home Todo
                    <Radio.Group
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        options={[{ label: 'home, 跟游客看到的一模一样', value: 'home' }, { label: 'all，看所有类目', value: 'all' }]}>
                    </Radio.Group>
                </Space>}
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                width={'98vw'}
                footer={
                    <>
                        {activeTodo && <Button onClick={handleEditTodo}>编辑</Button>}
                    </>
                }
            >
                {isOpen && <HomeTabs
                    type={type}
                    flag={flag}
                    getActiveTodo={(item) => {
                        setActiveTodo(item);
                    }} />}
            </Modal>
        </>
    );
};

export default TodoDirectory;
