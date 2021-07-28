import React from "react";
import { Form, Input, DatePicker, Select, FormInstance } from "antd";

const { TextArea } = Input;
const { Option } = Select;

interface Props {
    form: FormInstance;
    onOk: any;
}

const TodoForm: React.FC<Props> = (props) => {
    const { form, onOk } = props;

    return (
        <Form form={form}>
            <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                <Input
                    placeholder="尽量的量化，有具体的完成指标，任务尽量细致且易完成"
                    onPressEnter={onOk}
                />
            </Form.Item>
            <Form.Item name="description" label="详细描述">
                <TextArea
                    placeholder="补充以及具体描述"
                    autoSize={{ minRows: 4, maxRows: 6 }}
                />
            </Form.Item>
            <Form.Item name="time" label="时间" rules={[{ required: true }]}>
                <DatePicker />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select>
                    <Option value={0}>待办</Option>
                    <Option value={1}>已完成</Option>
                    <Option value={2}>待办池</Option>
                </Select>
            </Form.Item>
        </Form>
    );
};

export default TodoForm;
