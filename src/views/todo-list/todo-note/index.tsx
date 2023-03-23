import React, { useEffect, useState, useContext } from "react";
import styles from "./index.module.scss";
import { Input, Radio, Pagination, Empty, Button, Spin, Space } from "antd";
import { TodoItemType, CategoryType } from "../types";
import TodoImageFile from "../component/todo-image-file";
import TodoNoteDetailModal from "./todo-note-detail-modal";
import { getTodoCategory, getTodoList } from "@/client/TodoListHelper";
import { renderDescription } from "../component/one-day-list/todo-item-name";
import { debounce } from "../utils";
import { TodoEditContext } from "../TodoEditContext";
import { TodoDataContext } from "../TodoDataContext";

const { Search } = Input;

interface IProps {}

const TodoNote: React.FC<IProps> = (props) => {
    const { handleAdd, handleEdit } = useContext(TodoEditContext);
    const { isRefreshNote, setIsRefreshNote } = useContext(TodoDataContext);

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
            sortBy: [[sortBy, "DESC"]],
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
            getNoteList();
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

    const [activeTodo, setActiveTodo] = useState<TodoItemType>();
    // 详情
    const [isShowDetail, setIsShowDetail] = useState<boolean>(false);

    const [sortBy, setSortBy] = useState<"mTime" | "cTime">("mTime");
    useEffect(() => {
        getData();
    }, [sortBy, pageNo, isRefreshNote]);

    const [showFilter, setShowFilter] = useState<boolean>(false);

    return (
        <div className={`${styles.note} ScrollBar`}>
            <Spin spinning={loading}>
                <div className={styles.wrap}>
                    <div className={styles.header}>
                        <span>todo note ({total})</span>
                        <Space>
                            <Search
                                className={styles.input}
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
                            <Button
                                type={showFilter ? "primary" : "default"}
                                onClick={() => setShowFilter((prev) => !prev)}
                            >
                                筛选
                            </Button>
                            <Button
                                onClick={() =>
                                    setSortBy(
                                        sortBy === "cTime" ? "mTime" : "cTime"
                                    )
                                }
                            >
                                按{sortBy === "cTime" ? "创建" : "修改"}时间倒序
                            </Button>
                            <Button
                                className={styles.add_note}
                                type="primary"
                                onClick={() => {
                                    handleAdd();
                                }}
                            >
                                新增
                            </Button>
                        </Space>
                    </div>
                    {showFilter && (
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
                    )}
                    <div className={styles.note_list}>
                        {list?.map((item) => {
                            return (
                                <div
                                    key={item.todo_id}
                                    className={styles.note_item}
                                    onClick={() => {
                                        setActiveTodo(item);
                                        setIsShowDetail(true);
                                    }}
                                >
                                    <div className={styles.note_header}>
                                        <span className={styles.category}>
                                            {item.category}
                                        </span>
                                        <span>{item.name}</span>
                                    </div>
                                    <div className={styles.note_content}>
                                        {renderDescription(
                                            item.description,
                                            keyword
                                        )}
                                    </div>
                                    <TodoImageFile
                                        isOnlyShow={true}
                                        todo={{
                                            ...item,
                                            imgList: item.imgList.slice(0, 3),
                                        }}
                                        width="120px"
                                    />
                                    {item.imgList.length > 3 && (
                                        <div style={{ opacity: 0.7 }}>
                                            还有 {item.imgList.length - 3} 张图
                                        </div>
                                    )}
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

                    <Pagination
                        className={styles.pagination}
                        current={pageNo}
                        pageSize={pageSize}
                        total={total}
                        onChange={(page) => setPageNo(page)}
                        onShowSizeChange={(cur, size) => setPageSize(size)}
                        showTotal={(total) => `共${total}条`}
                    />
                </div>

                {/* 详情 */}
                <TodoNoteDetailModal
                    visible={isShowDetail}
                    activeTodo={
                        activeTodo &&
                        list?.find(
                            (item) => item.todo_id === activeTodo.todo_id
                        )
                    }
                    onCancel={() => {
                        setIsShowDetail(false);
                        setActiveTodo(undefined);
                    }}
                    refreshData={refreshData}
                    handleEdit={() => {
                        activeTodo && handleEdit(activeTodo);
                    }}
                />
            </Spin>
        </div>
    );
};

export default TodoNote;
