import React, { useEffect, useState } from "react";
import { Divider, message, Select, Tooltip } from "antd";
import { getTodoById, getTodoList } from "@xiaxiazheng/blog-libs";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import TodoItemName from "../component/todo-item/todo-item-name";
import styles from "./index.module.scss";

export const debounce = (fn: Function, time = 500) => {
    let timer: any = -1;
    return (...args: any) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
        }, time);
    };
};

const SearchTodo = ({ value, onChange, activeTodo }: any) => {
    const [options, setOptions] = useState<TodoItemType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // 如果本来就有关联的 todo，就初始化
        if (!options.find((item) => item.todo_id === value) && value) {
            getTodoById(value).then((res) => {
                if (res.data) {
                    setOptions((prev) => [res.data].concat(prev));
                }
            });
        }
    }, [value]);

    // 搜索接口
    const handleSearch = async (newValue: string) => {
        setLoading(true);
        const req: any = {
            keyword: newValue,
            pageNo: 1,
            pageSize: 20,
            sortBy: [["isTarget", "DESC"], ["mTime", "DESC"], ["color"]],
        };

        const res = await getTodoList(req);
        if (res) {
            // 前置 todo 不能是自己
            setOptions(
                res.data.list.filter(
                    (item: TodoItemType) => item.todo_id !== activeTodo?.todo_id
                )
            );
            setLoading(false);
        } else {
            message.error("获取 todolist 失败");
        }
    };

    // 默认数据，去拿 target 目标列表
    const getDefaultList = async () => {
        setLoading(true);
        const req: any = {
            isTarget: "1",
            pageNo: 1,
            pageSize: 100,
        };
        const res = await getTodoList(req);
        if (res) {
            setOptions(res.data.list);
            setLoading(false);
        } else {
            message.error("获取 todolist 失败");
        }
    };

    return (
        <Select
            showSearch
            value={value}
            loading={loading}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={debounce(handleSearch, 800)}
            onChange={onChange}
            onDropdownVisibleChange={() => {
                // 如果展开为空的话，再去获取默认数据
                if (options.length === 0) {
                    getDefaultList();
                }
            }}
            notFoundContent={null}
            allowClear
            dropdownClassName={`${styles.selectOptions} darkTheme`}
            dropdownStyle={{ background: "var(--bg_color)" }}
        >
            {options?.map((item) => {
                return (
                    <Select.Option
                        key={item.todo_id}
                        label={item.name}
                        value={item.todo_id}
                    >
                        <TodoItemName
                            item={item}
                            placement="left"
                            onlyShow={true}
                            isShowTimeRange={true}
                        />
                    </Select.Option>
                );
            })}
        </Select>
    );
};

export default SearchTodo;
