import React from "react";
import { Button, Input, message, Space } from "antd";
import { CopyOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const { TextArea } = Input;

export const splitStr = "<#####>";
const InputList = ({ value = "", onChange }: any) => {
    const l = value.split(splitStr);

    const handleChange = (val: string, index: number) => {
        l[index] = val;
        onChange(l.join(splitStr).replaceAll('\n\n\n\n\n', splitStr));
    };

    const handleDelete = (index: number) => {
        l.splice(index, 1);
        onChange(l.join(splitStr));
    };

    const handleCopy = (str: string) => {
        const input = document.createElement("textarea");
        document.body.appendChild(input);
        input.value = str;
        input.select();
        document.execCommand("copy");
        message.success("已复制到粘贴板");
        document.body.removeChild(input);
    };

    return (
        <Space size={4} direction="vertical" style={{ width: "100%" }}>
            <Button
                style={{ width: "100%" }}
                icon={<PlusOutlined />}
                onClick={() => onChange(`${splitStr}${value}`)}
            >
                增加描述
            </Button>
            <CopyOutlined
                className={styles.copyIcon}
                style={{ color: "#1890ff" }}
                onClick={() => handleCopy(value)}
            />
            {l?.map((item: string, index: number) => (
                <div key={index} className={styles.inputItem}>
                    <TextArea
                        className={styles.textarea}
                        placeholder="补充以及具体描述"
                        autoSize={{ minRows: 2, maxRows: 10 }}
                        style={{ wordBreak: "break-all" }}
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
                    <CopyOutlined
                        className={styles.copyIcon}
                        style={{ color: "#1890ff" }}
                        onClick={() => handleCopy(item)}
                    />
                </div>
            ))}
        </Space>
    );
};

export default InputList;
