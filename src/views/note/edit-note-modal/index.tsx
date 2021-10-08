import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Modal, Form, Input, Select, Divider, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CategoryType, NoteType } from "../types";
import { addNote, editNote } from "@/client/NoteHelper";

const { TextArea } = Input;

interface Props {
    visible: boolean;
    activeNote?: NoteType;
    category?: CategoryType[];
    onCancel: Function;
    refreshData: Function;
}

const EditNoteModal: React.FC<Props> = (props) => {
    const [form] = Form.useForm();

    const {
        visible,
        activeNote,
        category: categoryList,
        refreshData,
        onCancel,
    } = props;

    const [category, setCategory] = useState<CategoryType[]>([]);
    const [name, setName] = useState<string>('');
    useEffect(() => {
        categoryList && setCategory(categoryList);

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [categoryList]);
    const addItem = () => {
        setCategory([
            ...category,
            {
                category: name,
                count: "0",
            },
        ]);
    };

    const onOk = async () => {
        await form.submit();

        const formData = form.getFieldsValue();

        const params: any = {
            ...formData,
        };
        if (activeNote) {
            params["note_id"] = activeNote.note_id;
            await editNote(params);
            message.success("编辑 note 成功");
        } else {
            await addNote(params);
            message.success("创建 note 成功");
        }
        refreshData();
    };

    useEffect(() => {
        if (!visible) {
            form.resetFields();
        } else {
            if (activeNote) {
                form.setFieldsValue({
                    note: activeNote.note,
                    category: activeNote.category,
                });
            }
        }
    }, [activeNote, visible]);

        /** 判断是否用 ctrl + s 保存修改，直接在 onKeyDown 运行 saveEditLog() 的话只会用初始值去发请求（addEventListener）绑的太死 */
        const [isKeyDown, setIsKeyDown] = useState(false);
        useEffect(() => {
            if (isKeyDown) {
                onOk();
                setIsKeyDown(false);
            }
        }, [isKeyDown]);
    
        // 键盘事件
        const onKeyDown = (e: any) => {
            // 加上了 mac 的 command 按键的 metaKey 的兼容
            if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                setIsKeyDown(true);
            }
        };

    return (
        <Modal
            visible={visible}
            title={activeNote ? "编辑 note" : "新增 note"}
            onOk={() => onOk()}
            onCancel={() => onCancel()}
        >
            <Form form={form}>
                <Form.Item
                    name="note"
                    label="内容"
                    rules={[{ required: true }]}
                >
                    <TextArea
                        className={styles.textarea}
                        placeholder="请输入内容"
                        autoFocus={true}
                        rows={15}
                    />
                </Form.Item>
                <Form.Item
                    name="category"
                    label="类别"
                    rules={[{ required: true }]}
                    initialValue="其他"
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
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
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
                        {category?.map((item) => (
                            <Select.Option
                                key={item.category}
                                value={item.category}
                            >
                                {item.category}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditNoteModal;