import React, { useState } from 'react';
import styles from './index.module.scss';
import {
    Button,
    Space,
    Popconfirm,
    Tooltip,
    Popover,
    message,
} from "antd";
import { OperatorType, OperatorType2 } from '../../types';
import { CreateTodoItemReq, EditTodoItemReq, TodoItemType } from "@xiaxiazheng/blog-libs";
import TodoChainIcon from '../todo-chain-icon';
import { addBlogCont } from '@/client/BlogHelper';
import { splitStr } from '../input-list';
import { handleFormData } from './utils';
import { FormInstance } from 'antd/lib/form/Form';
import { useCtrlHooks } from '@/hooks/useCtrlHook';
import { addTodoItem, deleteTodoItem, editTodoItem } from '@/client/TodoListHelper';

interface IProps {
    visible: boolean;
    type: OperatorType;
    activeTodo: TodoItemType;
    otherTodo?: TodoItemType;
    isEditing: boolean;
    isEditingOther: boolean;
    onClose: Function;
    createCopyOrNextTask: Function;
    setIsEditing: Function;
    form: FormInstance<any> | null;
    otherForm: FormInstance<any> | null;
    handleClose: Function;
    handleAfterAddTodo: Function;
    handleAfterDelete: Function;
    handleAfterEditTodo: Function;
    handleAfterEditOtherTodo: Function;
    handleAfterOk: Function;
}

const Footer: React.FC<IProps> = (props) => {
    const { type,
        visible,
        activeTodo,
        otherTodo,
        isEditing,
        isEditingOther,
        onClose,
        createCopyOrNextTask,
        setIsEditing,
        form,
        otherForm,
        handleClose,
        handleAfterAddTodo,
        handleAfterDelete,
        handleAfterEditTodo,
        handleAfterEditOtherTodo,
        handleAfterOk,
    } = props;

    const controlList = [
        {
            label: activeTodo?.other_id ? "添加同级进度" : "复制",
            tooltip: activeTodo?.other_id
                ? "添加的是前置todo的进度，与当前todo挂同样的前置todo"
                : "",
            key: "add_progress",
            isShow: true,
        },
        {
            label: "添加后续",
            tooltip:
                "添加的是当前 todo 的子任务，当前 todo 作为子任务的前置 todo",
            key: "add_child",
            isShow: true,
        },
    ];

    // 将当前 todo 另存为 blog
    const handleSaveAsBlog = async () => {
        message.success("正在将当前 todo 保存为 blog");

        const formData = form && form.getFieldsValue();

        const todoData = handleFormData(formData);

        // 添加日志
        const params = {
            edittype: "markdown",
            title: todoData.name,
            author: "xiaxiazheng from todo",
            blogcont: todoData.description
                .replaceAll(splitStr, "\n")
        };

        const res: any = await addBlogCont(params);
        if (res) {
            message.success("新建成功");
            /** 新建成功直接跳转到新日志 */
            const newId = res.newid;
            const url = `${location.origin}/admin/blog/${btoa(
                decodeURIComponent(newId)
            )}`;

            form?.setFieldValue(
                "description",
                `${todoData.description}${splitStr}已保存到 blog：<${url}>`
            );
            await editTodo(true);
            setIsEditing(false);
            setTimeout(() => {
                window.open(url);
            }, 1000);
        } else {
            message.error("新建失败");
        }
    };

    const handleCantDelete = () => {
        if (isEditing || isEditingOther) {
            return true;
        }
        if (activeTodo) {
            if (activeTodo.imgList && activeTodo.imgList.length !== 0) {
                return true;
            }
            if (activeTodo.fileList && activeTodo.fileList.length !== 0) {
                return true;
            }
            if (
                activeTodo.child_todo_list_length &&
                activeTodo.child_todo_list_length !== 0
            ) {
                return true;
            }
        }
        return false;
    };

    const renderDeleteButton = () => {
        const cantDelete = handleCantDelete();

        return cantDelete ? (
            <Popover title="在有图片/文件、正在编辑、有子 todo 的情况下不允许删除">
                <Button danger disabled>
                    删除
                </Button>
            </Popover>
        ) : (
            <Popconfirm
                title="确定删除吗"
                disabled={cantDelete}
                onConfirm={() => {
                    deleteTodo(activeTodo);
                }}
                okText="YES"
                cancelText="NO"
            >
                <Button danger>删除</Button>
            </Popconfirm>
        );
    };

    useCtrlHooks(() => {
        visible && handleOk(false);
    });

    const [loading, setLoading] = useState<boolean>(false);
    const handleOk = async (isButton: boolean) => {
        if (visible && (isEditing || isEditingOther)) {
            setLoading(true);
            let res = false;
            if (type === "edit") {
                res = await editTodo();
            } else {
                if (form) {
                    res = await addTodo(form);
                }
            }
            setLoading(false);
            if (res) {
                // 如果是点击保存按钮，直接关闭弹窗；如果是快捷键保存，则不关闭
                if (isButton) {
                    handleClose();
                }
                setIsEditing(false);
            }
        } else {
            if (isButton) {
                handleClose();
            }
        }
        handleAfterOk();
    };

    // 新增 todo
    const addTodo = async (form: FormInstance<any>) => {
        try {
            editOtherTodo();
            if (!isEditing) return false;

            await form.validateFields(); // 这个会触发 isFieldsChange
            const formData = form.getFieldsValue();

            const req: CreateTodoItemReq = handleFormData(formData);
            const res = await addTodoItem(req);
            if (res) {
                message.success(res.message);

                handleAfterAddTodo(res.data.newTodoItem);

                return true;
            } else {
                message.error("新增 todo 失败");
                return false;
            }
        } catch (err) {
            message.warning("请检查表单输入");
            return false;
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
                handleAfterDelete();

                onClose();
            } else {
                message.error("删除 todo 失败");
            }
        }
    };

    // 编辑 todo
    const editTodo = async (forceSave = false) => {
        if (!activeTodo?.todo_id) return false;
        try {
            editOtherTodo();
            if (!forceSave && !isEditing) return false;

            form && (await form.validateFields()); // 这个会触发 isFieldsChange
            const formData = form && form.getFieldsValue();

            const req: EditTodoItemReq = {
                todo_id: activeTodo.todo_id,
                ...handleFormData(formData),
            };
            const res = await editTodoItem(req);
            if (res) {
                message.success(res.message);
                handleAfterEditTodo({ ...activeTodo, ...req });
                return true;
            } else {
                message.error("编辑 todo 失败");
                return false;
            }
        } catch (err) {
            message.warning("请检查表单输入");
            return false;
        }
    };

    // 编辑前置 todo
    const editOtherTodo = async () => {
        if (otherTodo?.todo_id && isEditingOther) {
            try {
                otherForm && (await otherForm.validateFields());
                const formData = otherForm && otherForm.getFieldsValue();
                const { child_todo_list, ...rest } = otherTodo; // child_todo_list 如果赋值给 req，请求体就会超长
                const req: any = {
                    ...rest,
                    name: formData.name,
                    description: formData.description || "",
                };
                const res = await editTodoItem(req);
                if (res) {
                    message.success(res.message);
                    handleAfterEditOtherTodo();
                } else {
                    message.error("编辑 todo 失败");
                    return false;
                }
            } catch (err) {
                message.warning("请检查表单输入");
                return false;
            }
        }
    };

    return (
        <div className={styles.footer}>
            <Space>
                {type === "edit" ? (
                    <>
                        {renderDeleteButton()}
                        {controlList.map(
                            (item) =>
                                item.isShow && (
                                    <Tooltip
                                        key={item.key}
                                        title={item.tooltip}
                                    >
                                        <Button
                                            type="primary"
                                            // 如果 activeTodo 是 target，优先展示添加进度，否则优先展示添加同级进度/复制
                                            ghost={
                                                Number(
                                                    activeTodo?.isTarget
                                                )
                                                    ? item.key !==
                                                    "add_child"
                                                    : item.key !==
                                                    "add_progress"
                                            }
                                            onClick={() =>
                                                activeTodo &&
                                                createCopyOrNextTask(
                                                    item.key as OperatorType2,
                                                    activeTodo
                                                )
                                            }
                                            disabled={
                                                isEditing ||
                                                isEditingOther
                                            }
                                        >
                                            {item.label}
                                        </Button>
                                    </Tooltip>
                                )
                        )}

                        {activeTodo && (
                            <TodoChainIcon item={activeTodo} />
                        )}
                    </>
                ) : (
                    ""
                )}
            </Space>
            <Space>
                {type === "edit" ? <Button
                    onClick={() => handleSaveAsBlog()}
                    disabled={isEditing}
                    type="primary"
                >
                    Save as blog
                </Button> : ""}
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button
                    type="primary"
                    danger={isEditing || isEditingOther}
                    onClick={() => handleOk(true)}
                    loading={loading}
                >
                    OK
                </Button>
            </Space>
        </div>
    )
}

export default Footer;