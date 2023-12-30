import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button,
    FormInstance,
    Modal,
    message,
    Space,
    Popconfirm,
    Tooltip,
    Form,
    Popover,
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
import dayjs from "dayjs";
import TodoForm from "../todo-form";
import TodoImageFile from "../todo-image-file";
import {
    addTodoItem,
    deleteTodoItem,
    editTodoItem,
    getTodoById,
} from "@/client/TodoListHelper";
import { useCtrlSHooks } from "@/hooks/useCtrlSHook";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useUpdateFlag } from "../../hooks";
import { handleRefreshList } from "../../utils";
import TodoChainIcon from "../todo-chain-icon";
import { useDispatch, useSelector } from "react-redux";
import { setFootPrintList } from "../../list/todo-footprint";
import { Dispatch, RootState } from "../../rematch";
import { ThemeContext } from "@/context/ThemeContext";
import { getOriginTodo } from "../global-search";
import TodoItemName from "../todo-item/todo-item-name";
import TodoChildList from "./todo-child-list";

interface EditTodoModalType {}

const titleMap = {
    add: "新增",
    edit: "编辑",
    copy: "复制",
    add_child: "添加子任务",
    add_progress: "新增进度",
};

const EditTodoModal: React.FC<EditTodoModalType> = (props) => {
    const activeTodo = useSelector(
        (state: RootState) => state.edit.activeTodo
    ) as TodoItemType;
    const form = useSelector((state: RootState) => state.edit.form);
    const visible = useSelector((state: RootState) => state.edit.showEdit);
    const type = useSelector((state: RootState) => state.edit.operatorType);
    const dispatch = useDispatch<Dispatch>();
    const {
        setShowEdit,
        setOperatorType: setType,
        setActiveTodo,
    } = dispatch.edit;
    const { refreshData } = dispatch.data;

    const handleCloseBackUp = () => {
        setActiveTodo(undefined);
        setShowEdit(false);
        form?.resetFields();
    };

    const [otherTodo, setOtherTodo] = useState<TodoItemType>();

    useEffect(() => {
        if (visible && type === 'add') {
            setOtherTodo(undefined);
        }
    }, [visible, type]);

    useEffect(() => {
        if (type === "edit") {
            setType2(undefined);
        }
    }, [type]);

    const [activeTodoChildList, setActiveTodoChildList] = useState<
        TodoItemType[]
    >([]);

    useEffect(() => {
        if (activeTodo) {
            const item = activeTodo;
            form &&
                form.setFieldsValue({
                    name: item.name,
                    description: item.description,
                    time: dayjs(item.time),
                    status: Number(item.status),
                    color: item.color,
                    category: item.category,
                    other_id: item.other_id,
                    doing: item.doing,
                    isNote: item.isNote,
                    isTarget: item.isTarget,
                    isWork: item.isWork,
                    isBookMark: item.isBookMark,
                    isHabit: item.isHabit,
                    isKeyNode: item.isKeyNode,
                    isFollowUp: item.isFollowUp,
                });

            getOtherTodoById(item.other_id);

            // 保存足迹
            setFootPrintList(item.todo_id);

            if (item.child_todo_list) {
                setActiveTodoChildList(item.child_todo_list);
            } else if (
                item.child_todo_list_length !== 0 &&
                !item.child_todo_list
            ) {
                getTodoById(activeTodo.todo_id, true).then((res) => {
                    setActiveTodoChildList(res.data.child_todo_list);
                });
            } else {
                setActiveTodoChildList([]);
            }
        } else {
            setOtherTodo(undefined);
        }
    }, [activeTodo]);

    useEffect(() => {
        if (otherTodo) {
            otherForm &&
                otherForm.setFieldsValue({
                    name: otherTodo.name,
                    description: otherTodo.description,
                    // time: dayjs(otherTodo.time),
                    // status: Number(otherTodo.status),
                    // color: otherTodo.color,
                    // category: otherTodo.category,
                    // other_id: otherTodo.other_id,
                    // doing: otherTodo.doing,
                    // isNote: otherTodo.isNote,
                    // isTarget: otherTodo.isTarget,
                    // isWork: otherTodo.isWork,
                    // isBookMark: otherTodo.isBookMark,
                });
        }
    }, [otherTodo]);

    const needFresh = useRef<StatusType[]>([]);
    const { updateFlag } = useUpdateFlag();
    const handleClose = () => {
        if (needFresh.current) {
            if (needFresh.current.length !== 0) {
                // 先去重
                needFresh.current = Array.from(new Set(needFresh.current));
                needFresh.current.map((item) => {
                    refreshData(item);
                });
                // 刷新完要清空
                needFresh.current = [];
            }
            updateFlag(); // 刷新 todo chain
        }
        handleCloseBackUp();
        setType2(undefined);
    };

    const [isClose, setIsClose] = useState<boolean>(false);
    const onClose = () => {
        if ((isEditing || isEditingOther) && !isClose) {
            message.warning("你还有修改没保存，确定不要的话再点一次");
            setIsClose(true);
        } else {
            setIsClose(false);
            setIsEditing(false);
            setIsEditingOther(false);
            handleClose();
        }
    };

    const handleFormData = (formData: any) => {
        return {
            name: formData.name,
            time: dayjs(formData.time).format("YYYY-MM-DD"),
            status: formData.status,
            description: formData.description || "",
            color: formData.color,
            category: formData.category,
            other_id: formData.other_id || "",
            doing: formData.doing || "0",
            isNote: formData.isNote || "0",
            isTarget: formData.isTarget || "0",
            isWork: formData.isWork || "0",
            isBookMark: formData.isBookMark || "0",
            isHabit: formData.isHabit || "0",
            isKeyNode: formData.isKeyNode || "0",
            isFollowUp: formData.isFollowUp || "0",
        };
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

                needFresh.current.push(...handleRefreshList(formData));

                // 刷新前置 todo，因为目前前置 todo 的子 todo 会展示，也就是说正在编辑的这个 todo 目前修改了，展示也得刷新
                otherTodo?.todo_id && refreshOtherTodoById(otherTodo?.todo_id);

                setActiveTodo(res.data.newTodoItem);
                setType("edit");

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

    // 编辑 todo
    const editTodo = async () => {
        if (!activeTodo?.todo_id) return false;
        try {
            editOtherTodo();
            if (!isEditing) return false;

            form && (await form.validateFields()); // 这个会触发 isFieldsChange
            const formData = form && form.getFieldsValue();

            const req: EditTodoItemReq = {
                todo_id: activeTodo.todo_id,
                ...handleFormData(formData),
            };
            const res = await editTodoItem(req);
            if (res) {
                message.success(res.message);

                // 确定刷新范围并去重
                needFresh.current.push(
                    ...handleRefreshList(formData).concat(
                        handleRefreshList(activeTodo)
                    )
                );

                // 刷新前置 todo，因为目前前置 todo 的子 todo 会展示，也就是说正在编辑的这个 todo 目前修改了，展示也得刷新
                otherTodo?.todo_id && refreshOtherTodoById(otherTodo?.todo_id);

                setActiveTodo({ ...activeTodo, ...req });
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

                const req: any = {
                    ...otherTodo,
                    name: formData.name,
                    description: formData.description || "",
                };
                const res = await editTodoItem(req);
                if (res) {
                    message.success(res.message);
                    needFresh.current.push(...handleRefreshList(req));
                    setIsEditingOther(false);
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
        setType2(undefined);
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

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [isEditingOther, setIsEditingOther] = useState<boolean>(false);

    // 创建副本或子 todo
    const [type2, setType2] = useState<OperatorType2 | undefined>();
    const createCopyOrNextTask = async (
        type: OperatorType2,
        item: TodoItemType
    ) => {
        // 每种情况下都不变的“新增”
        setType("add");
        setType2(type);
        const originTodo = getOriginTodo();
        const newTodo = {
            ...originTodo,
            name: item.name,
            description: type !== "add_child" ? item.description : "",
            time: type === "copy" ? dayjs(item.time) : dayjs(),
            status: TodoStatus.todo,
            color:
                type === "add_child" && `${item.color}` !== "3"
                    ? `${Number(item.color) + 1}`
                    : item.color,
            category: item.category,
            other_id: type === "add_progress" ? item.other_id : item.todo_id,
            isWork: item.isWork,
        };
        setActiveTodo(newTodo);
        setIsEditing(true);
        setIsClose(false);
    };

    // 跟第二个 modal 有关的变量
    const [otherForm] = Form.useForm();

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

    const { theme } = useContext(ThemeContext);

    const isKeyNode = form?.getFieldValue("isKeyNode");

    const l = [
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
    // 当存在父级时，如果该任务不是关键节点也不是目标，则限制其往下继续创建子任务
    const controlList =
        !activeTodo?.other_id || (activeTodo?.other_id && (isKeyNode === "1" || activeTodo?.isTarget !== '1'))
            ? l
            : l.slice(0, 1);

    const handleOtherIdChange = (changedFields?: any[]) => {
        if (changedFields?.[0]?.name?.[0] === "other_id") {
            getOtherTodoById(changedFields?.[0]?.value);
        }
    };

    const getOtherTodoById = (id?: string) => {
        if (id) {
            if (otherTodo?.todo_id !== id) {
                refreshOtherTodoById(id);
            }
        } else {
            setOtherTodo(undefined);
        }
    };

    const refreshOtherTodoById = (id: string) => {
        getTodoById(id, true).then((res) => {
            if (res.data) {
                setOtherTodo(res.data);
            }
        });
    };

    return (
        <>
            <Modal
                className={`${styles.modal} ${
                    theme === "dark" ? "darkTheme" : ""
                }`}
                title={type ? getTitle(type2 || type) : ""}
                open={visible}
                onCancel={() => onClose()}
                transitionName=""
                destroyOnClose
                width={otherTodo ? 1600 : 1000}
                footer={
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
                                                        ghost
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
                }
            >
                <div className={styles.wrapper}>
                    {otherTodo && (
                        <div
                            className={`${styles.otherForm} ${styles.left} ScrollBar`}
                        >
                            <div className={styles.title}>前置 Todo：</div>
                            <div style={{ marginBottom: 15 }}>
                                <TodoItemName
                                    item={otherTodo}
                                    // onlyShow={true}
                                    isShowTime={true}
                                    isShowTimeRange={true}
                                    beforeClick={() => {
                                        if (isEditing || isEditingOther) {
                                            message.warning(
                                                "正在编辑，不能切换"
                                            );
                                            return false;
                                        }
                                        return true;
                                    }}
                                />
                            </div>
                            <TodoForm
                                form={otherForm}
                                open={!!otherTodo}
                                isFieldsChange={() => {
                                    setIsEditingOther(true);
                                    setIsClose(false);
                                }}
                                activeTodo={activeTodo}
                                isShowOther={true}
                                leftChildren={
                                    otherTodo?.child_todo_list && (
                                        <TodoChildList
                                            title={`同级别 todo: ${otherTodo.child_todo_list_length}`}
                                            todoChildList={
                                                otherTodo.child_todo_list
                                            }
                                            isEditing={
                                                isEditing || isEditingOther
                                            }
                                        />
                                    )
                                }
                            />
                        </div>
                    )}
                    <div
                        className={`${
                            otherTodo ? styles.right : styles.full
                        } ScrollBar`}
                    >
                        <div className={styles.title}>当前 Todo：</div>
                        {form && (
                            <TodoForm
                                form={form}
                                open={visible}
                                isFieldsChange={(changedFields) => {
                                    handleOtherIdChange(changedFields);
                                    setIsEditing(true);
                                    setIsClose(false);
                                }}
                                activeTodo={activeTodo}
                                leftChildren={
                                    activeTodo &&
                                    activeTodoChildList && (
                                        <TodoChildList
                                            title={`下一级 todo: ${activeTodo.child_todo_list_length}`}
                                            todoChildList={activeTodoChildList}
                                            isEditing={
                                                isEditing || isEditingOther
                                            }
                                        />
                                    )
                                }
                                rightChildren={
                                    type === "edit" &&
                                    activeTodo && (
                                        <TodoImageFile
                                            todo={activeTodo}
                                            handleFresh={(item) => {
                                                if (item) {
                                                    setActiveTodo(item);
                                                    needFresh.current.push(
                                                        ...handleRefreshList(
                                                            item
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                    )
                                }
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EditTodoModal;
