import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Button, Input, Select, Space, Tooltip } from "antd";
import { CreateTodoItemReq, TodoStatus } from "../../types";
import {
    ClearOutlined,
    PlusOutlined,
    RedoOutlined,
    CoffeeOutlined,
    FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import Filter from "./filter";
import TodoTypeIcon from "../todo-type-icon";

export const getOriginTodo = () => {
    return {
        name: "",
        description: "",
        time: dayjs(),
        status: TodoStatus.todo,
        color: "3",
        category: "个人",
        doing: "0",
        isNote: "0",
        isTarget: "0",
        isBookMark: "0",
        isWork: "0",
        isHabit: "0",
        isKeyNode: "0",
        isFollowUp: "0",
        other_id: "",
    };
};

const GlobalSearch: React.FC = () => {
    const category = useSelector((state: RootState) => state.data.category);
    const form = useSelector((state: RootState) => state.edit.form);
    const activeColor = useSelector(
        (state: RootState) => state.filter.activeColor
    );
    const activeCategory = useSelector(
        (state: RootState) => state.filter.activeCategory
    );
    const startEndTime = useSelector(
        (state: RootState) => state.filter.startEndTime
    );
    const isWork = useSelector((state: RootState) => state.filter.isWork);
    const contextKeyword = useSelector(
        (state: RootState) => state.filter.keyword
    );
    const pageNo = useSelector((state: RootState) => state.filter.pageNo);
    const pageSize = useSelector((state: RootState) => state.filter.pageSize);
    const isTarget = useSelector((state: RootState) => state.filter.isTarget);
    const isNote = useSelector((state: RootState) => state.filter.isNote);
    const isHabit = useSelector((state: RootState) => state.filter.isHabit);

    const dispatch = useDispatch<Dispatch>();
    const { setShowEdit, setOperatorType, setActiveTodo } = dispatch.edit;
    const { refreshData, handleSearch: search } = dispatch.data;
    const {
        setActiveCategory,
        setKeyword: setContextKeyword,
        handleClear,
        setIsWork,
    } = dispatch.filter;

    const handleAdd = () => {
        setActiveTodo(undefined);
        setOperatorType("add");
        setShowEdit(true);
        const originTodo = getOriginTodo();
        form?.setFieldsValue({
            ...originTodo,
            category: isWork === "1" ? "公司" : originTodo.category,
            isWork: isWork || "0",
        });
    };

    useEffect(() => {
        search(undefined);
    }, [
        contextKeyword,
        activeColor,
        activeCategory,
        startEndTime,
        isWork,
        pageNo,
        pageSize,
        isTarget,
        isNote,
        isHabit,
    ]);

    useEffect(() => {
        if (isHabit === "1" || isTarget === "1") {
            setShowFilter(true);
        }
    }, [isHabit, isTarget]);

    const [showFilter, setShowFilter] = useState<boolean>(false);

    const [keyword, setKeyword] = useState<string>("");
    useEffect(() => {
        setKeyword(contextKeyword);
    }, [contextKeyword]);

    useEffect(() => {
        if (!keyword || keyword === "") {
            handleSearch("");
        }
    }, [keyword]);

    const handleSearch = (str: string) => {
        setContextKeyword(str);
    };

    const isFilter = () => {
        return (
            activeColor !== "" ||
            activeCategory !== "" ||
            keyword !== "" ||
            !!startEndTime ||
            pageNo !== 1 ||
            isHabit === "1" ||
            isTarget === "1"
        );
    };

    return (
        <Space
            direction="vertical"
            style={{ padding: "10px 20px", borderBottom: "1px solid #ccc" }}
        >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Space>
                    <Button onClick={() => handleAdd()}>
                        <PlusOutlined />
                        todo
                    </Button>
                    <Button onClick={() => refreshData()} type="primary">
                        <RedoOutlined />
                        refresh
                    </Button>
                    <Tooltip title={"开启 Work 模式"}>
                        <Button
                            type="text"
                            onClick={() => setIsWork(isWork === "1" ? "" : "1")}
                            onContextMenu={(e) => {
                                setIsWork("0");
                                e.preventDefault();
                            }}
                            icon={
                                <TodoTypeIcon
                                    type="work"
                                    style={
                                        isWork === "1"
                                            ? {}
                                            : { color: "#00d4d8" }
                                    }
                                />
                            }
                            style={
                                isWork === "1"
                                    ? {
                                          borderColor: "#00d4d8",
                                          background: "#00d4d8",
                                      }
                                    : { borderColor: "#00d4d8" }
                            }
                        />
                    </Tooltip>
                    <Tooltip title={"开启 Life 模式"}>
                        <Button
                            type="text"
                            onClick={() => setIsWork(isWork === "0" ? "" : "0")}
                            icon={
                                <CoffeeOutlined
                                    style={
                                        isWork === "0"
                                            ? {}
                                            : { color: "#00d4d8" }
                                    }
                                />
                            }
                            style={
                                isWork === "0"
                                    ? {
                                          borderColor: "#00d4d8",
                                          background: "#00d4d8",
                                      }
                                    : { borderColor: "#00d4d8" }
                            }
                        />
                    </Tooltip>
                    <Select
                        className={styles.select}
                        value={activeCategory || undefined}
                        placeholder="类别"
                        onChange={(val: any) => setActiveCategory(val)}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        allowClear
                        style={{ width: 100 }}
                        options={category?.map((item) => {
                            return {
                                label: item.category,
                                value: item.category,
                            };
                        })}
                    />
                    <Button
                        type={showFilter ? "primary" : "default"}
                        onClick={() => setShowFilter((prev) => !prev)}
                    >
                        <FilterOutlined />
                        Filter
                    </Button>
                    {/* 清理筛选项 */}
                    {(isFilter() || showFilter) && (
                        <Button
                            icon={<ClearOutlined />}
                            type="primary"
                            danger
                            onClick={() => {
                                handleClear(undefined);
                                setShowFilter(false);
                            }}
                        />
                    )}
                </Space>
            </div>

            <Input.Search
                className={styles.search}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={() => handleSearch(keyword)}
                enterButton
                allowClear={true}
                placeholder="可用空格分词实现一定模糊搜索"
            />

            {showFilter && <Filter />}
        </Space>
    );
};

export default GlobalSearch;
