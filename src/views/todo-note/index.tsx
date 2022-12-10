import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Input, Radio, Pagination, Empty, Button, Spin, Space } from "antd";
import { TodoItemType, CategoryType } from "../todo-list/types";
import TodoNoteEditModal from "./todo-note-edit-modal";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { debounce, sortBy } from "lodash";
import TodoImageFile from "../todo-list/component/todo-image-file";
import TodoNoteDetailModal from "./todo-note-detail-modal";
import { getTodoCategory, getTodoList } from "@/client/TodoListHelper";
import { renderDescription } from "../todo-list/component/one-day-list/todo-item-name";

const { Search } = Input;

const TodoNote: React.FC = () => {
    const [list, setList] = useState<TodoItemType[]>();
    const [total, setTotal] = useState<number>(0);

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(15);
    const [activeCategory, setActiveCategory] = useState<string>("所有");

    const [loading, setLoading] = useState<boolean>(false);

    useDocumentTitle("Todo 便签");

    const getData = debounce(async () => {
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
    }, 300);

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
        getData();
    }, [pageNo]);

    useEffect(() => {
        pageNo === 1 ? getData() : setPageNo(1);
    }, [activeCategory, pageSize]);

    useEffect(() => {
        refreshData();
    }, []);

    const [activeTodo, setActiveTodo] = useState<TodoItemType>();
    // 新建 / 编辑
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    // 详情
    const [isShowDetail, setIsShowDetail] = useState<boolean>(false);

    const [sortBy, setSortBy] = useState<"mTime" | "cTime">("mTime");
    useEffect(() => {
        getData();
    }, [sortBy]);

    return (
        <div className={`${styles.note} ScrollBar`}>
            <Spin spinning={loading}>
                <div className={styles.wrap}>
                    {/* 左侧分类列表 */}
                    <div className={styles.left}>
                        <Space direction="vertical" size={12}>
                            <Radio.Group
                                value={sortBy}
                                optionType="button"
                                buttonStyle="solid"
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <Radio.Button
                                    key={"修改时间"}
                                    value={"mTime"}
                                    type="primary"
                                >
                                    修改
                                </Radio.Button>
                                <Radio.Button key={"创建时间"} value={"cTime"}>
                                    创建
                                </Radio.Button>
                            </Radio.Group>
                            <Radio.Group
                                className={styles.radioList}
                                value={activeCategory}
                                onChange={(e) =>
                                    setActiveCategory(e.target.value)
                                }
                            >
                                <Space direction="vertical">
                                    <Radio key="所有" value="所有">
                                        所有 (
                                        {category?.reduce(
                                            (prev, cur) =>
                                                prev + Number(cur.count),
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
                                                {item.category} ({item.count})
                                            </Radio>
                                        );
                                    })}
                                </Space>
                            </Radio.Group>
                        </Space>
                    </div>
                    {/* 右侧便签列表 */}
                    <div className={styles.right}>
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
                                            activeTodo={item}
                                            refreshData={() => {}}
                                            width="120px"
                                        />
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
                </div>

                <Button
                    className={styles.add_note}
                    type="primary"
                    onClick={() => {
                        setActiveTodo(undefined);
                        setIsShowModal(true);
                    }}
                >
                    新增
                </Button>

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
                        setIsShowModal(true);
                    }}
                />

                {/* 新建 / 编辑 */}
                <TodoNoteEditModal
                    visible={isShowModal}
                    category={category}
                    activeTodo={activeTodo}
                    setActiveTodo={setActiveTodo}
                    closeModal={() => {
                        setIsShowModal(false);
                    }}
                    refreshData={refreshData}
                />
            </Spin>
        </div>
    );
};

export default TodoNote;
