import React, { useEffect, useState } from "react";
import {
    Button,
    FormInstance,
    Modal,
    message,
    Space,
    Popconfirm,
    Tooltip,
} from "antd";
import styles from "./index.module.scss";
import { TodoItemType, OperatorType } from "../../types";
import moment from "moment";
import TodoForm from "../todo-form";
import TodoImage from "../todo-image";
import {
    addTodoItem,
    deleteTodoItem,
    editTodoItem,
} from "@/client/TodoListHelper";
import { useCtrlSHooks } from "@/hooks/useCtrlSHook";
import {
    ExclamationCircleOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";

interface EditTodoModalType {
    type: OperatorType;
    setType: (type: OperatorType) => void;
    activeTodo: TodoItemType | undefined;
    setActiveTodo: (todo: TodoItemType) => void;
    visible: boolean;
    onClose: Function;
    form: FormInstance<any>;
    refreshData: Function;
}

const titleMap = {
    add: "新增",
    edit: "编辑",
    copy: "复制",
    add_progress: "新增进度",
};

const EditTodoModal: React.FC<EditTodoModalType> = (props) => {
    const {
        type,
        setType,
        visible,
        onClose: handleClose,
        form,
        refreshData,
        activeTodo,
        setActiveTodo,
    } = props;

    useCtrlSHooks(() => {
        visible && handleOk(false);
    });

    const onClose = () => {
        if (isEdit) {
            Modal.confirm({
                title: "你还有修改没保存，确定取消？",
                icon: <ExclamationCircleOutlined />,
                onOk() {
                    handleClose();
                    setIsEdit(false);
                },
            });
        } else {
            handleClose();
        }
    };

    // 新增 todo
    const addTodo = async () => {
        try {
            await form.validateFields();
            const formData = form.getFieldsValue();
            const req = {
                name: formData.name,
                time: moment(formData.time).format("YYYY-MM-DD"),
                status: formData.status,
                description: formData.description || "",
                color: formData.color,
                category: formData.category,
                other_id: formData.other_id || "",
                doing: formData.doing || "0",
            };
            const res = await addTodoItem(req);
            if (res) {
                message.success(res.message);
                refreshData();
                setActiveTodo(res.data.newTodoItem);
                setType("edit");
                return true;
            } else {
                message.error("新增 todo 失败");
            }
        } catch (err) {
            message.warning("请检查表单输入");
        }
        return false;
    };

    // 编辑 todo
    const editTodo = async () => {
        try {
            await form.validateFields();
            const formData = form.getFieldsValue();
            const req = {
                todo_id: activeTodo?.todo_id,
                name: formData.name,
                time: moment(formData.time).format("YYYY-MM-DD"),
                status: formData.status,
                description: formData.description || "",
                color: formData.color,
                category: formData.category,
                other_id: formData.other_id || "",
                doing: formData.doing || "0",
            };
            const res = await editTodoItem(req);
            if (res) {
                message.success(res.message);
                refreshData();
                return true;
            } else {
                message.error("编辑 todo 失败");
            }
        } catch (err) {
            message.warning("请检查表单输入");
        }
        return false;
    };

    // 删除 todo
    const deleteTodo = async (todo_id: string) => {
        const req = {
            todo_id,
        };
        const res = await deleteTodoItem(req);
        if (res) {
            message.success(res.message);
            refreshData();
            onClose();
        } else {
            message.error("删除 todo 失败");
        }
    };

    // 处理复制
    const handleCopy = (item: TodoItemType) => {
        setActiveTodo(item);
        setType("copy");
        form.setFieldsValue({
            name: item.name,
            description: item.description,
            time: moment(item.time),
            status: Number(item.status),
            color: item.color,
            category: item.category,
            doing: "0",
        });
    };

    // 处理添加进度
    const handleAddProgress = (item: TodoItemType) => {
        setActiveTodo(item);
        setType("add_progress");
        form.setFieldsValue({
            name: item.name,
            description: item.description,
            time: moment(item.time),
            status: Number(item.status),
            color: item.color,
            category: item.category,
            other_id: item.todo_id,
            doing: "0",
        });
    };

    const handleOk = async (isButton: boolean) => {
        if (visible) {
            if (type === "edit") {
                await editTodo();
            } else {
                await addTodo();
            }

            // 如果是点击保存按钮，直接关闭弹窗；如果是快捷键保存，则不关闭
            if (isButton) {
                handleClose();
            }
            setIsEdit(false);
        }
    };

    const getTitle = (type: OperatorType) => {
        if (type === "edit") {
            return (
                <>
                    {titleMap[type]}{" "}
                    <Tooltip
                        placement="bottom"
                        title={
                            <>
                                <div>创建时间：{activeTodo?.cTime}</div>
                                <div>编辑时间：{activeTodo?.mTime}</div>
                            </>
                        }
                    >
                        <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                    </Tooltip>
                </>
            );
        } else {
            return titleMap[type];
        }
    };

    const [isEdit, setIsEdit] = useState<boolean>(false);

    return (
        <Modal
            title={type ? getTitle(type) : ""}
            visible={visible}
            onCancel={() => onClose()}
            transitionName=""
            destroyOnClose
            width={650}
            footer={
                <div className={styles.footer}>
                    <Space>
                        {type === "edit" ? (
                            <>
                                <Popconfirm
                                    title="确定删除吗"
                                    disabled={
                                        (activeTodo?.imgList &&
                                            activeTodo.imgList.length !== 0) ||
                                        (activeTodo?.fileList &&
                                            activeTodo.fileList.length !== 0)
                                    }
                                    onConfirm={() => {
                                        deleteTodo(activeTodo?.todo_id || "");
                                    }}
                                    okText="YES"
                                    cancelText="NO"
                                >
                                    <Button
                                        danger
                                        disabled={
                                            (activeTodo?.imgList &&
                                                activeTodo.imgList.length !==
                                                    0) ||
                                            (activeTodo?.fileList &&
                                                activeTodo.fileList.length !==
                                                    0)
                                        }
                                    >
                                        删除
                                    </Button>
                                </Popconfirm>
                                <Button
                                    type="primary"
                                    ghost
                                    onClick={() =>
                                        activeTodo && handleCopy(activeTodo)
                                    }
                                    danger
                                >
                                    复制
                                </Button>
                                <Button
                                    type="primary"
                                    ghost
                                    onClick={() =>
                                        activeTodo &&
                                        handleAddProgress(activeTodo)
                                    }
                                >
                                    添加进度
                                </Button>
                            </>
                        ) : (
                            ""
                        )}
                    </Space>
                    <Space>
                        <Button onClick={() => onClose()}>Cancel</Button>
                        <Button
                            type="primary"
                            danger={isEdit}
                            onClick={() => handleOk(true)}
                        >
                            OK
                        </Button>
                    </Space>
                </div>
            }
        >
            <TodoForm
                form={form}
                // 除了编辑，其他走的都是新建的路子
                onOk={type === "edit" ? editTodo : addTodo}
                isFieldsChange={() => setIsEdit(true)}
            />
            {type === "edit" && activeTodo && (
                <TodoImage refreshData={refreshData} activeTodo={activeTodo} />
            )}
        </Modal>
    );
};

export default EditTodoModal;
