import React from 'react';
import styles from './index.module.scss';
import {
    Button,
    Space,
    Popconfirm,
    Tooltip,
    Popover,
    message,
} from "antd";
import { OperatorType, OperatorType2, TodoItemType } from '../../types';
import TodoChainIcon from '../todo-chain-icon';
import { addBlogCont } from '@/client/BlogHelper';
import { splitStr } from '../input-list';
import { handleFormData } from './utils';
import { FormInstance } from 'antd/lib/form/Form';

interface IProps {
    type: OperatorType;
    activeTodo: TodoItemType;
    isEditing: boolean;
    isEditingOther: boolean;
    loading: boolean;
    onClose: Function;
    deleteTodo: Function;
    createCopyOrNextTask: Function;
    handleOk: Function;
    editTodo: Function;
    setIsEditing: Function;
    form: FormInstance<any> | null;
}

const Footer: React.FC<IProps> = (props) => {
    const { type,
        activeTodo,
        isEditing,
        isEditingOther,
        loading,
        onClose,
        deleteTodo,
        createCopyOrNextTask,
        handleOk,
        editTodo,
        setIsEditing,
        form,
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