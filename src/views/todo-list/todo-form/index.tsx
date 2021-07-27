import React from "react";
import { Form, Input, DatePicker, Select, FormInstance } from "antd";

const { Option } = Select;

interface Props {
  form: FormInstance;
}

const TodoForm: React.FC<Props> = (props) => {
  const { form } = props;
  
  return (
    <Form form={form}>
      <Form.Item name="name" label="名称" rules={[{ required: true }]}>
        <Input placeholder="尽量的量化，有具体的完成指标，任务尽量细致且易完成" />
      </Form.Item>
      <Form.Item name="time" label="时间" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item
        name="status"
        label="状态"
        // rules={[{ required: true }]}
      >
        <Select>
          <Option value={0}>代办</Option>
          <Option value={1}>已完成</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default TodoForm;
