import React from 'react';
import { Form } from "antd";
import Input from "./input";
import Button from "./button";

export const formItemMap: any = {
    Input,
    Button,
};

const Comp = (props: any) => {
    const { item, ...rest } = props;
    const { value } = rest;
    console.log(value);
    
    const Component = formItemMap[item.type];
    return React.cloneElement(<Component {...rest} />);
}

export const renderFormItems = (formItems: any[]) => {

    return formItems.map((item, index) => (
        <Form.Item key={index} name={item.key} label={item.label}>
            <Comp item={item} />
        </Form.Item>
    ));
};
