import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Modal, Form, Input, Select, Divider, message } from "antd";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useCtrlSHooks } from "@/hooks/useCtrlSHook";
import TodoImageFile from "@/views/todo-list/component/todo-image-file";
import {
    TodoItemType,
    CategoryType,
    CreateTodoItemReq,
    EditTodoItemReq,
} from "@/views/todo-list/types";
import { addTodoItem, editTodoItem } from "@/client/TodoListHelper";
import moment from "moment";
import InputList from "@/views/todo-list/component/input-list";
import { ThemeContext } from "@/context/ThemeContext";

const { TextArea } = Input;

interface Props {
    visible: boolean;
    activeTodo?: TodoItemType;
    setActiveTodo: Function;
    category?: CategoryType[];
    closeModal: Function;
    refreshData: Function;
}

const TodoEditNoteModal: React.FC<Props> = (props) => {
    const [form] = Form.useForm();

    const { theme } = useContext(ThemeContext);

    const {
        visible,
        activeTodo,
        setActiveTodo,
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

        const { category, name, description } = form.getFieldsValue();

        const params: CreateTodoItemReq = {
            name: name,
            description: description || "",
            category: category,
            // 以下这些，如果原来有就不要更改，如果没有，就就默认的
            time: activeTodo?.time || moment().format("YYYY-MM-DD"), // 当前日期
            status: activeTodo?.status || "1", // 已完成
            color: activeTodo?.color || "3", // 灰色
            other_id: activeTodo?.other_id || "", // 没有进度
            doing: activeTodo?.doing || "0", // 不是现在处理
            isNote: "1", // 这个一定是 1是便签，不然也不会出现在这
            isTarget: activeTodo?.isTarget || "0",
            isBookMark: "0",
        };
        if (activeTodo) {
            const p: EditTodoItemReq = {
                ...params,
                todo_id: activeTodo.todo_id,
            };
            const res = await editTodoItem(p);
            if (res) {
                setActiveTodo({
                    ...activeTodo,
                    ...p,
                });
                message.success("编辑 todo note 成功");
            } else {
                return false;
            }
        } else {
            const res = await addTodoItem(params);
            if (res) {
                message.success("创建 todo note 成功");
                setActiveTodo(res.data.newNote);
            } else {
                return false;
            }
        }
        setIsEdit(false);
        refreshData();
        return true;
    };

    useEffect(() => {
        if (!visible) {
            form.resetFields();
        } else {
            if (activeTodo) {
                form.setFieldsValue({
                    name: activeTodo.name,
                    description: activeTodo.description,
                    category: activeTodo.category,
                });
            }
        }
    }, [activeTodo, visible]);

    useCtrlSHooks(() => {
        visible && onOk();
    });

    const [isEdit, setIsEdit] = useState<boolean>(false);

    const onClose = () => {
        if (isEdit) {
            Modal.confirm({
                title: "你还有修改没保存，确定不要了？",
                okText: "对，就是不要了",
                cancelText: "不，只是点错了",
                icon: <ExclamationCircleOutlined />,
                onOk() {
                    closeModal();
                    setIsEdit(false);
                },
            });
        } else {
            closeModal();
        }
    };

    return (
        <Modal
            visible={visible}
            title={activeTodo ? "编辑 note" : "新增 note"}
            // 只有点击 ok 按钮，且接口没有问题才关闭弹窗
            onOk={async () => {
                if (await onOk()) {
                    onClose();
                }
            }}
            width={650}
            onCancel={() => onClose()}
            className={`${styles.note_modal} ${
                theme === "dark" ? "darkTheme" : ""
            }`}
            okButtonProps={{
                danger: isEdit,
            }}
        >
            <Form
                form={form}
                onFieldsChange={() => setIsEdit(true)}
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item
                    name="name"
                    label="标题"
                    rules={[{ required: true }]}
                >
                    <TextArea
                        className={styles.textarea}
                        placeholder="请输入内容"
                        autoSize={{ minRows: 1, maxRows: 2 }}
                        autoFocus={true}
                    />
                </Form.Item>
                <Form.Item name="description" label="详细描述">
                    <InputList />
                </Form.Item>
                <Form.Item
                    name="category"
                    label="类别"
                    rules={[{ required: true }]}
                    initialValue="个人"
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
            </Form>
        </Modal>
    );
};

export default TodoEditNoteModal;
