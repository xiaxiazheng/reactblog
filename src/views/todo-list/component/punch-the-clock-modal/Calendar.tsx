import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Calendar } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";
import { TodoItemType } from "../../types";

// 计算时间相关
export const handleTimeRange = (timeRange: string) => {
    const [startTime, range] = JSON.parse(timeRange);
    return {
        startTime,
        endTime: moment(startTime)
            .add(Number(range - 1), "d")
            .format("YYYY-MM-DD"),
        range,
    };
};

interface IProps {
    active: TodoItemType | undefined;
}

const PunchTheClockCalendar: React.FC<IProps> = (props) => {
    const { active } = props;

    const childDateList = active?.child_todo_list?.map((item) => item.time) || [];

    const isThisMonth = (date: moment.Moment) => {
        return value?.get("M") === date.get("M");
    };

    const [value, setValue] = useState<any>(moment());

    return (
        <div className={styles.calendarWrapper}>
            <Calendar
                fullscreen={false}
                onChange={(val) => setValue(val)}
                disabledDate={(currentData) =>
                    active ?
                    (currentData.isBefore(handleTimeRange(active?.timeRange || '').startTime) ||
                        currentData.isAfter(handleTimeRange(active?.timeRange || '').endTime)) : false
                }
                dateFullCellRender={(date) => {
                    if (active) {
                        if (date.isAfter(handleTimeRange(active?.timeRange || '').startTime) && date.isBefore(moment())) {
                            const isDone = childDateList.includes(date.format("YYYY-MM-DD"));
                            const isToday = date.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD");
                            return (
                                <div
                                    className={`${styles.cell}
                                  ${!isThisMonth(date) && styles.notThisMonth} 
                                  ${isDone ? styles.green : isToday ? styles.blue : styles.red}`}
                                >
                                    {date.get("D")}
                                </div>
                            );
                        }
                        if (date.isBefore(handleTimeRange(active?.timeRange || '').endTime) && date.isAfter(moment())) {
                            return (
                                <div
                                    className={`${styles.cell} 
                                ${!isThisMonth(date) && styles.notThisMonth} ${styles.blueBorder}`}
                                >
                                    {date.get("D")}
                                </div>
                            );
                        }
                    }
                    return <div className={styles.cell}>{date.get("D")}</div>;
                }}
                headerRender={({ value, onChange }) => {
                    const year = value.year();
                    const month = value.month();
                    return (
                        <div style={{ padding: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div
                                    onClick={() => {
                                        const now = value.clone().month(month - 1);
                                        onChange(now);
                                    }}
                                >
                                    <LeftOutlined />
                                </div>
                                <div>
                                    {year}-{month + 1}
                                </div>
                                <div
                                    onClick={() => {
                                        const now = value.clone().month(month + 1);
                                        onChange(now);
                                    }}
                                >
                                    <RightOutlined />
                                </div>
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default PunchTheClockCalendar;
