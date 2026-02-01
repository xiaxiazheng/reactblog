import React, { useEffect, useState } from "react";
import {
    Input,
    message,
    Modal,
    Pagination,
    Radio,
} from "antd";
import { getTodoById, getTodoList, TodoItemType, getFootPrintList, getTodoChainById } from "@xiaxiazheng/blog-libs";
import TodoTreeWeb from "../todo-tree-web";
import TodoItemWeb from "../todo-tree-web/todo-item-web";
import styles from "./index.module.scss";
import { Loading } from "@xiaxiazheng/blog-libs";
import {
    fetchFootprintList,
    NewTodoItemType,
} from "../../list/todo-footprint";
import { useSelector } from "react-redux";
import ModalWrapper from "@/components/modal-wrapper";
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
    const [options, setOptions] = useState<TodoItemType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const directoryListOrigin = useSelector(
        (state: RootState) => state.data.directoryListOrigin
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
        } else {
            message.error("获取 todolist 失败");
        }
    };

    // 获取知识目录
    const handleGetCategory = async (newValue: string) => {
        setOptions(directoryListOrigin.filter(
            (item: TodoItemType) => item.todo_id !== activeTodo?.todo_id && (
                item.name.toLowerCase().indexOf(newValue.toLowerCase()) !== -1 ||
                item.description.toLowerCase().indexOf(newValue.toLowerCase()) !== -1)
        ));
    };

    // 获取足迹
    const handleGetFootprint = async (keyword: string) => {
        const list = getFootPrintList();
        const l = await fetchFootprintList(list);
        setOptions(l.filter(item =>
            item.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
            item.description.toLowerCase().indexOf(keyword.toLowerCase()) !== -1));
    };

    // 获取 todo chain
    const handleGetTrain = async () => {
        if (value) {
            const res = await getTodoChainById(value);
            if (res) {
                setOptions(res.data);
            } else {
                message.error("获取 todo chain 失败");
            }
        }
    }

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    const [sortBy, setSortBy] = useState<string>("footprint");
    useEffect(() => {
        if (visible) {
            handleSearch();
        }
    }, [sortBy, pageNo, visible]);

    const handleSearch = async () => {
        setLoading(true);
        if (sortBy === 'chain') {
            await handleGetTrain();
        } else if (sortBy === "footprint") {
            await handleGetFootprint(keyword);
        } else if (sortBy === "category") {
            await handleGetCategory(keyword);
        } else {
            await handleTimeSearch(keyword);
        }
        setLoading(false);
    };

    return (
        <ModalWrapper
            title="选择前置 Todo"
            open={visible}
            width={700}
            className={styles.modal}
            onCancel={handleClose}
            footer={
                !['footprint', 'category', 'chain'].includes(sortBy) && (
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
                options={(value ? [
                    {
                        label: '当前 chain',
                        value: "chain"
                    }] : [])
                    .concat([
                        {
                            label: `足迹`,
                            value: "footprint",
                        },
                        { label: "知识目录", value: "category" },
                        { label: "修改时间", value: "mTime" },
                        { label: "创建时间", value: "cTime" },
                    ])}
            />
            <div className={`${styles.content} ScrollBar`}>
                {["category", "chain"].includes(sortBy) ? (
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
                ) : options?.map((item) => {
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
            </div>
        </ModalWrapper>
    );
};

export default SearchTodoModal;
