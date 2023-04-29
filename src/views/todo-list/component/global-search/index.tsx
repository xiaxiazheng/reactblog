import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Button, DatePicker, Input, Radio, Select, Space, Tooltip } from "antd";
import { TodoStatus } from "../../types";
import {
    AppleFilled,
    ClearOutlined,
    PlusOutlined,
    RedoOutlined,
} from "@ant-design/icons";
import { colorList, colorMap, colorNameMap, colorTitle } from "../../utils";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";

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
        other_id: "",
        startTime: dayjs(),
        target: 7,
        range: 7,
        isPunchTheClock: "0",
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
    const dispatch = useDispatch<Dispatch>();
    const {
        setShowEdit,
        setOperatorType,
        setActiveTodo,
        // setShowBookMarkDrawer,
        // setShowNoteDrawer,
        // setShowFootprintDrawer,
    } = dispatch.edit;
    const { refreshData, handleSearch: search } = dispatch.data;
    const {
        setActiveColor,
        setActiveCategory,
        setStartEndTime,
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
    ]);

    const Filter = () => {
        return (
            <div className={styles.filterWrapper}>
                <div>
                    <span>W / L：</span>
                    <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        value={isWork}
                    >
                        {[
                            { label: "work", value: "1" },
                            { label: "life", value: "0" },
                        ].map((item) => (
                            <Radio.Button
                                key={item.value}
                                value={item.value}
                                onClick={() =>
                                    setIsWork(
                                        isWork === item.value ? "" : item.value
                                    )
                                }
                            >
                                {item.label}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
                <div>
                    <span>{colorTitle}：</span>
                    <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        value={activeColor}
                    >
                        {colorList.map((item) => (
                            <Radio.Button
                                key={item}
                                value={item}
                                onClick={() =>
                                    setActiveColor(
                                        activeColor === item ? "" : item
                                    )
                                }
                                style={{ color: colorMap[item] }}
                                className={`${styles.color} ${
                                    item === "0" ? styles.zero : ""
                                }${item === "1" ? styles.one : ""}${
                                    item === "2" ? styles.two : ""
                                }${item === "3" ? styles.three : ""}${
                                    item === "-1" ? styles.minusOne : ""
                                }`}
                            >
                                {colorNameMap[item]}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
                <div>
                    <span>类别：</span>
                    <Select
                        className={styles.select}
                        value={activeCategory}
                        onChange={(val: any) => setActiveCategory(val)}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        allowClear
                        style={{ width: 120 }}
                        options={category?.map((item) => {
                            return {
                                label: item.category,
                                value: item.category,
                            };
                        })}
                    />
                </div>
                <div>
                    <span>时间：</span>
                    <DatePicker.RangePicker
                        value={startEndTime}
                        onChange={(val) => setStartEndTime(val)}
                        placeholder={["开始时间", "结束时间"]}
                    />
                </div>
            </div>
        );
    };

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
            isWork !== ""
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
                    <Button
                        type={showFilter ? "primary" : "default"}
                        onClick={() => setShowFilter((prev) => !prev)}
                    >
                        Filter
                    </Button>
                    {isWork !== "1" && (
                        <Tooltip
                            title={
                                <>
                                    <div>左键：开启 Work 模式</div>
                                    <div>左键：开启 Life 模式</div>
                                </>
                            }
                        >
                            <Button
                                type="text"
                                onClick={() => setIsWork("1")}
                                onContextMenu={(e) => {
                                    setIsWork("0");
                                    e.preventDefault();
                                }}
                                icon={
                                    <AppleFilled style={{ color: "#00d4d8" }} />
                                }
                                style={{ borderColor: "#00d4d8" }}
                            />
                        </Tooltip>
                    )}
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
