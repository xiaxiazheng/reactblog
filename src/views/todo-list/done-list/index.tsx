import React, { useState, useEffect } from "react";
import { Input, Pagination, Select, message } from "antd";
import styles from "./index.module.scss";
import moment from "moment";
import Loading from "@/components/loading";
import OneDayList from "../component/one-day-list";
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
import SortBtn from "../component/sort-btn";

const { Search } = Input;

interface Props {
    title: string;
    handleEdit: Function;
    isRefreshDone: boolean;
    setIsRefreshDone: Function;
    refreshData: Function;
}

// 已完成列表
const DoneList: React.FC<Props> = (props) => {
    const { title, handleEdit, isRefreshDone, setIsRefreshDone, refreshData } =
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
    const [pageSize, setPageSize] = useState<number>(15);
    const [total, setTotal] = useState<number>(0);
    useEffect(() => {
        getDoneTodo();
    }, [pageNo, pageSize]);

    const handleSearch = () => {
        if (pageNo === 1) {
            getDoneList();
        } else {
            setPageNo(1);
        }
    };

    useEffect(() => {
        if (keyword === "") {
            handleSearch();
        }
    }, [keyword]);

    const getDoneTodo = debounce(async () => {
        setLoading(true);

        const req: any = {
            status: TodoStatus["done"],
            keyword,
            pageNo,
            pageSize,
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
            handleSearch();
            setIsRefreshDone(false);
        }
    }, [isRefreshDone]);

    const [isSortTime, setIsSortTime] = useState<boolean>(false);

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span>
                    {title}({total})
                </span>
                <span>
                    <span style={{ marginRight: 10 }}>
                        <SortBtn
                            isSortTime={isSortTime}
                            setIsSortTime={setIsSortTime}
                        />
                    </span>
                    <Select
                        value={activeColor}
                        onChange={(val) => setActiveColor(val)}
                        style={{ width: 80, marginRight: 10 }}
                    >
                        <Select.Option key="轻重" value="">
                            轻重
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
                    <Select
                        value={activeCategory}
                        onChange={(val) => setActiveCategory(val)}
                        style={{ width: 80 }}
                    >
                        <Select.Option key="类别" value="">
                            类别
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
            </div>
            <Search
                className={styles.search}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={() => handleSearch()}
                enterButton
                allowClear={true}
            />
            <div className={`${styles.OneDayListWrap} ScrollBar`}>
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
                                {doneMap[time]?.length > 6
                                    ? ` ${doneMap[time]?.length}`
                                    : null}
                            </div>
                            <OneDayList
                                list={
                                    !isSortTime
                                        ? doneMap[time]
                                        : [...doneMap[time]].sort(
                                              // sort 会改变原数组
                                              (a, b) =>
                                                  (b?.mTime
                                                      ? new Date(
                                                            b.mTime
                                                        ).getTime()
                                                      : 0) -
                                                  (a?.mTime
                                                      ? new Date(
                                                            a.mTime
                                                        ).getTime()
                                                      : 0)
                                          )
                                }
                                getTodo={() => getDoneTodo()}
                                handleEdit={handleEdit}
                                refreshData={refreshData}
                            />
                        </div>
                    );
                })}
            </div>
            <Pagination
                className={styles.pagination}
                current={pageNo}
                total={total}
                onChange={(page, pageSize) => {
                    setPageNo(page);
                    pageSize && setPageSize(pageSize);
                }}
                pageSize={pageSize}
                pageSizeOptions={["15", "20", "30", "40", "50"]}
            />
        </div>
    );
};

export default DoneList;
