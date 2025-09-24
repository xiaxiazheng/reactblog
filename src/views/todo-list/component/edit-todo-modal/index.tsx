import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, message, Tooltip, Form, Space } from "antd";
import styles from "./index.module.scss";
import {
    OperatorType,
    OperatorType2,
} from "../../types";
import dayjs from "dayjs";
import TodoForm from "../todo-form";
import TodoImageFile from "../todo-image-file";
import { getTodoById, judgeIsCanShowInHomeTodo } from "@xiaxiazheng/blog-libs";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useUpdateFlag } from "../../hooks";
import { handleRefreshList } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import { ThemeContext } from "@/context/ThemeContext";
import { useGetOriginTodo } from "../global-search";
import TodoChildList from "./todo-child-list";
import { useSettings } from "@xiaxiazheng/blog-libs";
import Footer from "./footer";
import { titleMap } from "./utils";
import OtherForm from "./other-form";
import {
    TodoItemType,
    TodoStatus,
    StatusType,
    setFootPrintList,
} from "@xiaxiazheng/blog-libs";

const EditTodoModal: React.FC = () => {
    const { theme } = useContext(ThemeContext);
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

    const settings = useSettings();

    const [otherTodo, setOtherTodo] = useState<TodoItemType>();

    useEffect(() => {
        if (type === "edit") {
            setType2(undefined);
        }
    }, [type]);

    const [activeTodoChildList, setActiveTodoChildList] = useState<
        TodoItemType[]
    >([]);

    useEffect(() => {
        // 可能来自外部途径的突然编辑
        if (activeTodo) {
            handleJudgeIsCanShowInHomeTodo(activeTodo);

            const item = activeTodo;
            form &&
                form.setFieldsValue({
                    ...item,
                    time: dayjs(item.time),
                    status: Number(item.status),
                });

            getOtherTodoById(item.other_id);

            // 保存足迹
            setFootPrintList(item.todo_id);

            // 设置子todo的列表
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
        setShowEdit(false); // 关闭弹窗
        setActiveTodo(undefined);
        form?.resetFields();
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

    const getTitle = (type: OperatorType | OperatorType2, text: string) => {
        if (type === "edit") {
            return (
                <>
                    <span className={styles.titleEditColor} /> {text}{" "}
                    <Tooltip
                        placement="bottom"
                        title={
                            <>
                                <div>创建时间：{activeTodo?.cTime}</div>
                                <div>编辑时间：{activeTodo?.mTime}</div>
                            </>
                        }
                    >
                        <QuestionCircleOutlined
                            style={{ cursor: "pointer", marginLeft: 5 }}
                        />
                    </Tooltip>
                </>
            );
        } else {
            return (
                <>
                    <span className={styles.titleEditColor2} /> {text}
                </>
            );
        }
    };

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [isEditingOther, setIsEditingOther] = useState<boolean>(false);

    const getOriginTodo = useGetOriginTodo();

    // 创建副本或子 todo
    const [type2, setType2] = useState<OperatorType2 | undefined>();
    const createCopyOrNextTask = async (
        type: OperatorType2,
        item: TodoItemType
    ) => {
        // 每种情况下都不变的“新增”
        setType("add");
        setType2(type);
        const newTodo = {
            ...getOriginTodo(),
            name: item.name,
            description: type !== "add_child" ? item.description : "",
            time: type === "copy" ? dayjs(item.time) : dayjs(),
            status: TodoStatus.todo,
            color:
                type === "add_child"
                    ? String(settings?.todoDefaultColor || "3")
                    : item.color,
            category: item.category,
            other_id: type === "add_progress" ? item.other_id : item.todo_id,
            isWork: item.isWork,
        };
        setActiveTodo(newTodo);
        setIsEditing(true);
        setIsClose(false);
    };

    useEffect(() => {
        // 每次打开编辑弹窗，在新增todo且不是添加子进度的情况下，设置otherTodo为空
        if (visible && type === "add" && !type2) {
            setOtherTodo(undefined);
        }
    }, [visible, type, type2]);

    // 跟第二个 modal 有关的变量
    const [otherForm] = Form.useForm();

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

    // 判断当前 todo 会不会在 HomeTodo 中展示
    const [isCanShowInHomeTodo, setIsCanShowInHomeTodo] = useState<boolean>(false);
    const handleJudgeIsCanShowInHomeTodo = (todo: TodoItemType) => {
        setIsCanShowInHomeTodo(judgeIsCanShowInHomeTodo(todo, settings));
    }

    return (
        <Modal
            className={`${styles.modal} ${theme === "dark" ? "darkTheme" : ""}`}
            title={
                <Space>
                    <div className={styles.modalTitle}>
                        {type ? getTitle(type2 || type, titleMap[type]) : ""}
                    </div>
                </Space>
            }
            open={visible}
            onCancel={() => onClose()}
            // transitionName="" // 这个可以让弹出的动画消失，原来这个动画是 transition 做的
            destroyOnClose
            width={'90vw'}
            footer={
                <Footer
                    visible={visible}
                    type={type}
                    activeTodo={activeTodo}
                    otherTodo={otherTodo}
                    isEditing={isEditing}
                    isEditingOther={isEditingOther}
                    onClose={onClose}
                    createCopyOrNextTask={createCopyOrNextTask}
                    setIsEditing={setIsEditing}
                    form={form}
                    otherForm={otherForm}
                    handleClose={handleClose}
                    handleAfterEditTodo={(todo: TodoItemType) => {
                        const formData = form && form.getFieldsValue();
                        // 确定刷新范围并去重
                        needFresh.current.push(
                            ...handleRefreshList(formData).concat(
                                handleRefreshList(activeTodo)
                            )
                        );
                        otherTodo &&
                            needFresh.current.push(
                                ...handleRefreshList(otherTodo)
                            );
                        // 刷新前置 todo，因为目前前置 todo 的子 todo 会展示，也就是说正在编辑的这个 todo 目前修改了，展示也得刷新
                        otherTodo?.todo_id &&
                            refreshOtherTodoById(otherTodo?.todo_id);
                        setActiveTodo(todo);
                    }}
                    handleAfterAddTodo={(todo: TodoItemType) => {
                        const formData = form && form.getFieldsValue();
                        needFresh.current.push(...handleRefreshList(formData));
                        otherTodo &&
                            needFresh.current.push(
                                ...handleRefreshList(otherTodo)
                            );

                        // 刷新前置 todo，因为目前前置 todo 的子 todo 会展示，也就是说正在编辑的这个 todo 目前修改了，展示也得刷新
                        otherTodo?.todo_id &&
                            refreshOtherTodoById(otherTodo?.todo_id);

                        setActiveTodo(todo);

                        setType("edit");
                    }}
                    handleAfterDelete={() => {
                        needFresh.current.push(
                            ...handleRefreshList(activeTodo)
                        );
                        otherTodo &&
                            needFresh.current.push(
                                ...handleRefreshList(otherTodo)
                            );
                    }}
                    handleAfterEditOtherTodo={() => {
                        needFresh.current.push(...handleRefreshList(otherTodo));
                        setIsEditingOther(false);
                    }}
                    handleAfterOk={() => {
                        setType2(undefined);
                    }}
                >
                    {isCanShowInHomeTodo ? '当前 todo 会在 homeTodo 中展示' : ''}
                </Footer>
            }
        >
            <div className={styles.wrapper}>
                {otherTodo && (
                    <div className={`${styles.left} ScrollBar`}>
                        <OtherForm
                            otherTodo={otherTodo}
                            isEditing={isEditing}
                            isEditingOther={isEditingOther}
                            otherForm={otherForm}
                            handleIsFieldChange={() => {
                                setIsEditingOther(true);
                                setIsClose(false);
                            }}
                        />
                    </div>
                )}
                <div className={`${styles.right} ScrollBar`}>
                    <div className={styles.title}>
                        {getTitle(type2 || type, "当前 Todo：")}
                    </div>
                    {form && (
                        <TodoForm
                            form={form}
                            open={visible}
                            isFieldsChange={(changedFields) => {
                                handleJudgeIsCanShowInHomeTodo(form.getFieldsValue());
                                if (
                                    changedFields?.[0]?.name?.[0] === "other_id"
                                ) {
                                    getOtherTodoById(changedFields?.[0]?.value);
                                }
                                setIsEditing(true);
                                setIsClose(false);
                            }}
                            activeTodo={activeTodo}
                            needFocus={true}
                            leftChildren={
                                activeTodo &&
                                activeTodoChildList &&
                                activeTodo.child_todo_list_length && (
                                    <TodoChildList
                                        title={`下一级 todo: ${activeTodo.child_todo_list_length}`}
                                        todoChildList={activeTodoChildList}
                                        isEditing={isEditing || isEditingOther}
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
                                                    ...handleRefreshList(item)
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
    );
};

export default EditTodoModal;
