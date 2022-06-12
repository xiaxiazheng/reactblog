import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Modal, Form, Input, Select, Divider, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CategoryType, NoteType } from "../types";
import { addNote, editNote, getNoteById } from "@/client/NoteHelper";
import ImgFileNoteList from "../img-file-note-list";
import { useCtrlSHooks } from "@/hooks/useCtrlSHook";

const { TextArea } = Input;

interface Props {
    visible: boolean;
    activeNote?: NoteType;
    setActiveNote: Function;
    category?: CategoryType[];
    closeModal: Function;
    refreshData: Function;
}

const EditNoteModal: React.FC<Props> = (props) => {
    const [form] = Form.useForm();

    const {
        visible,
        activeNote,
        setActiveNote,
        category: categoryList,
        refreshData,
        closeModal,
    } = props;

    const [category, setCategory] = useState<CategoryType[]>([]);
    const [name, setName] = useState<string>("");
    useEffect(() => {
        categoryList && setCategory(categoryList);
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
        await form.validateFields();

        const formData = form.getFieldsValue();

        const params: any = {
            ...formData,
        };
        if (activeNote) {
            params["note_id"] = activeNote.note_id;
            const res = await editNote(params);
            if (res) {
                setActiveNote({
                    ...activeNote,
                    ...params,
                });
                message.success("编辑 note 成功");
            } else {
                return false;
            }
        } else {
            const res = await addNote(params);
            if (res) {
                message.success("创建 note 成功");
                setActiveNote(res.data.newNote);
            } else {
                return false;
            }
        }
        refreshData();
        return true;
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

    useCtrlSHooks(() => {
        visible && onOk();
    });

    return (
        <Modal
            visible={visible}
            title={activeNote ? "编辑 note" : "新增 note"}
            // 只有点击 ok 按钮，且接口没有问题才关闭弹窗
            onOk={async () => {
                if (await onOk()) {
                    closeModal();
                }
            }}
            width={650}
            onCancel={() => closeModal()}
            className={styles.note_modal}
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
                            option?.value
                                ?.toLowerCase()
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
                                {item.category} ({item.count})
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {activeNote && (
                    <div style={{ width: "100%", overflowX: "auto" }}>
                        <ImgFileNoteList
                            activeNote={activeNote}
                            width="120px"
                            refreshData={refreshData}
                        />
                    </div>
                )}
            </Form>
        </Modal>
    );
};

export default EditNoteModal;
