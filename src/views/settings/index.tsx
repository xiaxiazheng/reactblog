import {
    addSettings,
    // deleteSettings,
    getSettingsList,
    updateSettings,
} from "@xiaxiazheng/blog-libs";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

import { Button, Input, message, Modal, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DataType {
    settings_id: string;
    name: string;
    value: string;
    description: string;
}

const Settings = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Value",
            dataIndex: "value",
            width: 600,
            key: "value",
            render: (_) => {
                return <div className={styles.renderValue}>{_}</div>;
            },
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleEdit(record)}>编辑</Button>
                    <Button onClick={() => handleDelete(record)}>删除</Button>
                </Space>
            ),
        },
    ];

    const handleEdit = (item: DataType) => {
        setEditing(item);
        setEditingName(item.name);
        setEditingValue(item.value);
        setEditingDescription(item.description);
        setIsEditing(true);
    };
    const [editing, setEditing] = useState<DataType>();
    const [editingName, setEditingName] = useState<string>();
    const [editingValue, setEditingValue] = useState<string>();
    const [editingDescription, setEditingDescription] = useState<string>();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const saveCreate = async () => {
        if (editingName && editingValue) {
            try {
                console.log(JSON.parse(editingValue));

                await addSettings({
                    name: editingName,
                    value: JSON.parse(editingValue),
                    description: editingDescription,
                });
                setIsEditing(false);
                getData();
            } catch (e) {
                message.error("保存失败，当前不是第一个完整对象");
            }
        } else {
            message.error("不能为空");
        }
    };

    const saveEdit = async () => {
        if (editing && editingName && editingValue) {
            try {
                console.log(JSON.parse(editingValue));

                await updateSettings({
                    settings_id: editing?.settings_id,
                    name: editingName,
                    value: JSON.parse(editingValue),
                    description: editingDescription,
                });
                handleClear();
                getData();
            } catch (e) {
                message.error("保存失败，当前不是第一个完整对象");
            }
        } else {
            message.error("不能为空");
        }
    };

    const handleDelete = async (item: DataType) => {
        // await deleteSettings({
        //     settings_id: item.settings_id,
        // });
        // getData();
        message.error("暂不支持");
    };

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const l: DataType[] = await getSettingsList();
        setList(
            l.map((item) => {
                return {
                    ...item,
                    value: JSON.stringify(JSON.parse(item.value), null, "\t"),
                };
            })
        );
    };

    // 检查 value 格式
    const checkFormat = () => {
        try {
            editingValue && JSON.parse(editingValue);
        } catch (e) {
            return "格式出错";
        }
    };

    const [list, setList] = useState<DataType[]>([]);

    // 帮助 value 格式化
    const handleFormat = () => {
        try {
            editingValue &&
                setEditingValue(
                    JSON.stringify(JSON.parse(editingValue), null, "\t")
                );
        } catch (e) {
            message.error("当前不是一个对象");
        }
    };

    const handleClear = () => {
        setIsEditing(false);
        setEditing(undefined);
        setEditingName("");
        setEditingValue("");
        setEditingDescription("");
    };

    const handleAdd = () => {
        setIsEditing(true);
    };

    return (
        <div className={styles.wrapper}>
            <Button onClick={handleAdd}>新建配置</Button>
            <Table
                className={styles.table}
                style={{ width: '80vw' }}
                scroll={{ y: 'calc(100vh - 300px)' }}
                columns={columns}
                key="settings_id"
                dataSource={list}
            />
            <Modal
                open={isEditing}
                onCancel={handleClear}
                footer={
                    <>
                        <Button onClick={handleFormat}>格式化</Button>
                        <Button
                            type="primary"
                            onClick={editing ? saveEdit : saveCreate}
                            disabled={
                                !editingName ||
                                !editingValue ||
                                checkFormat() === "格式出错"
                            }
                        >
                            保存
                        </Button>
                    </>
                }
            >
                <div>配置名称：</div>
                <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                />
                <div style={{ marginTop: 10 }}>配置描述：</div>
                <Input.TextArea
                    rows={3}
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                />
                <div style={{ marginTop: 10 }}>具体配置：</div>
                <Input.TextArea
                    rows={16}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                />
                <div style={{ color: "red" }}>{checkFormat()}</div>
            </Modal>
        </div>
    );
};

export default Settings;
