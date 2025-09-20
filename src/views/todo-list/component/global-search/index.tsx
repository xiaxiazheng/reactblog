import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { Button, Input, Checkbox, Space, Tooltip } from "antd";
import {
    ClearOutlined,
    PlusOutlined,
    RedoOutlined,
    FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import Filter from "./filter";
import { TodoTypeIcon, TodoStatus } from "@xiaxiazheng/blog-libs";
import { SettingsContext } from "@/context/SettingsContext";
import { colorTitle } from "../../utils";

export const useGetOriginTodo = () => {
    const settings = useContext(SettingsContext);

    return () => ({
        name: "",
        description: "",
        time: dayjs(),
        status: TodoStatus.todo,
        color: String(settings?.todoDefaultColor || "3"),
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
    });
};

const GlobalSearch: React.FC = () => {
    const { todoColorMap, todoColorNameMap } = useContext(SettingsContext);
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
    const isKeyNode = useSelector((state: RootState) => state.filter.isKeyNode);

    const dispatch = useDispatch<Dispatch>();
    const { setShowEdit, setOperatorType, setActiveTodo } = dispatch.edit;
    const { refreshData, handleSearch: search } = dispatch.data;
    const {
        setKeyword: setContextKeyword,
        handleClear,
        setIsWork,
        setActiveColor,
    } = dispatch.filter;

    const getOriginTodo = useGetOriginTodo();

    const handleAdd = () => {
        setActiveTodo(undefined);
        setOperatorType("add");
        setShowEdit(true);
        form?.setFieldsValue({
            ...getOriginTodo(),
            category: isWork === "1" ? "公司" : getOriginTodo().category,
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
        isKeyNode,
    ]);

    useEffect(() => {
        if (isHabit === "1" || isTarget === "1" || isKeyNode === '1') {
            setShowFilter(true);
        }
    }, [isHabit, isTarget, isKeyNode]);

    const [showFilter, setShowFilter] = useState<boolean>(false);

    const [keyword, setKeyword] = useState<string>();

    const isFilter = () => {
        return (
            activeColor?.length !== 0 ||
            activeCategory?.length !== 0 ||
            (typeof keyword !== "undefined" && keyword !== "") ||
            !!startEndTime ||
            pageNo !== 1 ||
            isHabit === "1" ||
            isTarget === "1" ||
            isKeyNode === "1"
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
                    {/* refresh */}
                    <Button onClick={() => refreshData()} type="primary">
                        <RedoOutlined />
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
                                <TodoTypeIcon
                                    type="life"
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
                    {/* <Select
                        className={styles.select}
                        value={activeCategory || undefined}
                        placeholder="类别筛选"
                        onChange={(val: any) => setActiveCategory(val)}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        allowClear
                        style={{ width: 130 }}
                        options={category?.map((item) => {
                            return {
                                label: `${item.category} (${item.count})`,
                                value: item.category,
                            };
                        })}
                    /> */}
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
                                setKeyword(undefined);
                                setShowFilter(false);
                            }}
                        />
                    )}
                </Space>
            </div>

            <Input.Search
                className={styles.search}
                value={keyword}
                onChange={(e) => {
                    setKeyword(e.target.value);
                    // keyword 一旦清空就直接刷新
                    if (!e.target.value || e.target.value === "") {
                        setContextKeyword("");
                    }
                }}
                onSearch={() => setContextKeyword(keyword || "")}
                enterButton
                allowClear={true}
                placeholder="可用空格分词实现一定模糊搜索"
            />

            <div>
                <span>{colorTitle}：</span>
                <Checkbox.Group value={activeColor}>
                    {todoColorMap && Object.keys(todoColorMap).map((item) => (
                        <Checkbox
                            key={item}
                            value={item}
                            onClick={() => {
                                setActiveColor(
                                    activeColor.includes(item)
                                        ? activeColor.filter((i) => i !== item)
                                        : activeColor.concat(item)
                                );
                            }}
                            style={{ color: todoColorMap[item] }}
                            className={`${styles.color} ${item === "0" ? styles.zero : ""
                                }${item === "1" ? styles.one : ""}${item === "2" ? styles.two : ""
                                }${item === "3" ? styles.three : ""}${item === "4" ? styles.four : ""
                                }${item === "-1" ? styles.minusOne : ""}`}
                        >
                            {todoColorNameMap?.[item]}
                        </Checkbox>
                    ))}
                </Checkbox.Group>
                <Button
                    size="small"
                    onClick={() => setActiveColor(["0", "1", "2"])}
                >
                    important
                </Button>
            </div>

            <Filter isSimple={!showFilter} />
        </Space>
    );
};

export default GlobalSearch;
