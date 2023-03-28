import React, { useState, useEffect, useRef } from "react";
import { Pagination } from "antd";
import styles from "./index.module.scss";
import moment from "moment";
import Loading from "@/components/loading";
import OneDayList from "../../component/one-day-list";
import { getWeek, formatArrayToTimeMap } from "../../utils";
import SortBtn, { SortKeyMap, useIsSortTime } from "../../component/sort-btn";
import useScrollToHook from "@/hooks/useScrollToHooks";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";

interface Props {
    title: string;
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

    const [doneMap, setDoneMap] = useState<any>({});

    const today = moment().format("YYYY-MM-DD");

    const ref = useRef<any>(null);
    const { scrollToTop } = useScrollToHook(ref);

    useEffect(() => {
        setDoneMap(formatArrayToTimeMap(doneList));

        scrollToTop();
    }, [doneList]);

    const { isSortTime, setIsSortTime } = useIsSortTime(`${sortKey}-sort-time`);

    return (
        <div className={styles.list}>
            {doneLoading && <Loading />}
            <div className={styles.header}>
                <div className={styles.header1}>
                    <span>
                        {title}({doneTotal})
                    </span>
                    <SortBtn
                        isSortTime={isSortTime}
                        setIsSortTime={setIsSortTime}
                    />
                </div>
            </div>
            <div className={`${styles.OneDayListWrap} ScrollBar`} ref={ref}>
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
