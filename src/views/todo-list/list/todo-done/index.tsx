import React, { useState, useEffect, useRef } from "react";
import { Pagination, Space, Tooltip } from "antd";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import Loading from "@/components/loading";
import { getWeek, formatArrayToTimeMap, getRangeFormToday } from "../../utils";
import SortBtn, { SortKeyMap, useIsSortTime } from "../../component/sort-btn";
import useScrollToHook from "@/hooks/useScrollToHooks";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import TodoDoneDataModal from "./todo-done-data-modal";
import { getToday } from "@/components/header-admin/utils";
import TodoTree from "../../component/todo-tree";

interface Props {
    title: any;
    sortKey: SortKeyMap;
}

// 已完成列表
const DoneList: React.FC<Props> = (props) => {
    const { title, sortKey } = props;

    const dispatch = useDispatch<Dispatch>();
    const { setPageNo, setPageSize } = dispatch.filter;
    const pageNo = useSelector((state: RootState) => state.filter.pageNo);
    const pageSize = useSelector((state: RootState) => state.filter.pageSize);
    const doneList = useSelector((state: RootState) => state.data.doneList);
    const doneTotal = useSelector((state: RootState) => state.data.doneTotal);
    const doneLoading = useSelector(
        (state: RootState) => state.data.doneLoading
    );
    const { setStartEndTime, setKeyword } = dispatch.filter;

    const [doneMap, setDoneMap] = useState<any>({});

    const Today = () => getToday().format("YYYY-MM-DD");

    const ref = useRef<any>(null);
    const { scrollToTop } = useScrollToHook(ref);

    useEffect(() => {
        setDoneMap(formatArrayToTimeMap(doneList));

        scrollToTop();
    }, [doneList]);

    const { isSortTime, setIsSortTime, handleSortTime } = useIsSortTime(
        `${sortKey}-sort-time`
    );

    const [open, setOpen] = useState<boolean>(false);

    const getList = (time: string): TodoItemType[] =>
        !isSortTime ? doneMap[time] : handleSortTime(doneMap[time]);

    return (
        <div className={styles.list}>
            {doneLoading && <Loading />}
            <div className={styles.header}>
                <div className={styles.header1}>
                    <span style={{ color: "#1890ffcc" }}>
                        {title}({doneTotal})
                    </span>
                    <Space>
                        <TodoDoneDataModal open={open} setOpen={setOpen} />
                        <SortBtn
                            isSortTime={isSortTime}
                            setIsSortTime={setIsSortTime}
                        />
                    </Space>
                </div>
            </div>
            <div className={`${styles.OneDayListWrap} ScrollBar`} ref={ref}>
                {Object.keys(doneMap).map((time) => {
                    return (
                        <div className={styles.oneDay} key={time}>
                            <div
                                className={`${styles.time} ${time === Today()
                                        ? styles.today
                                        : time > Today()
                                            ? styles.future
                                            : ""
                                    }`}
                            >
                                <Tooltip
                                    placement="right"
                                    title="点击只查看这一天的todo"
                                >
                                    <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            setKeyword("");
                                            setStartEndTime([
                                                dayjs(time),
                                                dayjs(time),
                                            ]);
                                        }}
                                    >
                                        {time}&nbsp; ({getWeek(time)}，
                                        {getRangeFormToday(time)})
                                        {doneMap[time]?.length > 6
                                            ? ` ${doneMap[time]?.length}`
                                            : null}
                                    </span>
                                </Tooltip>
                            </div>
                            <TodoTree todoList={getList(time)} />
                        </div>
                    );
                })}
            </div>
            <Pagination
                className={styles.pagination}
                current={pageNo}
                total={doneTotal}
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
