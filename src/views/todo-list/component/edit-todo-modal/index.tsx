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
} from "@/client/TodoListHelper";
import { useCtrlSHooks } from "@/hooks/useCtrlSHook";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useUpdateFlag } from "../../hooks";
import {
    handleRefreshList,
    TimeRange,
    timeRangeParse,
    timeRangeStringify,
} from "../../utils";
import TodoChainIcon from "../todo-chain-icon";
import { useDispatch, useSelector } from "react-redux";
import { setFootPrintList } from "../../list/todo-footprint";
import { Dispatch, RootState } from "../../rematch";
import { ThemeContext } from "@/context/ThemeContext";
import { getOriginTodo } from "../global-search";

interface EditTodoModalType {}

const titleMap = {
    add: "新增",
    edit: "编辑",
    copy: "复制",
    add_progress: "新增后续进度",
    add_same_level_progress: "新增并行进度"
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

    useEffect(() => {
        if (activeTodo) {
            const item = activeTodo;
            let timeRange: TimeRange & { isPunchTheClock: "0" | "1" } = {
                startTime: dayjs(),
                target: 7,
                isPunchTheClock: "0",
            };
            if (item.timeRange) {
                timeRange = {
                    ...timeRangeParse(item.timeRange),
                    isPunchTheClock: "1",
                };
            }
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
                    ...timeRange,
                });

            // 保存足迹
            setFootPrintList(item.todo_id);
        }
    }, [activeTodo]);

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
    };

    const [isClose, setIsClose] = useState<boolean>(false);
    const onClose = () => {
        if (isEdit && !isClose) {
            message.warning("你还有修改没保存，确定不要的话再点一次");
            setIsClose(true);
        } else {
            setIsClose(false);
            setIsEdit(false);
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
            };
            const res = await addTodoItem(req);
            if (res) {
                message.success(res.message);

                needFresh.current.push(...handleRefreshList(formData));

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
            form && (await form.validateFields());
            const formData = form && form.getFieldsValue();

            const req: EditTodoItemReq = {
                todo_id: activeTodo.todo_id,
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
            };
            if (formData.isPunchTheClock === "1") {
                const { startTime, target } = formData;
                req.timeRange = timeRangeStringify({
                    startTime,
                    target,
                });
                req.isTarget = "1";
            }
            const res = await editTodoItem(req);
            if (res) {
                message.success(res.message);

                // 确定刷新范围并去重
                needFresh.current.push(
                    ...handleRefreshList(formData).concat(
                        handleRefreshList(activeTodo)
                    )
                );

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
                setIsEdit(false);
            }
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
        const originTodo = getOriginTodo();
        form2?.setFieldsValue({
            ...originTodo,
            name: item.name,
            description: item.description,
            time: type === "copy" ? dayjs(item.time) : dayjs(),
            status: TodoStatus.todo,
            color:
                type === "add_progress" && `${item.color}` !== "3"
                    ? `${Number(item.color) + 1}`
                    : item.color,
            category: item.category,
            other_id:
                type === "copy"
                    ? ""
                    : type === "add_same_level_progress"
                    ? item.other_id
                    : item.todo_id,
            isWork: item.isWork,
        });
        setVisible2(true);
        setIsEdit2(true);
        setIsClose2(false);
    };

    // 跟第二个 modal 有关的变量
    const [type2, setType2] = useState<OperatorType2>();
    const [form2] = Form.useForm();
    const [visible2, setVisible2] = useState<boolean>(false);
    const [isEdit2, setIsEdit2] = useState<boolean>(false);
    const [isClose2, setIsClose2] = useState<boolean>(false);
    const handleClose2 = () => {
        if (isEdit2 && !isClose2) {
            message.warning("你还有修改没保存，确定不要的话再点一次");
            setIsClose2(true);
        } else {
            setIsClose2(false);
            setIsEdit2(false);
            setVisible2(false);
        }
    };
    const [loading2, setLoading2] = useState<boolean>(false);
    const handleOk2 = async () => {
        if (visible2) {
            setLoading2(true);
            const res = await addTodo(form2);
            setLoading2(false);
            if (res) {
                setVisible2(false);
                setIsEdit2(false);
            }
        }
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

    const handleCantDelete = () => {
        if (isEdit) {
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

    return (
        <>
            <Modal
                className={`${visible2 ? styles.modal1 : ""} ${styles.modal} ${
                    theme === "dark" ? "darkTheme" : ""
                }`}
                title={type ? getTitle(type) : ""}
                open={visible}
                onCancel={() => onClose()}
                transitionName=""
                destroyOnClose
                width={700}
                footer={
                    <div className={styles.footer}>
                        <Space>
                            {type === "edit" ? (
                                <>
                                    {renderDeleteButton()}
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
                                        复制
                                    </Button>
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
                                        添加并行进度
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
                                        添加后续进度
                                    </Button>
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
                {form && (
                    <TodoForm
                        form={form}
                        open={visible}
                        // 除了编辑，其他走的都是新建的路子
                        onOk={() => handleOk(false)}
                        isFieldsChange={() => {
                            setIsEdit(true);
                            setIsClose(false);
                        }}
                        activeTodo={activeTodo}
                    />
                )}
                {type === "edit" && activeTodo && (
                    <TodoImageFile
                        todo={activeTodo}
                        handleFresh={(item) => {
                            item && setActiveTodo(item);
                            needFresh.current = [];
                        }}
                    />
                )}
            </Modal>

            <Modal
                className={styles.modal2}
                title={type2 ? getTitle(type2) : ""}
                open={visible2}
                onCancel={() => handleClose2()}
                transitionName=""
                destroyOnClose
                width={700}
                footer={
                    <div className={styles.footer2}>
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
                    open={visible2}
                    // 除了编辑，其他走的都是新建的路子
                    onOk={() => handleOk2()}
                    isFieldsChange={() => {
                        setIsEdit2(true);
                        setIsClose2(false);
                    }}
                    activeTodo={activeTodo}
                />
            </Modal>
        </>
    );
};

export default EditTodoModal;
