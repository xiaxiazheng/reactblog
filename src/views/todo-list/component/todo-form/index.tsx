import React, { useEffect, useRef, useState } from "react";
import {
    Form,
    Input,
    DatePicker,
    Select,
    FormInstance,
    Radio,
    Divider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getTodoCategory } from "@/client/TodoListHelper";
import { colorMap, colorNameMap, colorList } from "../../utils";
import styles from "./index.module.scss";
import moment from "moment";

const { TextArea } = Input;

interface Props {
    form: FormInstance;
    onOk: any;
    isFieldsChange: () => void;
}

const TodoForm: React.FC<Props> = (props) => {
    const { form, onOk, isFieldsChange } = props;

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
                <span
                    className={styles.today}
                    onClick={() => {
                        form.setFieldsValue({
                            time: moment().subtract(1, "day"),
                        });
                    }}
                >
                    Yesterday
                </span>
                <span
                    className={styles.today}
                    onClick={() => {
                        form.setFieldsValue({
                            time: moment().add(1, "day"),
                        });
                    }}
                >
                    Tomorrow
                </span>
            </>
        );
    };

    return (
        <Form
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
            <Form.Item name="description" label="详细描述">
                <TextArea
                    placeholder="补充以及具体描述"
                    // onPressEnter={onOk} 这里不可以绑定，不然每次敲换行都会保存
                    autoSize={{ minRows: 8, maxRows: 10 }}
                    style={{ wordBreak: "break-all" }}
                    allowClear
                />
            </Form.Item>
            <Form.Item name="other_id" label="父级">
                <Input allowClear />
            </Form.Item>
            <Form.Item
                name="doing"
                label="现在处理"
                rules={[{ required: true }]}
                initialValue={"0"}
            >
                <Radio.Group>
                    <Radio key={"1"} value={"1"}>
                        是
                    </Radio>
                    <Radio key={"0"} value={"0"}>
                        否
                    </Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item name="color" label="轻重" rules={[{ required: true }]}>
                <Radio.Group>
                    {colorList.map((item) => (
                        <Radio
                            key={item}
                            value={item}
                            style={{ color: colorMap[item] }}
                        >
                            {colorNameMap[item]}
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
