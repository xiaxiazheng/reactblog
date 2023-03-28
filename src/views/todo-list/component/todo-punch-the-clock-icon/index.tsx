import React, { useContext } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { TodoItemType } from "../../types";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../rematch";

const TodoPunchTheClockIcon = (props: { item: TodoItemType }) => {
    const { item } = props;

    const dispatch = useDispatch<Dispatch>();
    const { setShowPunchTheClockModal, setActiveTodo } = dispatch.edit;

    if (item.isTarget !== "1" || !item.timeRange) {
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
