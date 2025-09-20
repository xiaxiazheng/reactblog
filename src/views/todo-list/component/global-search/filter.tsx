import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { Button, Checkbox, DatePicker, Radio, Space } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons"
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import { TodoTypeIcon } from "@xiaxiazheng/blog-libs";
import SwitchComp from "../todo-form/switch";
import { SettingsContext } from "@/context/SettingsContext";
import { UserContext } from "@/context/UserContext";

interface IProps {
    isSimple: boolean;
}

const Filter: React.FC<IProps> = (props) => {
    const { todoNameMap } = useContext(SettingsContext);
    const category = useSelector((state: RootState) => state.data.category);
    const activeCategory = useSelector(
        (state: RootState) => state.filter.activeCategory
    );
    const startEndTime: Array<dayjs.Dayjs> = useSelector(
        (state: RootState) => state.filter.startEndTime
    );
    const isTarget = useSelector((state: RootState) => state.filter.isTarget);
    const isNote = useSelector((state: RootState) => state.filter.isNote);
    const isHabit = useSelector((state: RootState) => state.filter.isHabit);
    const isKeyNode = useSelector((state: RootState) => state.filter.isKeyNode);

    const { username } = useContext(UserContext);
    const isMe = username === "zyb";

    const dispatch = useDispatch<Dispatch>();

    const {
        setActiveCategory,
        setStartEndTime,
        setIsNote,
        setIsTarget,
        setIsHabit,
        setIsKeyNode,
    } = dispatch.filter;

    const [timeType, setTimeType] = useState<"month" | "day" | "year">("day");

    const handleStarEndTime = (val: any) => {
        console.log("timeType", timeType);
        if (timeType === "year") {
            setStartEndTime([val[0].startOf("year"), val[1].endOf("year")]);
        } else if (timeType === "month") {
            setStartEndTime([val[0].startOf("month"), val[1].endOf("month")]);
        } else {
            setStartEndTime(val);
        }
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
        <>
            {props.isSimple && (
                <Space>
                    {activeCategory?.map((item) => (
                        <Button
                            key={item}
                            size="small"
                            onClick={() =>
                                setActiveCategory(
                                    activeCategory.filter((i) => i !== item)
                                )
                            }
                        >
                            {item}
                        </Button>
                    ))}
                    {/* {activeColor?.map((item) => (
                        <Button
                            key={item}
                            size="small"
                            onClick={() =>
                                setActiveColor(
                                    activeColor.filter((i) => i !== item)
                                )
                            }
                        >
                            <span style={{ color: todoColorMap[item] }}>
                                {todoColorNameMap[item]}
                            </span>
                        </Button>
                    ))} */}
                </Space>
            )}

            {!props.isSimple && (
                <div className={styles.filterWrapper}>
                    <div>
                        <span>类别筛选：</span>
                        <Checkbox.Group value={activeCategory}>
                            <Space wrap>
                                {category?.map((item) => {
                                    return (
                                        <Checkbox
                                            key={item.category}
                                            value={item.category}
                                            style={{ color: "white" }}
                                            onClick={() => {
                                                console.log(
                                                    "activeCategory",
                                                    activeCategory
                                                );
                                                setActiveCategory(
                                                    activeCategory.includes(
                                                        item.category
                                                    )
                                                        ? activeCategory.filter(
                                                              (i) =>
                                                                  i !==
                                                                  item.category
                                                          )
                                                        : activeCategory.concat(
                                                              item.category
                                                          )
                                                );
                                            }}
                                        >
                                            {item.category} ({item.count})
                                        </Checkbox>
                                    );
                                })}
                            </Space>
                        </Checkbox.Group>
                        {/* <Select
                    className={styles.select}
                    value={activeCategory || undefined}
                    placeholder="类别筛选"
                    onChange={(val: any) => setActiveCategory(val)}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    allowClear
                    style={{ width: 130 }}
                    options={category?.map((item) => {
                        return {
                            label: `${item.category} (${item.count})`,
                            value: item.category,
                        };
                    })}
                /> */}
                    </div>
                    <div>
                        <div>
                            <span>时间：</span>
                            {startEndTime?.[0] && (
                                <>
                                    <Button
                                        icon={<MinusOutlined />}
                                        onClick={() =>
                                            handleAddSubtractTime(
                                                "subtract",
                                                "start"
                                            )
                                        }
                                    />
                                    <Button
                                        icon={<PlusOutlined />}
                                        onClick={() =>
                                            handleAddSubtractTime(
                                                "add",
                                                "start"
                                            )
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
                                        这周至今: [
                                            dayjs().startOf("week"),
                                            dayjs(),
                                        ],
                                        一周内: [
                                            dayjs().subtract(1, "week"),
                                            dayjs(),
                                        ],
                                        这月至今: [
                                            dayjs().startOf("month"),
                                            dayjs(),
                                        ],
                                        今年至今: [
                                            dayjs().startOf("year"),
                                            dayjs(),
                                        ],
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
                                            dayjs()
                                                .endOf("month")
                                                .subtract(1, "month"),
                                        ],
                                        上上个月: [
                                            dayjs()
                                                .startOf("month")
                                                .subtract(2, "month"),
                                            dayjs()
                                                .endOf("month")
                                                .subtract(2, "month"),
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
                                            dayjs()
                                                .startOf("year")
                                                .subtract(1, "y"),
                                            dayjs()
                                                .endOf("year")
                                                .subtract(1, "y"),
                                        ],
                                        前年: [
                                            dayjs()
                                                .startOf("year")
                                                .subtract(2, "y"),
                                            dayjs()
                                                .endOf("year")
                                                .subtract(2, "y"),
                                        ],
                                    }}
                                />
                            )}
                            {startEndTime?.[1] && (
                                <>
                                    <Button
                                        icon={<MinusOutlined />}
                                        onClick={() => {
                                            handleAddSubtractTime(
                                                "subtract",
                                                "end"
                                            );
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
                                onChange={setIsTarget}
                            >
                                <span>
                                    <TodoTypeIcon
                                        type="target"
                                        style={{ color: "#ffeb3b" }}
                                    />{" "}
                                    {todoNameMap?.target}
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
                                    {todoNameMap?.note}
                                </span>
                            </SwitchComp>
                            <SwitchComp
                                value={isHabit}
                                onChange={setIsHabit}
                            >
                                <span>
                                    <TodoTypeIcon
                                        type="habit"
                                        style={{
                                            marginRight: 5,
                                            color: "#ffeb3b",
                                        }}
                                    />{" "}
                                    {todoNameMap?.habit}
                                </span>
                            </SwitchComp>
                            {isMe && <SwitchComp
                                value={isKeyNode}
                                onChange={setIsKeyNode}
                            >
                                <span>
                                    加密
                                </span>
                            </SwitchComp>}
                        </Space>
                    </div>
                </div>
            )}
        </>
    );
};

export default Filter;
