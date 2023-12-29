import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { Button, DatePicker, Radio, Space } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { colorList, colorMap, colorNameMap, colorTitle } from "../../utils";
import dayjs, { ManipulateType } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import TodoTypeIcon from "../todo-type-icon";
import SwitchComp from "../todo-form/switch";
import { SettingsContext } from "@/context/SettingsContext";

const Filter = () => {
    const { todoNameMap } = useContext(SettingsContext);

    const activeColor = useSelector(
        (state: RootState) => state.filter.activeColor
    );
    const startEndTime = useSelector(
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

    return (
        <div className={styles.filterWrapper}>
            <div>
                <span>{colorTitle}：</span>
                <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    value={activeColor}
                >
                    {colorList.map((item) => (
                        <Radio.Button
                            key={item}
                            value={item}
                            onClick={() =>
                                setActiveColor(activeColor === item ? "" : item)
                            }
                            style={{ color: colorMap[item] }}
                            className={`${styles.color} ${
                                item === "0" ? styles.zero : ""
                            }${item === "1" ? styles.one : ""}${
                                item === "2" ? styles.two : ""
                            }${item === "3" ? styles.three : ""}${
                                item === "-1" ? styles.minusOne : ""
                            }`}
                        >
                            {colorNameMap[item]}
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </div>
            <div>
                <span>时间：</span>
                {startEndTime?.[0] && (
                    <>
                        <Button
                            icon={<MinusOutlined />}
                            onClick={() =>
                                setStartEndTime([
                                    dayjs(startEndTime?.[0]).subtract(1, "d"),
                                    startEndTime?.[1],
                                ])
                            }
                        />
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() =>
                                setStartEndTime([
                                    dayjs(startEndTime?.[0]).add(1, "d"),
                                    startEndTime?.[1],
                                ])
                            }
                        />
                    </>
                )}
                <DatePicker.RangePicker
                    value={startEndTime}
                    onChange={(val) => setStartEndTime(val)}
                    placeholder={["开始时间", "结束时间"]}
                />
                {startEndTime?.[1] && (
                    <>
                        <Button
                            icon={<MinusOutlined />}
                            onClick={() =>
                                setStartEndTime([
                                    startEndTime?.[0],
                                    dayjs(startEndTime?.[1]).subtract(1, "d"),
                                ])
                            }
                        />
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() =>
                                setStartEndTime([
                                    startEndTime?.[0],
                                    dayjs(startEndTime?.[1]).add(1, "d"),
                                ])
                            }
                        />
                    </>
                )}

                {Object.keys(timeRange).map((item) => (
                    <Button
                        type="text"
                        key={item}
                        className={styles.btn}
                        onClick={() =>
                            setStartEndTime(timeRange[item].reverse())
                        }
                    >
                        {item}
                    </Button>
                ))}
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
                                type: "isTarget",
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
