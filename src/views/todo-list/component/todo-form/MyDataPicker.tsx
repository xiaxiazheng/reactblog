import React, { useEffect, useRef } from "react";
import { DatePicker, Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { getWeek, getRangeFormToday } from "../../utils";
import styles from "./index.module.scss";
import dayjs from "dayjs";

const MyDatePicker = (props: any) => {
    const { value, onChange } = props;
    const range = getRangeFormToday(value);

    return (
        <>
            <Button onClick={() => onChange(value.subtract(1, "day"))}>
                <MinusOutlined />
            </Button>
            <DatePicker
                style={{ width: 130 }}
                value={value}
                onChange={onChange}
            />
            <Button onClick={() => onChange(value.add(1, "day"))}>
                <PlusOutlined />
            </Button>
            <span className={styles.week}>
                {getWeek(value)}，
                <span
                    className={
                        range.includes("今天")
                            ? styles.active
                            : range.includes("后")
                            ? styles.active2
                            : styles.active1
                    }
                >
                    {range}
                </span>
            </span>
            <span
                className={`${styles.today} ${
                    dayjs().subtract(1, "day").isSame(value, "d")
                        ? styles.active1
                        : ""
                }`}
                onClick={() => {
                    onChange(dayjs().subtract(1, "day"));
                }}
            >
                Yesterday
            </span>
            <span
                className={`${styles.today} ${
                    dayjs().isSame(value, "d") ? styles.active : ""
                }`}
                onClick={() => {
                    onChange(dayjs());
                }}
            >
                Today
            </span>
            <span
                className={`${styles.today} ${
                    dayjs().add(1, "day").isSame(value, "d")
                        ? styles.active2
                        : ""
                }`}
                onClick={() => {
                    onChange(dayjs().add(1, "day"));
                }}
            >
                Tomorrow
            </span>
        </>
    );
};

export default MyDatePicker;
