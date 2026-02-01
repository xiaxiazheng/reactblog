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
import { useSettingsContext } from "@xiaxiazheng/blog-libs";
import { colorTitle } from "../../utils";

export const useGetOriginTodo = () => {
    const settings = useSettingsContext();

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
        isDirectory: "0",
        isEncode: "0",
        isFollowUp: "0",
        isShow: "0",
        other_id: "",
    });
};

const GlobalSearch: React.FC = () => {
    const { todoColorMap, todoColorNameMap } = useSettingsContext();
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
    const isDirectory = useSelector((state: RootState) => state.filter.isDirectory);
    const isEncode = useSelector((state: RootState) => state.filter.isEncode);

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
        isDirectory,
        isEncode,
    ]);

    useEffect(() => {
        if (isDirectory === "1" || isTarget === "1" || isEncode === '1') {
            setShowFilter(true);
        }
    }, [isDirectory, isTarget, isEncode]);

    const [showFilter, setShowFilter] = useState<boolean>(false);

    const [keyword, setKeyword] = useState<string>();

    const isFilter = () => {
        return (
            activeColor?.length !== 0 ||
            activeCategory?.length !== 0 ||
            (typeof keyword !== "undefined" && keyword !== "") ||
            !!startEndTime ||
            pageNo !== 1 ||
            isDirectory === "1" ||
            isTarget === "1" ||
            isEncode === "1"
        );
    };

    return (
        <Space
            orientation="vertical"
            style={{ padding: "10px 20px", borderBottom: "1px solid #ccc" }}
        >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Space>
                    {/* 新增 todo 按钮 */}
                    <Button onClick={() => handleAdd()}>
                        <PlusOutlined />
                        todo
                    </Button>
                    {/* refresh 刷新按钮 */}
                    <Button onClick={() => refreshData()} type="primary">
                        <RedoOutlined />
                    </Button>
                    {/* 模式切换 */}
                    <>
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
                                        type="isWork"
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
                    </>
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

            {/* 全局搜索 */}
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

            {/* color 重要程度筛选 */}
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

            {/* 更精细的筛选项 */}
            <Filter isSimple={!showFilter} />
        </Space>
    );
};

export default GlobalSearch;
