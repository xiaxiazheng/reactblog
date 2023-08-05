import React, { useEffect, useState } from "react";
import {
    Button,
    Divider,
    Input,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Tooltip,
} from "antd";
import { getTodoById, getTodoList } from "@/client/TodoListHelper";
import { TodoItemType } from "../../types";
import TodoItemName from "../todo-item/todo-item-name";
import styles from "./index.module.scss";
import Loading from "@/components/loading";

interface IProps {
    visible: boolean;
    handleClose: () => void;
    value: string | undefined;
    onChange: (item: TodoItemType) => void;
    activeTodo: TodoItemType;
}

const SearchTodoModal: React.FC<IProps> = ({ visible, handleClose, value, onChange, activeTodo }) => {
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
        if (newValue === '') {
            req.status = '0';
        }

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

    useEffect(() => {
        !value && handleSearch("");
    }, []);

    const [keyword, setKeyword] = useState<string>("");

    return (
        <Modal
            title="选择前置 Todo"
            open={visible}
            width={700}
            className={styles.modal}
            onCancel={handleClose}
            footer={<Pagination />}
        >
            {loading && <Loading />}
            <Input
                className={styles.input}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => handleSearch(keyword)}
            />
            <div className={`${styles.content} ScrollBar`}>
                <Space size={10} direction="vertical">
                    {options?.map((item) => {
                        return (
                            <div
                                key={item.todo_id}
                                onClick={() => {
                                    onChange(item);
                                    handleClose();
                                }}
                                className={styles.todoItem}
                            >
                                <TodoItemName
                                    item={item}
                                    placement="left"
                                    onlyShow={true}
                                    isShowTimeRange={true}
                                />
                            </div>
                        );
                    })}
                </Space>
            </div>
        </Modal>
    );
};

export default SearchTodoModal;
