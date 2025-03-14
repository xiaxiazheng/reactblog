import React, { useEffect, useState } from "react";
import {
    Input,
    message,
    Modal,
    Pagination,
    Radio,
    Space,
} from "antd";
import { getTodoById, getTodoList } from "@/client/TodoListHelper";
import { TodoItemType } from "../../types";
import TodoItemName from "../todo-item/todo-item-name";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import {
    fetchFootprintList,
    getFootPrintList,
} from "../../list/todo-footprint";
import TodoTree from "../todo-tree";

interface IProps {
    visible: boolean;
    handleClose: () => void;
    value: string | undefined;
    onChange: (item: TodoItemType) => void;
    activeTodo: TodoItemType;
}

const pageSize = 15;

/** 搜前置 todo 用的 */
const SearchTodoModal: React.FC<IProps> = ({
    visible,
    handleClose,
    value,
    onChange,
    activeTodo,
}) => {
    const [footprintList, setFootprintList] = useState<TodoItemType[]>([]);
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
    const handleTimeSearch = async (newValue: string) => {
        if (sortBy === "footprint") return;
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

    // 搜索接口
    const handleGetDirectory = async (newValue: string) => {
        setLoading(true);
        const req: any = {
            keyword: newValue,
            pageNo,
            pageSize,
            isHabit: "1",
            sortBy: [["color"]],
            status: "0",
        };

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

    const handleGetFootprint = async (keyword: string) => {
        const list = getFootPrintList();
        const l = await fetchFootprintList(list);
        setFootprintList(l);
    };

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    const [sortBy, setSortBy] = useState<string>("footprint");
    useEffect(() => {
        if (visible) {
            handleSearch();
        }
    }, [sortBy, pageNo, visible]);

    const handleSearch = () => {
        if (sortBy === "footprint") {
            handleGetFootprint(keyword);
        } else if (sortBy === "directory") {
            handleGetDirectory(keyword);
        } else {
            handleTimeSearch(keyword);
        }
    };

    useEffect(() => {
        if (sortBy === "footprint") {
            if (!keyword || keyword === "") {
                setOptions(footprintList);
            } else {
                setOptions(
                    footprintList.filter(
                        (item) =>
                            item.name.includes(keyword) ||
                            item.description.includes(keyword)
                    )
                );
            }
        }
    }, [keyword, footprintList]);

    return (
        <Modal
            title="选择前置 Todo"
            open={visible}
            width={700}
            className={styles.modal}
            onCancel={handleClose}
            footer={
                sortBy !== "footprint" && (
                    <Pagination
                        className={styles.pagination}
                        current={pageNo}
                        pageSize={pageSize}
                        total={total}
                        showTotal={(total) => `共 ${total} 条`}
                        onChange={(pageNo) => setPageNo(pageNo)}
                    />
                )
            }
        >
            {loading && <Loading />}
            <Input
                className={styles.input}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => handleSearch()}
            />
            <Radio.Group
                style={{ marginBottom: 10 }}
                defaultValue={"footprint"}
                onChange={(e) => setSortBy(e.target.value)}
                buttonStyle="solid"
                optionType="button"
                options={[
                    {
                        label: `足迹${footprintList.length}`,
                        value: "footprint",
                    },
                    { label: "知识目录", value: "directory" },
                    { label: "修改时间", value: "mTime" },
                    { label: "创建时间", value: "cTime" },
                    { label: "重要程度", value: "color" },
                ]}
            />
            <div className={`${styles.content} ScrollBar`}>
                {sortBy === "directory" ? (
                    <TodoTree
                        todoList={options}
                        onClick={(item) => {
                            onChange(item);
                            handleClose();
                        }}
                    />
                ) : (
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
                )}
            </div>
        </Modal>
    );
};

export default SearchTodoModal;
