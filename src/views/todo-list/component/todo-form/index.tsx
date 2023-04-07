import React, { useEffect, useRef, useState } from "react";
import {
    Form,
    Input,
    DatePicker,
    FormInstance,
    Radio,
    Tooltip,
    Space,
} from "antd";
import {
    AimOutlined,
    BookOutlined,
    ClockCircleOutlined,
    QuestionCircleOutlined,
    StarFilled,
} from "@ant-design/icons";
import { getTodoCategory } from "@/client/TodoListHelper";
import { colorMap, colorNameMap, colorList, handleCopy, timeRangeParse } from "../../utils";
import styles from "./index.module.scss";
import styles2 from "../input-list/index.module.scss";
import dayjs from "dayjs";
import { CategoryType, TodoItemType } from "../../types";
import InputList, { splitStr } from "../input-list";
import SwitchComp from "./switch";
import SearchTodo from "./searchTodo";
import CategoryOptions from "./categoryOptions";

interface Props {
    form: FormInstance;
    onOk: any;
    isFieldsChange: () => void;
    activeTodo?: TodoItemType;
}

const TodoForm: React.FC<Props> = (props) => {
    const { form, onOk, isFieldsChange, activeTodo } = props;

    const [category, setCategory] = useState<CategoryType[]>([]);
    const getCategory = async () => {
        const res = await getTodoCategory();
        setCategory(res.data);
    };
    useEffect(() => {
        getCategory();
    }, []);

    const MyDatePicker = (props: any) => {
        const { value, onChange } = props;

        return (
            <>
                <DatePicker value={value} onChange={onChange} />
                <span
                    className={`${styles.today} ${
                        dayjs().isSame(value, "d") ? styles.active : ""
                    }`}
                    onClick={() => {
                        // form.setFieldsValue({
                        //     time: dayjs(),
                        // });
                        onChange(dayjs());
                    }}
                >
                    Today
                </span>
                <span
                    className={`${styles.today} ${
                        dayjs().subtract(1, "day").isSame(value, "d")
                            ? styles.active
                            : ""
                    }`}
                    onClick={() => {
                        // form.setFieldsValue({
                        //     time: dayjs().subtract(1, "day"),
                        // });
                        onChange(dayjs().subtract(1, "day"));
                    }}
                >
                    Yesterday
                </span>
                <span
                    className={`${styles.today} ${
                        dayjs().add(1, "day").isSame(value, "d")
                            ? styles.active
                            : ""
                    }`}
                    onClick={() => {
                        // form.setFieldsValue({
                        //     time: dayjs().add(1, "day"),
                        // });
                        onChange(dayjs().add(1, "day"));
                    }}
                >
                    Tomorrow
                </span>
            </>
        );
    };

    const isPunchTheClock = Form.useWatch("isPunchTheClock", form) === '1';

    const input = useRef<any>(null);
    useEffect(() => {
        input?.current && input.current?.focus();
    }, [activeTodo]);

    return (
        <Form
            className={styles.form}
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 19 }}
            onFieldsChange={isFieldsChange}
        >
            <Form.Item name="name" label="名称" rules={[{ required: true }]}>
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
            <Form.Item name="color" label="轻重" rules={[{ required: true }]}>
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
                        name="doing"
                        rules={[{ required: true }]}
                        initialValue={"0"}
                    >
                        <SwitchComp>
                            <span style={{ color: "#ffeb3b" }}>现在处理</span>
                        </SwitchComp>
                    </Form.Item>
                    <Form.Item
                        name="isTarget"
                        rules={[{ required: true }]}
                        initialValue={"0"}
                    >
                        <SwitchComp>
                            <span>
                                <AimOutlined style={{ color: "#ffeb3b" }} />{" "}
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
                                <StarFilled
                                    style={{ marginRight: 5, color: "#ffeb3b" }}
                                />{" "}
                                书签
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
                                <BookOutlined
                                    style={{ marginRight: 5, color: "#ffeb3b" }}
                                />{" "}
                                存档
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
                                <ClockCircleOutlined
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
                        name="range"
                        label="持续天数"
                        rules={[{ required: true }]}
                        initialValue={7}
                    >
                        <Input />
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
