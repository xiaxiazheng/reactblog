import React, { useState, useEffect } from "react";
import { Input, Pagination, Select, message } from "antd";
import styles from "./index.module.scss";
import moment from "moment";
import Loading from "@/components/loading";
import ListItem from "../component/list-item";
import {
    getWeek,
    formatArrayToTimeMap,
    colorNameMap,
    colorList,
    colorMap,
} from "../utils";
import { debounce } from "lodash";
import { getTodoCategory, getTodoList } from "@/client/TodoListHelper";
import { TodoStatus } from "../types";

const { Search } = Input;

interface Props {
    title: "待办" | "已完成" | "待办池" | string;
    handleEdit: Function;
    handleCopy: Function;
    isRefreshDone: boolean;
    setIsRefreshDone: Function;
}

// 已完成列表
const DoneList: React.FC<Props> = (props) => {
    const { title, handleEdit, handleCopy, isRefreshDone, setIsRefreshDone } =
        props;

    const [doneMap, setDoneMap] = useState<any>({});

    const today = moment().format("YYYY-MM-DD");
    const getDoneList = debounce(() => getDoneTodo(), 200);

    // 根据颜色和类别筛选
    const [activeColor, setActiveColor] = useState<string>("");
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [category, setCategory] = useState<any[]>([]);
    const getCategory = async () => {
        const res = await getTodoCategory();
        setCategory(res.data);
    };
    useEffect(() => {
        getCategory();
    }, []);

    useEffect(() => {
        getDoneList();
    }, [activeCategory, activeColor]);

    const [loading, setLoading] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    useEffect(() => {
        getDoneTodo();
    }, [pageNo]);

    useEffect(() => {
        if (keyword === '') {
            getDoneList();
        }
    }, [keyword]);

    const getDoneTodo = debounce(async () => {
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
    }, 300);

    useEffect(() => {
        if (isRefreshDone) {
            getDoneList();
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
                    <span>
                        轻重：
                        <Select
                            value={activeColor}
                            onChange={(val) => setActiveColor(val)}
                            style={{ width: 80, marginRight: 10 }}
                        >
                            <Select.Option key="所有" value="">
                                所有
                            </Select.Option>
                            {colorList.map((item) => (
                                <Select.Option
                                    key={item}
                                    value={item}
                                    style={{ color: colorMap[item] }}
                                >
                                    {colorNameMap[item]}
                                </Select.Option>
                            ))}
                        </Select>
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
                            {category?.map((item) => (
                                <Select.Option
                                    key={item.category}
                                    value={item.category}
                                >
                                    {item.category}
                                </Select.Option>
                            ))}
                        </Select>
                    </span>
                </span>
            </div>
            <Search
                className={styles.search}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={() => getDoneList()}
                // onPressEnter={() => getDoneList()}
                enterButton
                allowClear={true}
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
