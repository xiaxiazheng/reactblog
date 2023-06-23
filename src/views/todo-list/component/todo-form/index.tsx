import React, { useEffect, useRef } from "react";
import {
    Form,
    Input,
    DatePicker,
    FormInstance,
    Radio,
    Tooltip,
    Space,
    Button,
} from "antd";
import {
    QuestionCircleOutlined,
    PlusOutlined,
    MinusOutlined,
} from "@ant-design/icons";
import {
    colorMap,
    colorNameMap,
    colorList,
    handleCopy,
    colorTitle,
    getWeek,
    getRangeFormToday,
} from "../../utils";
import styles from "./index.module.scss";
import styles2 from "../input-list/index.module.scss";
import dayjs from "dayjs";
import { TodoItemType } from "../../types";
import InputList, { splitStr } from "../input-list";
import SwitchComp from "./switch";
import SearchTodo from "./searchTodo";
import CategoryOptions from "./categoryOptions";
import { useSelector } from "react-redux";
import { RootState } from "../../rematch";
import TodoTypeIcon from "../todo-type-icon";

interface Props {
    form: FormInstance;
    onOk: any;
    isFieldsChange: () => void;
    activeTodo?: TodoItemType;
    open: boolean;
}

const MyDatePicker = (props: any) => {
    const { value, onChange } = props;

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
                {getWeek(value)}，{getRangeFormToday(value)}
            </span>
            <span
                className={`${styles.today} ${
                    dayjs().subtract(1, "day").isSame(value, "d")
                        ? styles.active
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
                        ? styles.active
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

const TodoForm: React.FC<Props> = (props) => {
    const { form, onOk, isFieldsChange, activeTodo, open } = props;

    const category = useSelector((state: RootState) => state.data.category);

    const isPunchTheClock = Form.useWatch("isPunchTheClock", form) === "1";

    const input = useRef<any>(null);
    useEffect(() => {
        open && input?.current && input.current?.focus();
    }, [open]);

    return (
        <Form
            className={styles.form}
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 19 }}
            onFieldsChange={isFieldsChange}
        >
            <Form.Item
                name="name"
                label="名称"
                rules={[{ required: true }]}
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    background: "rgb(0, 21, 41)",
                }}
            >
                <Input.TextArea
                    className={styles2.textarea}
                    placeholder="尽量的量化，有具体的完成指标，任务尽量细致且易完成"
                    // onPressEnter={onOk}
                    autoFocus={true}
                    ref={input}
                    allowClear
                    autoSize={{ minRows: 1, maxRows: 4 }}
                />
            </Form.Item>
            <Form.Item
                name="description"
                label={
                    <Tooltip
                        title={
                            <div>
                                <div>1. 分割符为 {splitStr}, 点击复制</div>
                                <div>2. 五个回车可新增输入框</div>
                            </div>
                        }
                    >
                        <span
                            style={{ cursor: "pointer" }}
                            onClick={() => handleCopy(splitStr)}
                        >
                            详细描述 <QuestionCircleOutlined />
                        </span>
                    </Tooltip>
                }
                initialValue={""}
            >
                <InputList />
            </Form.Item>
            <Form.Item
                name="color"
                label={colorTitle}
                rules={[{ required: true }]}
            >
                <Radio.Group optionType="button" buttonStyle="solid">
                    {colorList.map((item) => (
                        <Radio.Button
                            key={item}
                            value={item}
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
            </Form.Item>
            <Form.Item
                name="category"
                label="类别"
                rules={[{ required: true }]}
            >
                <CategoryOptions category={category} />
            </Form.Item>
            <Form.Item name="time" label="时间" rules={[{ required: true }]}>
                <MyDatePicker />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Radio.Group optionType="button" buttonStyle="solid">
                    <Radio.Button value={0}>待办</Radio.Button>
                    <Radio.Button value={1}>已完成</Radio.Button>
                    <Radio.Button value={2}>待办池</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="特殊状态" style={{ marginBottom: 0 }}>
                <Space>
                    <Form.Item
                        name="isWork"
                        rules={[{ required: true }]}
                        initialValue={"0"}
                    >
                        <SwitchComp>
                            <span>
                                <TodoTypeIcon
                                    type="work"
                                    style={{ color: "#00d4d8" }}
                                />{" "}
                                工作
                            </span>
                        </SwitchComp>
                    </Form.Item>
                    <Form.Item
                        name="doing"
                        rules={[{ required: true }]}
                        initialValue={"0"}
                    >
                        <SwitchComp>
                            <span>
                                <TodoTypeIcon
                                    type="urgent"
                                    style={{ color: "red" }}
                                />{" "}
                                加急
                            </span>
                        </SwitchComp>
                    </Form.Item>
                    <Form.Item
                        name="isTarget"
                        rules={[{ required: true }]}
                        initialValue={"0"}
                    >
                        <SwitchComp>
                            <span>
                                <TodoTypeIcon
                                    type="target"
                                    style={{ color: "#ffeb3b" }}
                                />{" "}
                                目标
                            </span>
                        </SwitchComp>
                    </Form.Item>
                    <Form.Item
                        name="isBookMark"
                        rules={[{ required: true }]}
                        initialValue={"0"}
                    >
                        <SwitchComp>
                            <span>
                                <TodoTypeIcon
                                    type="pin"
                                    style={{ marginRight: 5, color: "#ffeb3b" }}
                                />{" "}
                                Pin
                            </span>
                        </SwitchComp>
                    </Form.Item>
                    <Form.Item
                        name="isNote"
                        rules={[{ required: true }]}
                        initialValue={"0"}
                    >
                        <SwitchComp>
                            <span>
                                <TodoTypeIcon
                                    type="note"
                                    style={{ marginRight: 5, color: "#ffeb3b" }}
                                />{" "}
                                Note
                            </span>
                        </SwitchComp>
                    </Form.Item>
                    <Form.Item
                        name="isPunchTheClock"
                        rules={[{ required: true }]}
                        initialValue={"0"}
                    >
                        <SwitchComp>
                            <span>
                                <TodoTypeIcon
                                    type="punchTheClock"
                                    style={{ marginRight: 5, color: "#ffeb3b" }}
                                />{" "}
                                打卡
                            </span>
                        </SwitchComp>
                    </Form.Item>
                </Space>
            </Form.Item>

            <Form.Item name="other_id" label="前置 todo">
                <SearchTodo activeTodo={activeTodo} />
            </Form.Item>

            {isPunchTheClock && (
                <>
                    <Form.Item
                        name="startTime"
                        label="打卡开始时间"
                        rules={[{ required: true }]}
                        initialValue={dayjs()}
                    >
                        <MyDatePicker />
                    </Form.Item>
                    <Form.Item
                        name="target"
                        label="达标天数"
                        rules={[{ required: true }]}
                        initialValue={7}
                    >
                        <Input />
                    </Form.Item>
                </>
            )}
        </Form>
    );
};

export default TodoForm;
