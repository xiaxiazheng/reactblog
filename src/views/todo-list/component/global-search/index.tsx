import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { Button, DatePicker, Input, Select, Space } from "antd";
import { TodoItemType } from "../../types";
import { ClearOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { TodoDataContext } from "../../TodoDataContext";
import { TodoEditContext } from "../../TodoEditContext";
import { getTodoCategory } from "@/client/TodoListHelper";
import { colorList, colorMap, colorNameMap } from "../../utils";

const GlobalSearch: React.FC = (props) => {
    const {
        refreshData,
        activeColor,
        setActiveColor,
        activeCategory,
        setActiveCategory,
        startEndTime,
        setStartEndTime,
        keyword: contextKeyword,
        setKeyword: setContextKeyword,
        handleClear,
        isFilter,
    } = useContext(TodoDataContext);

    const { handleAdd } = useContext(TodoEditContext);

    const Filter = () => {
        return (
            <div className={styles.filterWrapper}>
                <div>
                    <span>轻重：</span>
                    <Select
                        value={activeColor}
                        onChange={(val) => setActiveColor(val)}
                        allowClear
                        style={{ width: 120 }}
                    >
                        <Select.Option key="所有" value="">
                            所有
                        </Select.Option>
                        {colorList.map((item) => (
                            <Select.Option
                                key={item}
                                value={item}
                                style={{
                                    color: colorMap[item],
                                }}
                            >
                                {colorNameMap[item]}
                            </Select.Option>
                        ))}
                    </Select>
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
                                handleClear();
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
