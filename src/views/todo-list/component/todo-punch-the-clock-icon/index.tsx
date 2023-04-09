import React, { useContext } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { TodoItemType } from "../../types";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../rematch";
import { handleIsTodayPunchTheClock } from "../punch-the-clock-modal";

const TodoPunchTheClockIcon = (props: { item: TodoItemType }) => {
    const { item } = props;

    const dispatch = useDispatch<Dispatch>();
    const { setShowPunchTheClockModal, setActiveTodo } = dispatch.edit;

    if (item.isTarget !== "1" || !item.timeRange) {
        return null;
    }

    const isTodayDone = handleIsTodayPunchTheClock(item);

    return (
        <Tooltip title={`打卡，今日${isTodayDone ? "已完成" : "未完成"}`}>
            <ClockCircleOutlined
                className={styles.progressIcon}
                style={{
                    color: isTodayDone ? "#52d19c" : "#f5222d",
                }}
                title="查看打卡情况"
                onClick={() => {
                    setActiveTodo(item);
                    setShowPunchTheClockModal(true);
                }}
            />
        </Tooltip>
    );
};

export default TodoPunchTheClockIcon;
