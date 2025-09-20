import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Calendar } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { TodoItemType } from "@xiaxiazheng/blog-libs";

interface IProps {
    todoList: TodoItemType[] | undefined; // 需要在日历上标记的项目的 todo 列表
    startTime: string; // 日历展示数据的起始时间
}

const TodoCalendar: React.FC<IProps> = (props) => {
    const { todoList, startTime: strStartTime } = props;

    const childDateList = todoList?.map((item) => item.time) || [];

    const isThisMonth = (date: dayjs.Dayjs) => {
        return value?.get("M") === date.get("M");
    };

    const [value, setValue] = useState<any>(dayjs());

    const startTime = dayjs(strStartTime),
        endTime = dayjs();

    return (
        <div className={styles.calendarWrapper}>
            <Calendar
                fullscreen={false}
                onChange={(val) => setValue(val)}
                disabledDate={(currentData) =>
                    currentData.isBefore(startTime) ||
                    currentData.isAfter(endTime)
                }
                dateFullCellRender={(date) => {
                    if (date.isAfter(startTime) && date.isBefore(dayjs())) {
                        const isDone = childDateList.includes(
                            date.format("YYYY-MM-DD")
                        );
                        const isToday =
                            date.format("YYYY-MM-DD") ===
                            dayjs().format("YYYY-MM-DD");
                        return (
                            <div
                                className={`${styles.cell}
                                    ${
                                        !isThisMonth(date) &&
                                        styles.notThisMonth
                                    } 
                                    ${
                                        isDone
                                            ? styles.green
                                            : isToday
                                            ? styles.blue
                                            : styles.red
                                    }`}
                            >
                                {date.get("D")}
                            </div>
                        );
                    }
                    if (date.isBefore(endTime) && date.isAfter(dayjs())) {
                        return (
                            <div
                                className={`${styles.cell} 
                                ${!isThisMonth(date) && styles.notThisMonth} ${
                                    styles.blueBorder
                                }`}
                            >
                                {date.get("D")}
                            </div>
                        );
                    }
                    return <div className={styles.cell}>{date.get("D")}</div>;
                }}
                headerRender={({ value, onChange }) => {
                    const year = value.year();
                    const month = value.month();
                    return (
                        <div style={{ padding: 8 }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div
                                    onClick={() => {
                                        const now = value
                                            .clone()
                                            .month(month - 1);
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
                                        const now = value
                                            .clone()
                                            .month(month + 1);
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

export default TodoCalendar;
