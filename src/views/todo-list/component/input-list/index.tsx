import React from "react";
import { Button, Input, Space } from "antd";
import { CopyOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import CopyButton from "@/components/copy-button";

const { TextArea } = Input;

export const splitStr = "<#####>";
export const splitMdStr = '\n\n---\n';
const InputList = ({ value = "", onChange }: any) => {
    const l = value.split(splitStr);

    const handleChange = (val: string, index: number) => {
        l[index] = val;
        onChange(l.join(splitStr).replaceAll("\n\n\n\n\n", splitStr));
    };

    const handleDelete = (index: number) => {
        l.splice(index, 1);
        onChange(l.join(splitStr));
    };

    return (
        <Space size={4} direction="vertical" style={{ width: "100%" }}>
            <div style={{ width: "100%", display: "flex", alignItems: 'center' }}>
                <Button
                    style={{ flex: 1 }}
                    icon={<PlusOutlined />}
                    onClick={() => onChange(`${splitStr}${value}`)}
                >
                    增加描述
                </Button>
                <CopyButton
                    style={{ margin: "0 10px" }}
                    text={value}
                    icon={<CopyOutlined />}
                />
                <Button
                    danger
                    onClick={() => onChange("")}
                    icon={<DeleteOutlined />}
                />
            </div>
            {l?.map((item: string, index: number) => (
                <div key={index} className={styles.inputItem}>
                    <TextArea
                        className={styles.textarea}
                        placeholder="补充以及具体描述"
                        autoSize={{ minRows: 5 }}
                        allowClear
                        value={item}
                        onChange={(e) => handleChange(e.target.value, index)}
                    />
                    {l.length > 1 && (
                        <DeleteOutlined
                            className={styles.deleteIcon}
                            style={{ color: "red" }}
                            onClick={() => handleDelete(index)}
                        />
                    )}
                </div>
            ))}
        </Space>
    );
};

export default InputList;
