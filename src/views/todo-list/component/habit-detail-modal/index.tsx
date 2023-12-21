import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, message, Modal, Space, Spin } from "antd";
import dayjs from "dayjs";
import PunchTheClockCalendar from "./Calendar";
import { CreateTodoItemReq, TodoItemType } from "../../types";
import { addTodoItem } from "@/client/TodoListHelper";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import { getRangeFormToday } from "../../utils";

dayjs.locale("zh-cn");

// 判断今天是否已打卡
export const handleIsTodayPunchTheClock = (
    item: TodoItemType | undefined
): boolean => {
    if (!item || item.isHabit !== '1') return false;

    return (
        item?.child_todo_list
            ?.map((item) => item.time)
            .includes(dayjs().format("YYYY-MM-DD")) || false
    );
};

export const getToday = () => {
    return getZeroDay(dayjs().format('YYYY-MM-DD'));
}

export const getZeroDay = (date: string) => {
    return dayjs(`${date} 00:00:00`);
}

interface IProps {}

const PunchTheClockModal: React.FC<IProps> = (props) => {
    const onClose = () => {
        setActiveTodo(undefined);
        setShowPunchTheClockModal(false);
    };

    const active = useSelector(
        (state: RootState) => state.edit.activeTodo
    ) as TodoItemType;
    const visible = useSelector(
        (state: RootState) => state.edit.showPunchTheClockModal
    );
    const habitListOrigin = useSelector(
        (state: RootState) => state.data.habitListOrigin
    );
    const dispatch = useDispatch<Dispatch>();
    const { setShowPunchTheClockModal, setActiveTodo } = dispatch.edit;
    const { refreshData } = dispatch.data;

    // // 不直接用 activeTodo，而是从 targetListOrigin 里拿，这样就能在 targetListOrigin 刷新之后获取到最新的状态
    // const active = targetListOrigin.find(
    //     (item) => item.todo_id === activeTodo?.todo_id
    // );
    // 也可以监听变化，然后把最新的同步回 activeTodo
    useEffect(() => {
        visible &&
            setActiveTodo(
                habitListOrigin.find(
                    (item) => item.todo_id === active?.todo_id
                )
            );
    }, [habitListOrigin, visible]);

    const punchTheClock = async (active: TodoItemType | undefined) => {
        if (active) {
            const val: CreateTodoItemReq = {
                category: active.category,
                color: active.color !== '3' ? `${Number(active.color) + 1}` : '3',
                description: active.description,
                name: `打卡：${active.name}`,
                isBookMark: "0",
                isNote: "0",
                isTarget: "0",
                other_id: active.todo_id,
                status: "1",
                doing: "0",
                isWork: "0",
                time: dayjs().format("YYYY-MM-DD"),
                isHabit: "0",
                isKeyNode: "0",
                isFollowUp: "0",
            };
            await addTodoItem(val);
            message.success("打卡成功");
            refreshData("done");
            refreshData("habit");
        }
    };

    const renderHabitDetail = (item: TodoItemType | undefined) => {
        if (!item || !item.isHabit) return null;

        const untilNow = getToday().diff(getZeroDay(item.time), "d") + 1;
        const lastDoneTodo = item.child_todo_list?.[0];
        const lastDoneDay = lastDoneTodo?.time;
        return (
            <>
                <div>
                    今日
                    {handleIsTodayPunchTheClock(item) ? "已打卡" : "未打卡"}
                </div>
                <div>习惯的描述：{item?.description || '暂无'}</div>
                <div>
                    习惯立项日期：{item.time} {getRangeFormToday(item.time)}
                </div>
                <div>
                    已打卡天数：{item.child_todo_list_length} / {untilNow}
                </div>
                <div>最后一次打卡时间：{lastDoneDay ? `${lastDoneDay} ${getRangeFormToday(lastDoneDay)}` : "暂无"}</div>
                <div>最后一次打卡的描述：{lastDoneTodo?.description || "暂无"}</div>
            </>
        );
    };
    return (
        <Modal
            title={active?.name}
            // className={"darkTheme"}
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
            open={visible}
            onCancel={() => onClose()}
        >
            <PunchTheClockCalendar active={active} />
            {active && renderHabitDetail(active)}
        </Modal>
    );
};

export default PunchTheClockModal;
