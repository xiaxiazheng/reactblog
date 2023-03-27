import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { Button, DatePicker, Input, Radio, Select, Space } from "antd";
import { TodoItemType, TodoStatus } from "../../types";
import { ClearOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { getTodoCategory } from "@/client/TodoListHelper";
import { colorList, colorMap, colorNameMap } from "../../utils";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";

const GlobalSearch: React.FC = (props) => {
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
    const contextKeyword = useSelector(
        (state: RootState) => state.filter.keyword
    );
    const pageNo = useSelector((state: RootState) => state.filter.pageNo);
    const pageSize = useSelector((state: RootState) => state.filter.pageSize);
    const dispatch = useDispatch<Dispatch>();
    const { setShowEdit, setOperatorType, setActiveTodo } = dispatch.edit;
    const { refreshData, handleSearch: search } = dispatch.data;
    const {
        setActiveColor,
        setActiveCategory,
        setStartEndTime,
        setKeyword: setContextKeyword,
        handleClear,
    } = dispatch.filter;

    const handleAdd = () => {
        setActiveTodo(undefined);
        setOperatorType("add");
        setShowEdit(true);
        form &&
            form.setFieldsValue({
                time: moment(),
                status: TodoStatus.todo,
                color: "3",
                category: "个人",
                doing: "0",
                isNote: "0",
                isTarget: "0",
                isBookMark: "0",
            });
    };

    useEffect(() => {
        search(undefined);
    }, [
        contextKeyword,
        activeColor,
        activeCategory,
        startEndTime,
        pageNo,
        pageSize,
    ]);

    const Filter = () => {
        return (
            <div className={styles.filterWrapper}>
                <div>
                    <span>轻重：</span>
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
                        value={activeCategory}
                        onChange={(val) => setActiveCategory(val)}
                        allowClear
                        style={{ width: 120 }}
                    >
                        <Select.Option key="所有" value="">
                            所有
                        </Select.Option>
                        {category?.map((item) => (
                            <Select.Option
                                key={item.category}
                                value={item.category}
                            >
                                {item.category}
                            </Select.Option>
                        ))}
                    </Select>
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

    const [category, setCategory] = useState<any[]>([]);
    const getCategory = async () => {
        const res = await getTodoCategory();
        setCategory(res.data);
    };
    useEffect(() => {
        getCategory();
    }, []);

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
            pageNo !== 1
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
                        筛选
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
                {props.children}
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
