import React, { useState, useEffect, useContext } from "react";
import {
    Input,
    Pagination,
    Select,
    message,
    Button,
    DatePicker,
    Tooltip,
    Space,
} from "antd";
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
import SortBtn, { SortKeyMap, useIsSortTime } from "../component/sort-btn";
import { ClearOutlined } from "@ant-design/icons";
import { TodoDataContext } from "../TodoDataContext";

const { Search } = Input;
const { RangePicker } = DatePicker;

interface Props {
    title: string;
    sortKey: SortKeyMap;
}

// 已完成列表
const DoneList: React.FC<Props> = (props) => {
    const { title, sortKey } = props;

    const { isRefreshDone, setIsRefreshDone, refreshData } =
        useContext(TodoDataContext);

    const [doneMap, setDoneMap] = useState<any>({});

    const today = moment().format("YYYY-MM-DD");
    const getDoneListDebounce = debounce(() => getDoneTodo(), 300);

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
        if (isRefreshDone) {
            getDoneTodo();
            setIsRefreshDone(false);
        }
    }, [isRefreshDone]);

    const [startEndTime, setStartEndTime] = useState<any>();

    const [loading, setLoading] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>();
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(
        Number(localStorage.getItem("todoDonePageSize")) || 15
    );
    const [total, setTotal] = useState<number>(0);
    useEffect(() => {
        getDoneTodo();
    }, [pageNo, pageSize, startEndTime, activeCategory, activeColor]);

    const handleSearch = () => {
        if (pageNo === 1) {
            getDoneListDebounce();
        } else {
            setPageNo(1);
        }
    };

    useEffect(() => {
        if (keyword === "") {
            getDoneListDebounce();
        }
    }, [keyword]);

    const getDoneTodo = async () => {
        setLoading(true);

        const req: any = {
            status: TodoStatus["done"],
            keyword: keyword?.replace(" ", "%"),
            pageNo,
            pageSize,
            startTime: startEndTime?.[0]?.format("YYYY-MM-DD"),
            endTime: startEndTime?.[1]?.format("YYYY-MM-DD"),
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

    const { isSortTime, setIsSortTime } = useIsSortTime(`${sortKey}-sort-time`);
    const [showFilter, setShowFilter] = useState<boolean>(false);

    const Filter = () => {
        return (
            <div className={styles.filterWrapper}>
                <div>
                    <span>轻重：</span>
                    <Select
                        value={activeColor}
                        onChange={(val) => setActiveColor(val)}
                        allowClear
                        style={{ width: 120 }}
                    >
                        <Select.Option key="所有" value="">
                            所有
                        </Select.Option>
                        {colorList.map((item) => (
                            <Select.Option
                                key={item}
                                value={item}
                                style={{
                                    color: colorMap[item],
                                }}
                            >
                                {colorNameMap[item]}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <span>类别：</span>
                    <Select
                        value={activeCategory}
                        onChange={(val) => setActiveCategory(val)}
                        allowClear
                        style={{ width: 120 }}
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
                </div>
                <div>
                    <span>时间：</span>
                    <RangePicker
                        value={startEndTime}
                        onChange={(val) => setStartEndTime(val)}
                        placeholder={["开始时间", "结束时间"]}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <div className={styles.header1}>
                    <span>
                        {title}({total})
                    </span>
                    <Space>
                        {/* 清理筛选项 */}
                        {(activeColor !== "" ||
                            activeCategory !== "" ||
                            keyword !== "" ||
                            !!startEndTime ||
                            pageNo !== 1 ||
                            showFilter) && (
                            <Button
                                icon={<ClearOutlined />}
                                type="primary"
                                danger
                                onClick={() => {
                                    setActiveCategory("");
                                    setActiveColor("");
                                    setKeyword("");
                                    setStartEndTime(null);
                                    setPageNo(1);
                                    setShowFilter(false);
                                }}
                            />
                        )}
                        <Button
                            type={showFilter ? "primary" : "default"}
                            onClick={() => setShowFilter((prev) => !prev)}
                        >
                            筛选
                        </Button>
                        <SortBtn
                            isSortTime={isSortTime}
                            setIsSortTime={setIsSortTime}
                        />
                    </Space>
                </div>
                {showFilter && <Filter />}
            </div>
            <Search
                className={styles.search}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={() => handleSearch()}
                enterButton
                allowClear={true}
                placeholder="可用空格分词实现一定模糊搜索"
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
                    if (pageSize) {
                        setPageSize(pageSize);
                        localStorage.setItem(
                            "todoDonePageSize",
                            String(pageSize)
                        );
                    }
                }}
                pageSize={pageSize}
                pageSizeOptions={["15", "20", "25", "50"]}
            />
        </div>
    );
};

export default DoneList;
