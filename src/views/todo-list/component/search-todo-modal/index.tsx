import React, { useEffect, useState } from "react";
import {
    Input,
    message,
    Modal,
    Pagination,
    Radio,
    Space,
} from "antd";
import { getTodoById, getTodoList, TodoItemType, getFootPrintList } from "@xiaxiazheng/blog-libs";
import TodoTreeWeb from "../todo-tree-web";
import TodoItemWeb from "../todo-tree-web/todo-item-web";
import styles from "./index.module.scss";
import { Loading } from "@xiaxiazheng/blog-libs";
import {
    fetchFootprintList,
    NewTodoItemType,
} from "../../list/todo-footprint";
import { useSelector } from "react-redux";
import { RootState } from "../../rematch";

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
    const [footprintList, setFootprintList] = useState<NewTodoItemType[]>([]);
    const [options, setOptions] = useState<TodoItemType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const habitLoading = useSelector(
        (state: RootState) => state.data.habitLoading
    );
    const habitList = useSelector((state: RootState) => state.data.habitList);
    const habitListOrigin = useSelector(
        (state: RootState) => state.data.habitListOrigin
    );

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
        setOptions(habitList.filter(
            (item: TodoItemType) => item.todo_id !== activeTodo?.todo_id && (
                item.name.toLowerCase().indexOf(newValue.toLowerCase()) !== -1 ||
                item.description.toLowerCase().indexOf(newValue.toLowerCase()) !== -1)
        ));
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
                !['footprint', 'directory', 'chain'].includes(sortBy) && (
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
                        label: '当前 chain',
                        value: "chain"
                    },
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
                    <TodoTreeWeb
                        todoList={options}
                        onClick={(item) => {
                            onChange(item);
                            handleClose();
                        }}
                        getTodoItemProps={() => {
                            return { keyword }
                        }}
                    />
                ) : sortBy === "chain" ? <>这里展示当前的 todo-chain， 施工中</> : (
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
                                    <TodoItemWeb
                                        item={item}
                                        placement="left"
                                        onlyShow={true}
                                        showTime={true}
                                        showTimeRange={true}
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
