import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Popover, Radio, Select, Space } from "antd";
import { IsLoginContext } from "@/context/IsLoginContext";
import { BlogContext, BlogContextType } from "../BlogContext";

// 高级筛选
const Filter: React.FC = () => {
    const { isLogin } = useContext(IsLoginContext); // 获取是否登录

    const { tabsState, setTabsState } =
        useContext<BlogContextType>(BlogContext);

    // 展开方便用
    const { orderBy, showVisible, showInvisible, showNotTag } = tabsState;

    // 处理按什么排序
    const handleOrderBy = (
        value: "create" | "modify" | "letter" | "letterDesc" | "visits"
    ) => {
        setTabsState({
            ...tabsState,
            orderBy: value,
            pageNo: 1,
        });
    };

    // 处理可见
    const handleVisible = (value: "all" | "show" | "hide") => {
        setTabsState({
            ...tabsState,
            showVisible: value === "all" || value === "show",
            showInvisible: value === "all" || value === "hide",
            pageNo: 1,
        });
    };

    // 处理未设置 tag
    const handleShowTag = (value: "all" | "hide") => {
        setTabsState({
            ...tabsState,
            showNotTag: value === "hide",
            pageNo: 1,
        });
    };

    return (
        <Popover
            title={false}
            content={
                <Space size={8}>
                    {/* 排序条件 */}
                    <Select
                        className={styles.orderbyBox}
                        value={orderBy}
                        onChange={handleOrderBy}
                    >
                        <Select.Option value="create">按创建时间</Select.Option>
                        <Select.Option value="modify">按修改时间</Select.Option>
                        <Select.Option value="letter">首字母升序</Select.Option>
                        <Select.Option value="letterDesc">
                            首字母降序
                        </Select.Option>
                        <Select.Option value="visits">按访问的量</Select.Option>
                    </Select>
                    {isLogin && (
                        <>
                            {/* 是否可见 */}
                            <Select
                                className={styles.orderbyBox}
                                value={
                                    showVisible
                                        ? showInvisible
                                            ? "all"
                                            : "show"
                                        : "hide"
                                }
                                onChange={handleVisible}
                            >
                                <Select.Option value="all">
                                    <EyeOutlined />
                                    全部
                                </Select.Option>
                                <Select.Option value="show">
                                    仅可见
                                </Select.Option>
                                <Select.Option value="hide">
                                    不可见
                                </Select.Option>
                            </Select>
                        </>
                    )}

                    {/* 是否设置 tag */}
                    <Select
                        className={styles.orderbyBox}
                        value={showNotTag ? "hide" : "all"}
                        onChange={handleShowTag}
                    >
                        <Select.Option value="all">不管 tag</Select.Option>
                        {/* <Select.Option value="show">设置了tag</Select.Option> */}
                        <Select.Option value="hide">未设置tag</Select.Option>
                    </Select>
                </Space>
            }
        >
            <Button>筛选</Button>
        </Popover>
    );
};

export default Filter;
