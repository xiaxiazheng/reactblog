import React, { useState, useEffect } from "react";
import { Input, Pagination, Select, message } from "antd";
import styles from "./index.module.scss";
import moment from "moment";
import Loading from "@/components/loading";
import ListItem from "../component/list-item";
import { getWeek, formatArrayToTimeMap } from "../utils";
import { debounce } from "lodash";
import { getTodoCategory, getTodoList } from "@/client/TodoListHelper";
import { StatusType, TodoStatus } from "../index";

interface Props {
    title: "待办" | "已完成" | "待办池" | string;
    handleEdit: Function;
    handleCopy: Function;
    isRefreshDone: boolean;
    setIsRefreshDone: Function;
}

// 已完成列表
const DoneList: React.FC<Props> = (props) => {
    const { title, handleEdit, handleCopy, isRefreshDone, setIsRefreshDone } = props;

    const [doneMap, setDoneMap] = useState<any>({});

    const today = moment().format("YYYY-MM-DD");
    const getDoneList = debounce(() => getDoneTodo(), 200);

    const [category, setCategory] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const getCategory = async () => {
        const res = await getTodoCategory();
        setCategory(res.data);
    };
    useEffect(() => {
        getCategory();
    }, []);

    useEffect(() => {
        getDoneList();
    }, [activeCategory]);

    const [loading, setLoading] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [activeColor, setActiveColor] = useState<string>("");
    useEffect(() => {
        getDoneTodo();
    }, [pageNo]);

    const getDoneTodo = async () => {
        setLoading(true);

        const req: any = {
            status: TodoStatus["done"],
            keyword,
            pageNo,
        };

        if (activeCategory) {
            req["category"] = activeCategory;
        }
        if (activeColor) {
            req["color"] = activeColor;
        }

        const res = await getTodoList(req);
        if (res) {
            setDoneMap(formatArrayToTimeMap(res.data.list));
            setTotal(res.data.total);
            setLoading(false);
        } else {
            message.error("获取 todolist 失败");
        }
    };

    useEffect(() => {
        if (isRefreshDone) {
            getDoneTodo();
            setIsRefreshDone(false);
        }
    }, [isRefreshDone]);

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span>
                    {title}({total})
                </span>
                <span>
                    分类：
                    <Select
                        value={activeCategory}
                        onChange={(val) => setActiveCategory(val)}
                        style={{ width: 80 }}
                    >
                        <Select.Option key="所有" value="">
                            所有
                        </Select.Option>
                        {category.map((item) => (
                            <Select.Option
                                key={item.category}
                                value={item.category}
                            >
                                {item.category}
                            </Select.Option>
                        ))}
                    </Select>
                </span>
            </div>
            <Input
                className={styles.search}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => getDoneList()}
            />
            <div className={`${styles.listItemWrap} ScrollBar`}>
                {Object.keys(doneMap).map((time) => {
                    return (
                        <div className={styles.oneDay} key={time}>
                            <div
                                className={`${styles.time} ${
                                    time === today
                                        ? styles.today
                                        : time > today
                                        ? styles.future
                                        : ""
                                }`}
                            >
                                {time}&nbsp; ({getWeek(time)})
                            </div>
                            {
                                <ListItem
                                    list={doneMap[time]}
                                    title="已完成"
                                    getTodo={() => getDoneTodo()}
                                    handleEdit={handleEdit}
                                    handleCopy={handleCopy}
                                />
                            }
                        </div>
                    );
                })}
            </div>
            <Pagination
                className={styles.pagination}
                current={pageNo}
                total={total}
                onChange={(page) => setPageNo(page)}
                pageSize={15}
            />
        </div>
    );
};

export default DoneList;
