import React, { useEffect } from "react";
import { Input, Pagination } from "antd";
import styles from "./index.module.scss";
import moment from "moment";
import Loading from "@/components/loading";
import ListItem from "../component/list-item";
import { getWeek } from "../utils";
import { debounce } from "lodash";

interface Props {
    loading: boolean;
    title: "待办" | "已完成" | "待办池" | string;
    mapList: any;
    getTodo: Function;
    handleAdd: Function;
    handleEdit: Function;
    pageNo: number;
    setPageNo: Function;
    keyword: string;
    setKeyword: Function;
    total: number;
    handleCopy: Function;
}

// 已完成列表
const DoneList: React.FC<Props> = (props) => {
    const {
        loading,
        title,
        mapList,
        getTodo,
        handleEdit,
        pageNo,
        setPageNo,
        keyword,
        setKeyword,
        total,
        handleCopy
    } = props;

    const today = moment().format("YYYY-MM-DD");
    const getDoneList = debounce(() => getTodo("done"), 200);

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span>{title}({total})</span>
            </div>
            <Input
                className={styles.search}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => getDoneList()}
            />
            <div className={`${styles.listItemWrap} ScrollBar`}>
                {Object.keys(mapList).map((time) => {
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
                                    list={mapList[time]}
                                    title="已完成"
                                    getTodo={getTodo}
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
