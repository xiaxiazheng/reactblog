import React, { useEffect, useState } from "react";
import { Divider, message, Select, Tooltip } from "antd";
import { getTodoById, getTodoList } from "@/client/TodoListHelper";
import { TodoItemType } from "../../types";
import { debounce } from "lodash";
import { renderDescription } from "../one-day-list/todo-item-name";

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

    const handleSearch = async (newValue: string) => {
        setLoading(true);
        const req: any = {
            keyword: newValue,
            pageNo: 1,
            pageSize: 20,
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

    const Name = ({ item }: { item: TodoItemType }) => {
        return (
            <div style={{ whiteSpace: "pre-line" }}>
                {item.name} <span style={{ color: "#ccc" }}>({item.time})</span>
            </div>
        );
    };

    return (
        <Select
            showSearch
            value={value}
            loading={loading}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={debounce(handleSearch, 500)}
            onChange={onChange}
            onDropdownVisibleChange={() => {
                // 如果展开为空的话，再去获取默认的20条数据
                if (options.length === 0) {
                    handleSearch("");
                }
            }}
            notFoundContent={null}
            allowClear
        >
            {options?.map((item) => {
                return (
                    <Select.Option
                        key={item.todo_id}
                        label={item.name}
                        value={item.todo_id}
                    >
                        {item.description ? (
                            <Tooltip
                                placement="left"
                                color="rgba(0,0,0,0.9)"
                                title={
                                    <div>
                                        <Name item={item} />
                                        <Divider
                                            style={{
                                                margin: "6px 0",
                                                backgroundColor: "white",
                                            }}
                                        />
                                        {renderDescription(item.description)}
                                    </div>
                                }
                            >
                                <Name item={item} />
                                <span style={{ fontSize: 12, color: "#ccc" }}>
                                    {item.description}
                                </span>
                            </Tooltip>
                        ) : (
                            <Name item={item} />
                        )}
                    </Select.Option>
                );
            })}
        </Select>
    );
};

export default SearchTodo;
