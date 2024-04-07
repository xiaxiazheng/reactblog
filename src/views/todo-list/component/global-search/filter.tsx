import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { Button, DatePicker, Radio, Space } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { colorTitle } from "../../utils";
import dayjs, { ManipulateType } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import TodoTypeIcon from "../todo-type-icon";
import SwitchComp from "../todo-form/switch";
import { SettingsContext } from "@/context/SettingsContext";

const Filter = () => {
    const { todoNameMap, todoColorMap, todoColorNameMap } =
        useContext(SettingsContext);

    const activeColor = useSelector(
        (state: RootState) => state.filter.activeColor
    );
    const startEndTime: Array<dayjs.Dayjs> = useSelector(
        (state: RootState) => state.filter.startEndTime
    );
    const isTarget = useSelector((state: RootState) => state.filter.isTarget);
    const isNote = useSelector((state: RootState) => state.filter.isNote);
    const isHabit = useSelector((state: RootState) => state.filter.isHabit);

    const dispatch = useDispatch<Dispatch>();

    const { setActiveColor, setStartEndTime, setIsNote, handleSpecialStatus } =
        dispatch.filter;

    const getTimeRange = (
        start: number,
        end: number,
        type: ManipulateType = "day"
    ) => {
        return [dayjs().subtract(start, type), dayjs().subtract(end, type)];
    };

    const timeRange: Record<string, dayjs.Dayjs[]> = {
        三天内: getTimeRange(0, 3),
        七天内: getTimeRange(0, 7),
        一月内: getTimeRange(0, 30),
        三月内: getTimeRange(0, 3, "month"),
        半年内: getTimeRange(0, 6, "month"),
        一年内: getTimeRange(0, 12, "month"),
        一年前: getTimeRange(1, 10, "year"),
    };

    const [timeType, setTimeType] = useState<"month" | "day" | "year">("day");

    const handleStarEndTime = (val: any) => {
        setStartEndTime(val);
    };

    const handleAddSubtractTime = (
        operate: "add" | "subtract",
        type: "start" | "end"
    ) => {
        let start = startEndTime[0];
        let end = startEndTime[1];
        if (type === "start") {
            start =
                operate === "add"
                    ? start.add(1, timeType)
                    : start.subtract(1, timeType);
        } else {
            end =
                operate === "add"
                    ? end.add(1, timeType)
                    : end.subtract(1, timeType);
        }

        setStartEndTime([start, end]);
    };

    const handleTimeTypeChange = (newVal: any) => {
        if (!startEndTime) {
            setTimeType(newVal);
            return;
        }
        const oldVal = timeType;
        let newStarEndTime = startEndTime;
        const start = startEndTime[0];
        const end = startEndTime[1];
        if (newVal === "year") {
            newStarEndTime = [start.startOf("year"), end.endOf("year")];
        }
        if (newVal === "month") {
            if (oldVal === "day") {
                newStarEndTime = [start.startOf("month"), end.endOf("month")];
            }
            if (oldVal === "year") {
                newStarEndTime = [start.startOf("year"), end.endOf("year")];
            }
        }
        if (newVal === "day") {
            if (oldVal === "month") {
                newStarEndTime = [start.startOf("month"), end.endOf("month")];
            }

            if (oldVal === "year") {
                newStarEndTime = [start.startOf("year"), end.endOf("year")];
            }
        }
        setStartEndTime(newStarEndTime);
        setTimeType(newVal);
    };

    return (
        <div className={styles.filterWrapper}>
            <div>
                <span>{colorTitle}：</span>
                <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    value={activeColor}
                >
                    {Object.keys(todoColorMap).map((item) => (
                        <Radio.Button
                            key={item}
                            value={item}
                            onClick={() =>
                                setActiveColor(activeColor === item ? "" : item)
                            }
                            style={{ color: todoColorMap[item] }}
                            className={`${styles.color} ${
                                item === "0" ? styles.zero : ""
                            }${item === "1" ? styles.one : ""}${
                                item === "2" ? styles.two : ""
                            }${item === "3" ? styles.three : ""}${
                                item === "4" ? styles.four : ""
                            }${item === "-1" ? styles.minusOne : ""}`}
                        >
                            {todoColorNameMap[item]}
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </div>
            <div>
                <div>
                    <span>时间：</span>
                    {startEndTime?.[0] && (
                        <>
                            <Button
                                icon={<MinusOutlined />}
                                onClick={() =>
                                    handleAddSubtractTime("subtract", "start")
                                }
                            />
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() =>
                                    handleAddSubtractTime("add", "start")
                                }
                            />
                        </>
                    )}
                    {timeType === "day" && (
                        <DatePicker.RangePicker
                            style={{ width: 250 }}
                            value={startEndTime as any}
                            onChange={(val) => handleStarEndTime(val)}
                            placeholder={["开始时间", "结束时间"]}
                            ranges={{
                                Today: [dayjs(), dayjs()],
                                这周至今: [dayjs().startOf("week"), dayjs()],
                                一周内: [dayjs().subtract(1, "week"), dayjs()],
                                这月至今: [dayjs().startOf("month"), dayjs()],
                                今年至今: [dayjs().startOf("year"), dayjs()],
                            }}
                        />
                    )}
                    {timeType === "month" && (
                        <DatePicker.RangePicker
                            style={{ width: 200 }}
                            picker="month"
                            value={startEndTime as any}
                            onChange={(val) => handleStarEndTime(val)}
                            placeholder={["开始时间", "结束时间"]}
                            ranges={{
                                这个月: [
                                    dayjs().startOf("month"),
                                    dayjs().endOf("month"),
                                ],
                                上个月: [
                                    dayjs()
                                        .startOf("month")
                                        .subtract(1, "month"),
                                    dayjs().endOf("month").subtract(1, "month"),
                                ],
                                上上个月: [
                                    dayjs()
                                        .startOf("month")
                                        .subtract(2, "month"),
                                    dayjs().endOf("month").subtract(2, "month"),
                                ],
                            }}
                        />
                    )}
                    {timeType === "year" && (
                        <DatePicker.RangePicker
                            style={{ width: 200 }}
                            picker="year"
                            value={startEndTime as any}
                            onChange={(val) => handleStarEndTime(val)}
                            placeholder={["开始时间", "结束时间"]}
                            ranges={{
                                今年: [
                                    dayjs().startOf("year"),
                                    dayjs().endOf("year"),
                                ],
                                去年: [
                                    dayjs().startOf("year").subtract(1, "y"),
                                    dayjs().endOf("year").subtract(1, "y"),
                                ],
                                前年: [
                                    dayjs().startOf("year").subtract(2, "y"),
                                    dayjs().endOf("year").subtract(2, "y"),
                                ],
                            }}
                        />
                    )}
                    {startEndTime?.[1] && (
                        <>
                            <Button
                                icon={<MinusOutlined />}
                                onClick={() => {
                                    handleAddSubtractTime("subtract", "end");
                                }}
                            />
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    handleAddSubtractTime("add", "end");
                                }}
                            />
                        </>
                    )}
                </div>
                <Space style={{ marginTop: 8, paddingLeft: 42 }}>
                    <Radio.Group
                        value={timeType}
                        onChange={(val) => {
                            handleTimeTypeChange(val.target.value);
                        }}
                    >
                        <Radio.Button value={"year"}>年</Radio.Button>
                        <Radio.Button value={"month"}>月</Radio.Button>
                        <Radio.Button value={"day"}>日</Radio.Button>
                    </Radio.Group>
                    <span>今天是 {dayjs().format("YYYY-MM-DD")}</span>
                </Space>
            </div>

            <div>
                <span>特殊状态：</span>
                <Space className={styles.special} size={[8, 0]}>
                    <SwitchComp
                        value={isTarget}
                        onChange={(val) =>
                            handleSpecialStatus({
                                type: "isTarget",
                                status: val,
                            })
                        }
                    >
                        <span>
                            <TodoTypeIcon
                                type="target"
                                style={{ color: "#ffeb3b" }}
                            />{" "}
                            {todoNameMap.target}
                        </span>
                    </SwitchComp>
                    <SwitchComp value={isNote} onChange={setIsNote}>
                        <span>
                            <TodoTypeIcon
                                type="note"
                                style={{
                                    marginRight: 5,
                                    color: "#ffeb3b",
                                }}
                            />{" "}
                            {todoNameMap.note}
                        </span>
                    </SwitchComp>
                    <SwitchComp
                        value={isHabit}
                        onChange={(val) =>
                            handleSpecialStatus({
                                type: "isHabit",
                                status: val,
                            })
                        }
                    >
                        <span>
                            <TodoTypeIcon
                                type="habit"
                                style={{
                                    marginRight: 5,
                                    color: "#ffeb3b",
                                }}
                            />{" "}
                            {todoNameMap.habit}
                        </span>
                    </SwitchComp>
                </Space>
            </div>
        </div>
    );
};

export default Filter;
