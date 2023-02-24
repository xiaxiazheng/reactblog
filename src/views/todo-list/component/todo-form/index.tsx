import React, { useCallback, useEffect, useState } from "react";
import {
    Form,
    Input,
    DatePicker,
    Select,
    FormInstance,
    Radio,
    Divider,
    Tooltip,
    Space,
} from "antd";
import {
    AimOutlined,
    BookOutlined,
    PlusOutlined,
    QuestionCircleFilled,
    QuestionCircleOutlined,
    StarFilled,
} from "@ant-design/icons";
import { getTodoCategory } from "@/client/TodoListHelper";
import { colorMap, colorNameMap, colorList, handleCopy } from "../../utils";
import styles from "./index.module.scss";
import moment from "moment";
import { CategoryType, TodoItemType } from "../../types";
import InputList, { splitStr } from "../input-list";
import SwitchComp from "./switch";
import SearchTodo from "./searchTodo";

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

    const [name, setName] = useState<string>();
    const addItem = () => {
        setCategory([
            ...category,
            {
                category: name,
                count: 0,
            },
        ] as CategoryType[]);
    };

    const MyDatePicker = (props: any) => {
        const { value, onChange } = props;

        return (
            <>
                <DatePicker value={value} onChange={onChange} />
                <span
                    className={styles.today}
                    onClick={() => {
                        // form.setFieldsValue({
                        //     time: moment(),
                        // });
                        onChange(moment());
                    }}
                >
                    Today
                </span>
                <span
                    className={styles.today}
                    onClick={() => {
                        // form.setFieldsValue({
                        //     time: moment().subtract(1, "day"),
                        // });
                        onChange(moment().subtract(1, "day"));
                    }}
                >
                    Yesterday
                </span>
                <span
                    className={styles.today}
                    onClick={() => {
                        // form.setFieldsValue({
                        //     time: moment().add(1, "day"),
                        // });
                        onChange(moment().add(1, "day"));
                    }}
                >
                    Tomorrow
                </span>
            </>
        );
    };

    return (
        <Form
            className={styles.form}
            form={form}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 20 }}
            onFieldsChange={isFieldsChange}
        >
            <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                <Input
                    placeholder="尽量的量化，有具体的完成指标，任务尽量细致且易完成"
                    onPressEnter={onOk}
                    autoFocus={true}
                    allowClear
                />
            </Form.Item>
            <Form.Item
                name="description"
                label={
                    <Tooltip title={`分割符为 ${splitStr}, 点击复制`}>
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
                <Radio.Group optionType="button">
                    {colorList.map((item) => (
                        <Radio.Button
                            key={item}
                            value={item}
                            style={{ color: colorMap[item] }}
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
                <Select
                    showSearch
                    filterOption={(input, option) =>
                        option?.value
                            ?.toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0 || false
                    }
                    dropdownRender={(menu) => (
                        <div>
                            {menu}
                            <Divider style={{ margin: "4px 0" }} />
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    padding: 8,
                                }}
                            >
                                <Input
                                    style={{ flex: "auto" }}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <a
                                    style={{
                                        flex: "none",
                                        padding: "8px",
                                        display: "block",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => addItem()}
                                >
                                    <PlusOutlined /> Add item
                                </a>
                            </div>
                        </div>
                    )}
                >
                    {category.map((item) => (
                        <Select.Option
                            key={item.category}
                            value={item.category}
                        >
                            {item.category} ({item.count})
                        </Select.Option>
                    ))}
                </Select>
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
            <Form.Item label="特殊状态" style={{ marginBottom: 0}}>
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
                </Space>
            </Form.Item>

            <Form.Item name="other_id" label="前置 todo">
                <SearchTodo activeTodo={activeTodo} />
            </Form.Item>
        </Form>
    );
};

export default TodoForm;
