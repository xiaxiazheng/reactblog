import React, { useEffect, useState } from "react";
import { Button, Space } from "antd";
import { getTodoById } from "@xiaxiazheng/blog-libs";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import TodoItemWeb from "../todo-tree-web/todo-item-web";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import SearchTodoModal from "../search-todo-modal";
import { ClearOutlined } from "@ant-design/icons";

const SearchTodo = ({ value, onChange, activeTodo }: any) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [nowTodo, setNowTodo] = useState<TodoItemType>();

    useEffect(() => {
        // 如果本来就有关联的 todo，就初始化
        if (value && (!nowTodo || nowTodo?.todo_id !== value)) {
            setLoading(true);
            getTodoById(value).then((res) => {
                if (res.data) {
                    setNowTodo(res.data);
                }
                setLoading(false);
            });
        }
    }, [value]);

    const [visible, setVisible] = useState<boolean>(false);

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <>
            {value ? (
                nowTodo && !loading ? (
                    <Space size={8} className={styles.space}>
                        <Button
                            className={styles.nowTodo}
                            onClick={() => {
                                setVisible(true);
                            }}
                        >
                            <TodoItemWeb
                                item={nowTodo}
                                placement="left"
                                onlyShow={true}
                                showTimeRange={true}
                            />
                        </Button>
                        <Button
                            icon={<ClearOutlined />}
                            type="primary"
                            danger
                            onClick={() => onChange("")}
                        />
                    </Space>
                ) : (
                    <Loading />
                )
            ) : (
                <Button onClick={() => setVisible(true)}>
                    点击选择前置 todo
                </Button>
            )}
            <SearchTodoModal
                value={value}
                onChange={(item) => {
                    setNowTodo(item);
                    onChange(item.todo_id);
                }}
                visible={visible}
                handleClose={handleClose}
                activeTodo={activeTodo}
            />
        </>
    );
};

export default SearchTodo;
