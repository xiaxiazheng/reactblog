import { CalendarOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useState } from "react";
import { TodoItemType } from "@xiaxiazheng/blog-libs";

export enum SortKeyMap {
    todo,
    after,
    done,
    target,
    directory,
    bookmark,
    footprint,
    followUp,
}

export const handleSortByMTime = (list: TodoItemType[]) => {
    return [...list].sort(
        // sort 会改变原数组
        (a, b) =>
            (b?.mTime ? new Date(b.mTime).getTime() : 0) -
            (a?.mTime ? new Date(a.mTime).getTime() : 0)
    );
};

export const handleSortByColor = (list: TodoItemType[]) => {
    return [...list].sort((a, b) => Number(a.color) - Number(b.color));
}

export const useIsSortTime = (key?: string) => {
    const [isSortTime, setIsSortTime] = useState<boolean>(
        (key && localStorage.getItem(key) === "true") || false
    );

    const update = (val: boolean) => {
        setIsSortTime(val);
        key && localStorage.setItem(key, String(val));
    };

    return { isSortTime, setIsSortTime: update, handleSortTime: handleSortByMTime, handleSortByColor };
};

interface IProps {
    isSortTime: boolean;
    setIsSortTime: (val: boolean) => void;
}

const SortBtn: React.FC<IProps> = (props) => {
    const { isSortTime, setIsSortTime } = props;

    return (
        <Tooltip
            title={
                isSortTime
                    ? "当前按照更新时间倒序排序"
                    : "当前按照重要程度倒序排序"
            }
        >
            <Button
                onClick={() => setIsSortTime(!isSortTime)}
                type={!isSortTime ? "default" : "primary"}
                icon={<CalendarOutlined />}
            />
        </Tooltip>
    );
};

export default SortBtn;
