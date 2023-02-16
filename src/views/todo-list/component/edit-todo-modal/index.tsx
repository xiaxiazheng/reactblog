import React, { useRef, useState } from "react";
import {
    Button,
    FormInstance,
    Modal,
    message,
    Space,
    Popconfirm,
    Tooltip,
    Form,
} from "antd";
import styles from "./index.module.scss";
import {
    TodoItemType,
    OperatorType,
    EditTodoItemReq,
    CreateTodoItemReq,
    TodoStatus,
    StatusType,
    OperatorType2,
} from "../../types";
import moment from "moment";
import TodoForm from "../todo-form";
import TodoImageFile from "../todo-image-file";
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
import { useUpdateFlag } from "../../hooks";
import { handleRefreshList } from "../../utils";

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
    add_progress: "新增后续 todo",
};

const EditTodoModal: React.FC<EditTodoModalType> = (props) => {
    const {
        type,
        setType,
        visible,
        onClose: handleCloseBackUp,
        form,
        refreshData,
        activeTodo,
        setActiveTodo,
    } = props;

    const needFresh = useRef<StatusType[]>([]);
    const { updateFlag } = useUpdateFlag();
    const handleClose = () => {
        if (needFresh.current) {
            if (needFresh.current.length === 0) {
                refreshData();
            } else {
                // 先去重
                needFresh.current = Array.from(new Set(needFresh.current));
                needFresh.current.map((item) => {
                    refreshData(item);
                });
            }
            updateFlag();
        }
        handleCloseBackUp();
    };

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
    const addTodo = async (form: FormInstance<any>) => {
        try {
            await form.validateFields();
            const formData = form.getFieldsValue();

            const req: CreateTodoItemReq = {
                name: formData.name,
                time: moment(formData.time).format("YYYY-MM-DD"),
                status: formData.status,
                description: formData.description || "",
                color: formData.color,
                category: formData.category,
                other_id: formData.other_id || "",
                doing: formData.doing || "0",
                isNote: formData.isNote || "0",
                isTarget: formData.isTarget || "0",
                isBookMark: formData.isBookMark || "0",
            };
            const res = await addTodoItem(req);
            if (res) {
                message.success(res.message);

                needFresh.current.push(...handleRefreshList(formData));

                setActiveTodo(res.data.newTodoItem);
                setType("edit");
            } else {
                message.error("新增 todo 失败");
            }
        } catch (err) {
            message.warning("请检查表单输入");
        }
    };

    // 编辑 todo
    const editTodo = async () => {
        if (!activeTodo?.todo_id) return;
        try {
            await form.validateFields();
            const formData = form.getFieldsValue();

            const req: EditTodoItemReq = {
                todo_id: activeTodo.todo_id,
                name: formData.name,
                time: moment(formData.time).format("YYYY-MM-DD"),
                status: formData.status,
                description: formData.description || "",
                color: formData.color,
                category: formData.category,
                other_id: formData.other_id || "",
                doing: formData.doing || "0",
                isNote: formData.isNote || "0",
                isTarget: formData.isTarget || "0",
                isBookMark: formData.isBookMark || "0",
            };
            const res = await editTodoItem(req);
            if (res) {
                message.success(res.message);

                // 确定刷新范围并去重
                needFresh.current.push(...handleRefreshList(formData).concat(
                    handleRefreshList(activeTodo)
                ));

                setActiveTodo({ ...activeTodo, ...req });
            } else {
                message.error("编辑 todo 失败");
            }
        } catch (err) {
            message.warning("请检查表单输入");
        }
    };

    // 删除 todo
    const deleteTodo = async (activeTodo: TodoItemType | undefined) => {
        if (activeTodo?.todo_id) {
            const req = {
                todo_id: activeTodo.todo_id,
            };
            const res = await deleteTodoItem(req);
            if (res) {
                message.success(res.message);
                needFresh.current.push(...handleRefreshList(activeTodo));

                onClose();
            } else {
                message.error("删除 todo 失败");
            }
        }
    };

    useCtrlSHooks(() => {
        if (visible2) {
            handleOk2();
        } else {
            visible && handleOk(false);
        }
    });

    const [loading, setLoading] = useState<boolean>(false);
    const handleOk = async (isButton: boolean) => {
        if (visible && isEdit) {
            setLoading(true);
            if (type === "edit") {
                await editTodo();
            } else {
                await addTodo(form);
            }
            setLoading(false);

            // 如果是点击保存按钮，直接关闭弹窗；如果是快捷键保存，则不关闭
            if (isButton) {
                handleClose();
            }
            setIsEdit(false);
        } else {
            if (isButton) {
                handleClose();
            }
        }
    };

    const getTitle = (type: OperatorType | OperatorType2) => {
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

    // 创建副本或子 todo
    const createCopyOrNextTask = async (
        type: OperatorType2,
        item: TodoItemType
    ) => {
        setType2(type);
        form2?.setFieldsValue({
            name: item.name,
            description: item.description,
            time: moment(item.time),
            status: TodoStatus.todo,
            color: item.color,
            category: item.category,
            other_id: type === "copy" ? item.other_id : item.todo_id,
            doing: "0",
            isNote: item.isNote,
        });
        setVisible2(true);
        setIsEdit2(true);
    };

    // 跟第二个 modal 有关的变量
    const [type2, setType2] = useState<OperatorType2>();
    const [form2] = Form.useForm();
    const [visible2, setVisible2] = useState<boolean>(false);
    const [isEdit2, setIsEdit2] = useState<boolean>(false);
    const handleClose2 = () => {
        setVisible2(false);
    };
    const [loading2, setLoading2] = useState<boolean>(false);
    const handleOk2 = async () => {
        if (visible2) {
            setLoading2(true);
            await addTodo(form2);
            setLoading2(false);
            setVisible2(false);
            setIsEdit2(false);
        }
    };

    return (
        <>
            <Modal
                className={`${visible2 ? styles.modal1 : ""} ${styles.modal}`}
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
                                            isEdit ||
                                            (activeTodo?.imgList &&
                                                activeTodo.imgList.length !==
                                                    0) ||
                                            (activeTodo?.fileList &&
                                                activeTodo.fileList.length !==
                                                    0)
                                        }
                                        onConfirm={() => {
                                            deleteTodo(activeTodo);
                                        }}
                                        okText="YES"
                                        cancelText="NO"
                                    >
                                        <Button
                                            danger
                                            disabled={
                                                isEdit ||
                                                (activeTodo?.imgList &&
                                                    activeTodo.imgList
                                                        .length !== 0) ||
                                                (activeTodo?.fileList &&
                                                    activeTodo.fileList
                                                        .length !== 0)
                                            }
                                        >
                                            删除
                                        </Button>
                                    </Popconfirm>
                                    <Button
                                        type="primary"
                                        ghost
                                        onClick={() =>
                                            activeTodo &&
                                            createCopyOrNextTask(
                                                "copy",
                                                activeTodo
                                            )
                                        }
                                        disabled={isEdit}
                                    >
                                        创建
                                        {form.getFieldValue("other_id")
                                            ? "同级任务"
                                            : "副本"}
                                    </Button>
                                    <Button
                                        type="primary"
                                        ghost
                                        onClick={() =>
                                            activeTodo &&
                                            createCopyOrNextTask(
                                                "add_progress",
                                                activeTodo
                                            )
                                        }
                                        disabled={isEdit}
                                    >
                                        添加后续 todo
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
                                loading={loading}
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
                    onOk={() => handleOk(false)}
                    isFieldsChange={() => setIsEdit(true)}
                    activeTodo={activeTodo}
                />
                {type === "edit" && activeTodo && (
                    <TodoImageFile
                        handleFresh={() => {
                            needFresh.current = [];
                        }}
                        activeTodo={activeTodo}
                    />
                )}
            </Modal>

            <Modal
                className={styles.modal2}
                title={type2 ? getTitle(type2) : ""}
                visible={visible2}
                onCancel={() => handleClose2()}
                transitionName=""
                destroyOnClose
                width={650}
                footer={
                    <div className={styles.footer}>
                        <Space>
                            <Button onClick={() => handleClose2()}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                danger={isEdit2}
                                onClick={() => handleOk2()}
                                loading={loading2}
                            >
                                OK
                            </Button>
                        </Space>
                    </div>
                }
            >
                <TodoForm
                    form={form2}
                    // 除了编辑，其他走的都是新建的路子
                    onOk={() => handleOk2()}
                    isFieldsChange={() => setIsEdit2(true)}
                    activeTodo={activeTodo}
                />
            </Modal>
        </>
    );
};

export default EditTodoModal;
