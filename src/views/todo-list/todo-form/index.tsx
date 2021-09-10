import React, { useEffect, useRef, useState } from "react";
import {
    Form,
    Input,
    DatePicker,
    Select,
    FormInstance,
    Radio,
    Divider,
    Tooltip,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getTodoCategory } from "@/client/TodoListHelper";
import { colorMap } from "../utils";
import styles from "./index.module.scss";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

interface Props {
    form: FormInstance;
    onOk: any;
}

const TodoForm: React.FC<Props> = (props) => {
    const { form, onOk } = props;

    const [category, setCategory] = useState<any[]>([]);
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
        ]);
    };

    const colorNameMap: any = {
        0: "red",
        1: "orange",
        2: "blue",
        3: "grey",
    };

    const descMap: any = {
        0: "重要且紧急",
        1: "不重要但紧急",
        2: "重要但不紧急",
        3: "不重要且不紧急",
    };

    const MyDatePicker = (props: any) => {
        const { value, onChange } = props;

        return (
            <>
                <DatePicker value={value} onChange={onChange} />
                <span
                    className={styles.today}
                    onClick={() => {
                        form.setFieldsValue({
                            time: moment(),
                        });
                    }}
                >
                    Today
                </span>
            </>
        );
    };

    return (
        <Form form={form}>
            <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                <Input
                    placeholder="尽量的量化，有具体的完成指标，任务尽量细致且易完成"
                    onPressEnter={onOk}
                    autoFocus={true}
                />
            </Form.Item>
            <Form.Item name="description" label="详细描述">
                <TextArea
                    placeholder="补充以及具体描述"
                    autoSize={{ minRows: 4, maxRows: 6 }}
                />
            </Form.Item>
            <Form.Item name="color" label="轻重" rules={[{ required: true }]}>
                <Radio.Group>
                    {["0", "1", "2", "3"].map((item) => (
                        <Radio key={item} value={item} style={{ color: colorMap[item] }}>
                            <Tooltip title={descMap[item]}>
                                {colorNameMap[item]}
                            </Tooltip>
                        </Radio>
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
                        option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
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
                            {item.category}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="time" label="时间" rules={[{ required: true }]}>
                <MyDatePicker />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Radio.Group>
                    <Radio value={0}>待办</Radio>
                    <Radio value={1}>已完成</Radio>
                    <Radio value={2}>待办池</Radio>
                </Radio.Group>
            </Form.Item>
        </Form>
    );
};

export default TodoForm;
