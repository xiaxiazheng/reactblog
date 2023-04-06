import React, { useContext, useState } from "react";
import styles from "./index.module.scss";
import { Button, message, Popconfirm, Modal, Tooltip } from "antd";
import TodoImageFile from "../../component/todo-image-file";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { TodoItemType } from "@/views/todo-list/types";
import { deleteTodoItem } from "@/client/TodoListHelper";
import { renderDescription } from "@/views/todo-list/component/todo-item/todo-item-name";
import { ThemeContext } from "@/context/ThemeContext";

interface IProps {
    visible: boolean;
    activeTodo: TodoItemType | undefined;
    onCancel: Function;
    handleEdit: Function;
    refreshData: Function;
}

const TodoNoteDetailModal: React.FC<IProps> = (props) => {
    const { visible, activeTodo, onCancel, handleEdit, refreshData } = props;

    const { theme } = useContext(ThemeContext);

    // const onDelete = async () => {
    //     if (activeTodo?.imgList.length !== 0) {
    //         message.warning("图片不为空，不能删除");
    //         return false;
    //     }
    //     const params = {
    //         todo_id: activeTodo?.todo_id,
    //     };
    //     await deleteTodoItem(params);
    //     message.success("删除 note 成功");
    //     refreshData();
    //     onCancel();
    // };

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
                    <span className={styles.category}>
                        {activeTodo?.category}
                    </span>
                    <span>{activeTodo?.name}</span>
                    <span>({activeTodo?.time})</span>
                    &nbsp;
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
            open={visible}
            onCancel={() => onCancel()}
            width={"auto"}
            closable={false}
            className={`${styles.modal} ${theme === "dark" ? "darkTheme" : ""}`}
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
                </>
            }
        >
            <div className={`${styles.note_item} ScrollBar`}>
                <div className={styles.note_content}>
                    {activeTodo && renderDescription(activeTodo.description)}
                </div>
                {activeTodo && (
                    <TodoImageFile
                        todo={activeTodo}
                        width="140px"
                        handleFresh={() => refreshData()}
                    />
                )}
            </div>
        </Modal>
    );
};

export default TodoNoteDetailModal;
