import React, { useEffect, useState } from "react";
import {
    Button,
    Divider,
    Input,
    message,
    Modal,
    Pagination,
    Radio,
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

const pageSize = 15;

const SearchTodoModal: React.FC<IProps> = ({
    visible,
    handleClose,
    value,
    onChange,
    activeTodo,
}) => {
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
        let sort: string[] = ["mTime", "DESC"];
        if (sortBy === "time") {
            sort = ["time", "DESC"];
        }
        if (sortBy === "mTime") {
            sort = ["mTime", "DESC"];
        }
        if (sortBy === "cTime") {
            sort = ["cTime", "DESC"];
        }
        if (sortBy === "color") {
            sort = ["color"];
        }
        const req: any = {
            keyword: newValue,
            pageNo,
            pageSize,
            sortBy: [sort],
        };
        if (newValue === "") {
            req.status = "0";
        }

        const res = await getTodoList(req);
        if (res) {
            // 前置 todo 不能是自己
            setOptions(
                res.data.list.filter(
                    (item: TodoItemType) => item.todo_id !== activeTodo?.todo_id
                )
            );
            setTotal(res.data.total);
            setLoading(false);
        } else {
            message.error("获取 todolist 失败");
        }
    };

    useEffect(() => {
        !value && handleSearch("");
    }, []);

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    const [sortBy, setSortBy] = useState<string>("");
    useEffect(() => {
        handleSearch(keyword);
    }, [sortBy, pageNo]);

    return (
        <Modal
            title="选择前置 Todo"
            open={visible}
            width={700}
            className={styles.modal}
            onCancel={handleClose}
            footer={
                <Pagination
                    className={styles.pagination}
                    current={pageNo}
                    pageSize={pageSize}
                    total={total}
                    showTotal={(total) => `共 ${total} 条`}
                    onChange={(pageNo) => setPageNo(pageNo)}
                />
            }
        >
            {loading && <Loading />}
            <Input
                className={styles.input}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => handleSearch(keyword)}
            />
            <Radio.Group
                style={{ marginBottom: 10 }}
                defaultValue={"mTime"}
                onChange={(e) => setSortBy(e.target.value)}
                buttonStyle="solid"
                optionType="button"
                options={[
                    { label: "默认时间", value: "time" },
                    { label: "修改时间", value: "mTime" },
                    { label: "创建时间", value: "cTime" },
                    { label: "重要程度", value: "color" },
                ]}
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
                                    isShowTime={true}
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
