import React, { useContext } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { TodoItemType } from "../../types";
import { TodoEditContext } from "../../TodoEditContext";

const TodoPunchTheClockIcon = (props: { item: TodoItemType }) => {
    const { item } = props;

    const { setActiveTodo, setShowPunchTheClockModal } =
        useContext(TodoEditContext);

    if (item.isTarget !== '1' || !item.timeRange) {
        return null;
    }

    return (
        <Tooltip title={"打卡"}>
            <ClockCircleOutlined
                className={styles.progressIcon}
                style={{
                    color: "#40a9ff",
                }}
                title="查看 打卡情况 链"
                onClick={() => {
                    setActiveTodo(item);
                    setShowPunchTheClockModal(true);
                }}
            />
        </Tooltip>
    );
};

export default TodoPunchTheClockIcon;
