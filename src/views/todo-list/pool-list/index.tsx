import React, { useState } from "react";
import { Button, Input, Radio, Space, Tooltip } from "antd";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import OneDayList from "../component/one-day-list";
import { StatusType, TodoItemType } from "../types";
import { CalendarOutlined } from "@ant-design/icons";
import SortBtn, { SortKeyMap, useIsSortTime } from "../component/sort-btn";

interface Props {
    loading: boolean;
    title: string;
    sortKey: SortKeyMap;
    mapList: TodoItemType[];
    // getTodo: (type: StatusType) => void;
    // handleEdit: Function;
    // refreshData: Function;
    showDoneIcon?: boolean;
    showSearch?: boolean;
    btn?: any;
}

// 待办池
const PoolList: React.FC<Props> = (props) => {
    const {
        loading,
        title,
        mapList,
        showSearch = true,
        showDoneIcon = false,
        sortKey,
    } = props;

    const { isSortTime, setIsSortTime } = useIsSortTime(`${sortKey}-sort-time`);

    // 获取展示的 list
    const getShowList = (list: TodoItemType[]) => {
        const l = !isSortTime
            ? list
            : [...list].sort(
                  // sort 会改变原数组
                  (a, b) =>
                      (b?.mTime ? new Date(b.mTime).getTime() : 0) -
                      (a?.mTime ? new Date(a.mTime).getTime() : 0)
              );

        // doing === '1' 的放前面，所以依然是正在处理的事情优先级最高
        return l
            .filter((item) => item.doing === "1")
            .concat(l.filter((item) => item.doing !== "1"));
    };

    const [keyword, setKeyword] = useState<string>();

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span>
                    {title}({mapList.length})
                </span>
                <Space size={16}>
                    {showSearch && (
                        <Input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            allowClear
                        />
                    )}
                    {props.btn}
                    <SortBtn
                        isSortTime={isSortTime}
                        setIsSortTime={setIsSortTime}
                    />
                </Space>
            </div>
            <div className={`${styles.OneDayListWrap} ScrollBar`}>
                <div className={styles.oneDay}>
                    <OneDayList
                        list={getShowList(mapList).filter(
                            (item) =>
                                !keyword ||
                                item.name.indexOf(keyword) !== -1 ||
                                item.description.indexOf(keyword) !== -1
                        )}
                        showDoneIcon={showDoneIcon}
                    />
                </div>
            </div>
        </div>
    );
};

export default PoolList;
