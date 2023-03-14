import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
// import { AddTodoItem, getTodoTarget } from "../../service";
import { Button, message, Modal, Space, Spin } from "antd";
import dayjs from "dayjs";
import PunchTheClockCalendar, { handleTimeRange } from "./Calendar";
import { CreateTodoItemReq, TodoItemType } from "../../types";
import { addTodoItem } from "@/client/TodoListHelper";

dayjs.locale("zh-cn");

// 判断今天是否已打卡
export const handleIsTodayPunchTheClock = (item: TodoItemType | undefined): boolean => {
    if (!item?.timeRange) return false;

    // 先判断今天是否在任务范围内
    const { startTime, endTime } = handleTimeRange(item.timeRange);

    const isHasToday = dayjs(startTime).isBefore(dayjs()) && dayjs(endTime).isAfter(dayjs());
    // 如果在再判断子任务中包不包含今天的打卡时间
    return (
        (isHasToday && item?.child_todo_list.map((item) => item.time).includes(dayjs().format("YYYY-MM-DD"))) || false
    );
};

interface IProps {
    activeTodo: TodoItemType | undefined;
    visible: boolean;
    onClose: Function;
    refreshData: Function;
}

const PunchTheClockModal: React.FC<IProps> = props => {
    const { activeTodo: active, visible, onClose, refreshData } = props;

    const punchTheClock = async (active: TodoItemType | undefined) => {
        if (active) {
            const val: CreateTodoItemReq = {
                category: active.category,
                color: active.color,
                description: active.description,
                name: `打卡：${active.name}`,
                isBookMark: "0",
                isNote: "0",
                isTarget: "0",
                other_id: active.todo_id,
                status: "1",
                doing: "0",
                time: dayjs().format("YYYY-MM-DD"),
            };
            await addTodoItem(val);
            message.success("打卡成功");
            refreshData("target");
            refreshData("done");
        }
    };

    const renderDetail = (item: TodoItemType | undefined) => {
        if (!item || !item.timeRange) return null;

        const { startTime, endTime, range, target } = handleTimeRange(item.timeRange);
        return (
            <>
                <div>
                    打卡周期：{startTime} ~ {endTime}，共 {range} 天
                </div>
                <div>
                    达标天数：{target}，
                    {item.child_todo_list_length < target
                        ? `还差 ${target - item.child_todo_list_length} 天`
                        : `已达成目标`}
                </div>
                <div>已打卡天数：{item.child_todo_list_length}</div>
                <div>
                    今日：
                    {handleIsTodayPunchTheClock(item) ? "已打卡" : "未打卡"}
                </div>
            </>
        );
    };

    return (
        <Modal
            title={active?.name}
            footer={
                <Space>
                    {/* <Button
                        onClick={() => {
                            setShowAdd(true);
                        }}
                    >
                        修改打卡计划
                    </Button> */}
                    {handleIsTodayPunchTheClock(active) ? (
                        <Button type="primary" style={{ background: "green" }}>
                            今日已打卡
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            onClick={() => punchTheClock(active)}
                        >
                            现在打卡
                        </Button>
                    )}
                </Space>
            }
            visible={visible}
            onCancel={() => onClose()}
        >
            <PunchTheClockCalendar active={active} />
            {active && renderDetail(active)}
        </Modal>
    );
};

export default PunchTheClockModal;