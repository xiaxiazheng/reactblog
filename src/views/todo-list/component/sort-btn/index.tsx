import { CalendarOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React from "react";

interface IProps {
    isSortTime: boolean;
    setIsSortTime: React.Dispatch<React.SetStateAction<boolean>>;
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
                onClick={() => setIsSortTime((prev) => !prev)}
                type={!isSortTime ? "default" : "primary"}
                icon={<CalendarOutlined />}
            />
        </Tooltip>
    );
};

export default SortBtn;
