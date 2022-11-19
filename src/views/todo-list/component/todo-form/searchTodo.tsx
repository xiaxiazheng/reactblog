import React, { useEffect, useState } from "react";
import { Divider, message, Select, Tooltip } from "antd";
import { getTodoById, getTodoList } from "@/client/TodoListHelper";
import { TodoItemType } from "../../types";
import { debounce } from "lodash";

const SearchTodo = ({ value, onChange }: any) => {
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
    }, []);

    const handleSearch = async (newValue: string) => {
        setLoading(true);
        const req: any = {
            keyword: newValue,
            pageNo: 1,
            pageSize: 20,
        };

        const res = await getTodoList(req);
        if (res) {
            setOptions(res.data.list);
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
                                title={
                                    <div>
                                        <Name item={item} />
                                        <Divider
                                            style={{
                                                margin: "6px 0",
                                                backgroundColor: "white",
                                            }}
                                        />
                                        <div>{item.description}</div>
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
