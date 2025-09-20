import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Input, Radio, Pagination, Empty, Button, Spin, Space, Modal } from "antd";
import { CategoryType } from "../../types";
import TodoImageFile from "../../component/todo-image-file";
import { getTodoCategory, getTodoList } from "@/client/TodoListHelper";
import { renderDescription } from "../../component/todo-item/todo-item-name";
import { debounce, getRangeFormToday } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import TodoItem from "../../component/todo-item";
import { ThemeContext } from "@/context/ThemeContext";
import { TodoItemType } from "@xiaxiazheng/blog-libs";

const { Search } = Input;

const maxLength = 1;

interface IProps { }

const TodoNote: React.FC<IProps> = (props) => {
    const dispatch = useDispatch<Dispatch>();

    const { theme } = useContext(ThemeContext);

    const showNoteDrawer = useSelector(
        (state: RootState) => state.edit.showNoteDrawer
    );
    const { setShowNoteDrawer } = dispatch.edit;

    const isRefreshNote = useSelector(
        (state: RootState) => state.data.isRefreshNote
    );
    const { setIsRefreshNote } = dispatch.data;

    const handleEdit = (item: TodoItemType) => {
        const { setActiveTodo, setShowEdit, setOperatorType } = dispatch.edit;
        setActiveTodo(item);
        setShowEdit(true);
        setOperatorType("edit");
    };

    const [list, setList] = useState<TodoItemType[]>();
    const [total, setTotal] = useState<number>(0);

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [activeCategory, setActiveCategory] = useState<string>("所有");

    const [loading, setLoading] = useState<boolean>(false);

    const getNoteList = async () => {
        setLoading(true);

        const params: any = {
            keyword,
            pageNo,
            pageSize,
            isNote: "1",
            sortBy:
                sortBy === "time"
                    ? [
                        ["time", "DESC"],
                        ["cTime", "DESC"],
                    ]
                    : [[sortBy, "DESC"]],
        };

        if (activeCategory !== "所有") {
            params["category"] = activeCategory;
        }

        const res = await getTodoList(params);

        if (res) {
            setList(res?.data?.list || []);
            setTotal(res?.data?.total || 0);
        }
        setLoading(false);
    };

    const getData = debounce(() => getNoteList(), 300);

    useEffect(() => {
        if (isRefreshNote) {
            refreshData();
            setIsRefreshNote(false);
        }
    }, [isRefreshNote]);

    const [category, setCategory] = useState<CategoryType[]>();
    const getCategory = async () => {
        const res = await getTodoCategory({ isNote: "1" });
        if (res) {
            setCategory(res.data);
        }
    };

    const refreshData = () => {
        getData();
        getCategory();
    };

    useEffect(() => {
        pageNo === 1 ? getData() : setPageNo(1);
    }, [activeCategory, pageSize]);

    useEffect(() => {
        getCategory();
    }, []);

    const [sortBy, setSortBy] = useState<"time" | "mTime">("time");
    useEffect(() => {
        getData();
    }, [sortBy, pageNo, isRefreshNote]);

    return (
        <Modal
            closable={false}
            className={`${styles.noteModal} ${theme === "dark" ? "darkTheme" : ""
                }`}
            open={showNoteDrawer}
            onCancel={() => setShowNoteDrawer(false)}
            width="1000px"
            footer={<Pagination
                className={styles.pagination}
                current={pageNo}
                pageSize={pageSize}
                total={total}
                onChange={(page) => setPageNo(page)}
                onShowSizeChange={(cur, size) => setPageSize(size)}
                showTotal={(total) => `共${total}条`}
            />}
        >
            <div className={`${styles.note}`}>
                <Spin spinning={loading}>
                    <div className={styles.wrap}>
                        {/* 顶部 */}
                        <Space className={styles.header} direction="vertical">
                            <div className={styles.headerOne}>
                                <span>todo note ({total})</span>
                                <Space>
                                    {/* 搜索框 */}
                                    <Search
                                        className={styles.input}
                                        placeholder="回车才搜索，不回车只高亮"
                                        value={keyword}
                                        enterButton
                                        onChange={(e) => setKeyword(e.target.value)}
                                        onSearch={() =>
                                            pageNo === 1 ? getData() : setPageNo(1)
                                        }
                                        onPressEnter={() =>
                                            pageNo === 1 ? getData() : setPageNo(1)
                                        }
                                    />
                                    {/* 排序规则 */}
                                    <Button
                                        onClick={() =>
                                            setSortBy(
                                                sortBy === "time" ? "mTime" : "time"
                                            )
                                        }
                                    >
                                        按{sortBy === "time" ? "time" : "修改"}
                                        时间倒序
                                    </Button>
                                </Space>
                            </div>
                        </Space>
                        {/* 下边 */}
                        <div className={styles.mainContent}>
                            {/* 左边 */}
                            <div className={styles.leftSide}>
                                {/* 类目筛选 */}
                                <Radio.Group
                                    className={styles.radioList}
                                    value={activeCategory}
                                    onChange={(e) => setActiveCategory(e.target.value)}
                                >
                                    <Radio key="所有" value="所有">
                                        所有 (
                                        {category?.reduce(
                                            (prev, cur) => prev + Number(cur.count),
                                            0
                                        )}
                                        )
                                    </Radio>
                                    {category?.map((item) => {
                                        return (
                                            <Radio
                                                key={item.category}
                                                value={item.category}
                                            >
                                                {item.category}({item.count})
                                            </Radio>
                                        );
                                    })}
                                </Radio.Group>
                            </div>
                            {/* 右边 */}
                            <div className={`${styles.rightSide} ScrollBar`}>
                                <div className={`${styles.note_list}`}>
                                    {list?.map((item) => {
                                        return (
                                            <div
                                                key={item.todo_id}
                                                className={styles.note_item}
                                                onClick={() => handleEdit(item)}
                                            >
                                                <div className={styles.note_time}>
                                                    {item.time}(
                                                    {getRangeFormToday(item.time)})
                                                </div>
                                                <div className={styles.note_box}>
                                                    <div className={styles.note_header}>
                                                        <TodoItem
                                                            item={item}
                                                            onlyShow={true}
                                                        />
                                                    </div>
                                                    <div className={styles.note_content}>
                                                        {renderDescription(item.description, keyword)}
                                                    </div>
                                                    <TodoImageFile
                                                        isOnlyShow={true}
                                                        todo={{
                                                            ...item,
                                                            imgList: item.imgList?.slice(
                                                                0,
                                                                maxLength
                                                            ),
                                                        }}
                                                        width="120px"
                                                    />
                                                    {item.imgList && item.imgList.length > maxLength && (
                                                        <div style={{ opacity: 0.7 }}>
                                                            还有{" "}
                                                            {item.imgList.length -
                                                                maxLength}{" "}
                                                            张图
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {(!list || list?.length === 0) && (
                                        <Empty
                                            style={{
                                                paddingTop: 100,
                                                gridColumnStart: 1,
                                                gridColumnEnd: 4,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
            </div>
        </Modal>
    );
};

export default TodoNote;
