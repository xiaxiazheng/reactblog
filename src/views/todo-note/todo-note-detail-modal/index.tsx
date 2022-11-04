import React from "react";
import styles from "./index.module.scss";
import { Button, message, Popconfirm, Modal, Tooltip } from "antd";
import { handleNote } from "../utils";
import TodoImageFile from "../../todo-list/component/todo-image-file";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { TodoItemType } from "@/views/todo-list/types";
import { deleteTodoItem } from "@/client/TodoListHelper";

interface IProps {
    visible: boolean;
    activeTodo: TodoItemType | undefined;
    onCancel: Function;
    handleEdit: Function;
    refreshData: Function;
}

const TodoNoteDetailModal: React.FC<IProps> = (props) => {
    const { visible, activeTodo, onCancel, handleEdit, refreshData } = props;

    const onDelete = async () => {
        if (activeTodo?.imgList.length !== 0) {
            message.warning("图片不为空，不能删除");
            return false;
        }
        const params = {
            todo_id: activeTodo?.todo_id,
        };
        await deleteTodoItem(params);
        message.success("删除 note 成功");
        refreshData();
        onCancel();
    };

    const handleCopy = (content: string) => {
        const input = document.createElement("textarea");
        document.body.appendChild(input);
        input.value = content;
        input.select();
        document.execCommand("copy");
        message.success("已复制到粘贴板");
        document.body.removeChild(input);
    };

    return (
        <Modal
            title={
                <>
                    便签详情{" "}
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
            }
            visible={visible}
            onCancel={() => onCancel()}
            width={"auto"}
            className={styles.modal}
            footer={
                <>
                    <Button
                        className={styles.copy_note}
                        onClick={() => {
                            handleCopy(
                                `${activeTodo?.name}\n${activeTodo?.description}` ||
                                    ""
                            );
                        }}
                    >
                        复制内容
                    </Button>
                    <Button
                        className={styles.edit_note}
                        type="primary"
                        onClick={() => {
                            handleEdit();
                        }}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除吗？"
                        onConfirm={onDelete}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                    >
                        <Button className={styles.delete_note} danger>
                            删除
                        </Button>
                    </Popconfirm>
                </>
            }
        >
            <div className={`${styles.note_item} ScrollBar`}>
                <div>
                    <span className={styles.category}>
                        {activeTodo?.category}
                    </span>
                    <span>{activeTodo?.name}</span>
                </div>
                <div>{handleNote(activeTodo, "")}</div>
                {activeTodo && (
                    <TodoImageFile
                        isOnlyShow={true}
                        activeTodo={activeTodo}
                        width="140px"
                        refreshData={refreshData}
                    />
                )}
            </div>
        </Modal>
    );
};

export default TodoNoteDetailModal;
