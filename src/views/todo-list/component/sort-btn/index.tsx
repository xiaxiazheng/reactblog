import { CalendarOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useState } from "react";

export enum SortKeyMap {
    todo,
    after,
    done,
    pool,
    target,
    bookmark,
    footprint,
}

export const useIsSortTime = (key?: string) => {
    const [isSortTime, setIsSortTime] = useState<boolean>((key && Boolean(localStorage.getItem(key))) || false);

    const update = (val: boolean) => {
        setIsSortTime(val);
        key && localStorage.setItem(key, String(val));
    }

    return {isSortTime, setIsSortTime: update};
}

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
