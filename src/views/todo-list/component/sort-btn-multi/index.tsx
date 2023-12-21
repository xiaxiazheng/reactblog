import { CalendarOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useState } from "react";
import { TodoItemType } from "../../types";

export enum SortKeyMap {
    todo,
    after,
    done,
    pool,
    target,
    habit,
    bookmark,
    footprint,
    followUp,
}

const handleSortByMTime = (list: TodoItemType[]) => {
    return [...list].sort(
        // sort 会改变原数组
        (a, b) =>
            (b?.mTime ? new Date(b.mTime).getTime() : 0) -
            (a?.mTime ? new Date(a.mTime).getTime() : 0)
    );
};

const handleSortByTime = (list: TodoItemType[]) => {
    return [...list].sort(
        // sort 会改变原数组
        (a, b) =>
            (b?.time ? new Date(b.time).getTime() : 0) -
            (a?.time ? new Date(a.time).getTime() : 0)
    );
};

export const useIsSortByMulti = (key?: string) => {
    const [isSortBy, setIsSortBy] = useState<IsSortByType>(
        (key && (localStorage.getItem(key) as IsSortByType)) || "3"
    );

    const update = (val: IsSortByType) => {
        setIsSortBy(val);
        key && localStorage.setItem(key, String(val));
    };

    const handleSort = (list: TodoItemType[]) => {
        if (isSortBy === "1") {
            return handleSortByMTime(list);
        }
        if (isSortBy === "3") {
            return handleSortByTime(list);
        }
        return list;
    };

    const handleShowTime = (item: TodoItemType) => {
        if (isSortBy === "1") {
            return item.mTime;
        }
        if (isSortBy === "3") {
            return item.time;
        }
        return item.cTime;
    };

    return { isSortBy, setIsSortBy: update, handleSort, handleShowTime };
};

type IsSortByType = "1" | "2" | "3";

interface IProps {
    isSortBy: IsSortByType;
    setIsSortBy: (val: IsSortByType) => void;
}

const isSortByMap = {
    1: "当前按照更新时间倒序排序",
    2: "当前按照重要程度倒序排序",
    3: "当前按照默认时间倒序排序",
};

const SortBtnMulti: React.FC<IProps> = (props) => {
    const { isSortBy, setIsSortBy } = props;

    return (
        <Tooltip title={isSortByMap[isSortBy]}>
            <Button
                onClick={() =>
                    setIsSortBy(
                        ["1", "2", "3"].includes(isSortBy)
                            ? isSortBy === "3"
                                ? "1"
                                : (`${Number(isSortBy) + 1}` as IsSortByType)
                            : "3"
                    )
                }
                type={isSortBy === "3" ? "default" : "primary"}
                icon={<CalendarOutlined />}
            />
        </Tooltip>
    );
};

export default SortBtnMulti;
