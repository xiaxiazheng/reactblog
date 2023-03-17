import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { Button, Drawer, Input, Space, Tooltip } from "antd";
import { TodoItemType, TodoStatus } from "../../types";
import { ClearOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { TodoDataContext, TodoDataProvider } from "../../TodoDataContext";
import { TodoEditContext } from "../../TodoEditContext";

const GlobalSearch = () => {
    const {
        setTodoList,
        setPoolList,
        setTargetList,
        setBookMarkList,
        todoListOrigin,
        poolListOrigin,
        targetListOrigin,
        bookMarkListOrigin,
        refreshData,
    } = useContext(TodoDataContext);
    const { handleAdd } = useContext(TodoEditContext);

    // 搜索相关
    const [keyword, setKeyword] = useState<string>();
    useEffect(() => {
        if (!keyword || keyword === "") {
            getOriginList();
        }
    }, [keyword]);

    const getKeywordList = () => {
        if (keyword && keyword !== "") {
            setTodoList(
                todoListOrigin.filter(
                    (item: TodoItemType) =>
                        item.name.indexOf(keyword) !== -1 ||
                        item.description.indexOf(keyword) !== -1
                )
            );
            setPoolList(
                poolListOrigin.filter(
                    (item: TodoItemType) =>
                        item.name.indexOf(keyword) !== -1 ||
                        item.description.indexOf(keyword) !== -1
                )
            );
            setTargetList(
                targetListOrigin.filter(
                    (item: TodoItemType) =>
                        item.name.indexOf(keyword) !== -1 ||
                        item.description.indexOf(keyword) !== -1
                )
            );
            setBookMarkList(
                bookMarkListOrigin.filter(
                    (item: TodoItemType) =>
                        item.name.indexOf(keyword) !== -1 ||
                        item.description.indexOf(keyword) !== -1
                )
            );
        }
    };

    useEffect(() => {
        if (!keyword || keyword === "") {
            getOriginList();
        } else {
            getKeywordList();
        }
    }, [todoListOrigin, poolListOrigin, targetListOrigin, bookMarkListOrigin]);

    const getOriginList = () => {
        setTodoList(todoListOrigin);
        setPoolList(poolListOrigin);
        setTargetList(targetListOrigin);
        setBookMarkList(bookMarkListOrigin);
    };

    return (
        <Space>
            <Input
                placeholder="全局搜索"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => getKeywordList()}
            />
            {keyword && keyword !== "" && (
                <Button
                    icon={<ClearOutlined />}
                    type="primary"
                    danger
                    onClick={() => {
                        setKeyword("");
                    }}
                />
            )}
            <Button onClick={() => handleAdd()}>
                <PlusOutlined />
                todo
            </Button>
            <Button onClick={() => refreshData()} type="primary">
                <RedoOutlined />
                refresh
            </Button>
        </Space>
    );
};

export default GlobalSearch;
