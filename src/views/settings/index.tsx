import {
    addSettings,
    deleteSettings,
    getSettingsList,
    updateSettings,
} from "@xiaxiazheng/blog-libs";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

import { Button, Drawer, Input, message, Modal, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DataType {
    settings_id: string;
    name: string;
    value: string;
}

const Settings = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Value",
            dataIndex: "value",
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
        setIsEditing(true);
    };
    const [editing, setEditing] = useState<DataType>();
    const [editingName, setEditingName] = useState<string>();
    const [editingValue, setEditingValue] = useState<string>();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const saveCreate = async () => {
        if (editingName && editingValue) {
            try {
                console.log(JSON.parse(editingValue));

                await addSettings({
                    name: editingName,
                    value: JSON.parse(editingValue),
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

    const checkFormat = () => {
        try {
            editingValue && JSON.parse(editingValue);
        } catch (e) {
            return "格式出错";
        }
    };

    const [list, setList] = useState<DataType[]>([]);
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

    const handleCancel = () => {
        setIsEditing(false);
        setEditing(undefined);
        setEditingName("");
        setEditingValue("");
    };

    const handleAdd = () => {
        setIsEditing(true);
    };

    return (
        <div className={styles.wrapper}>
            <Button onClick={handleAdd}>新建配置</Button>
            <Table
                className={styles.table}
                style={{ width: 800 }}
                scroll={{ y: 'calc(100vh - 300px)' }}
                columns={columns}
                key="settings_id"
                dataSource={list}
            />
            <Modal
                open={isEditing}
                onCancel={handleCancel}
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
                <div style={{ marginTop: 10 }}>具体配置：</div>
                <Input.TextArea
                    rows={8}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                />
                <div style={{ color: "red" }}>{checkFormat()}</div>
            </Modal>
        </div>
    );
};

export default Settings;
