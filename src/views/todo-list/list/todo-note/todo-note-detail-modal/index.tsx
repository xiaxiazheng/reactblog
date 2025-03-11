import React, { useContext, useState } from "react";
import styles from "./index.module.scss";
import { Button, message, Popconfirm, Modal, Tooltip } from "antd";
import TodoImageFile from "../../../component/todo-image-file";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { TodoItemType } from "@/views/todo-list/types";
import { deleteTodoItem } from "@/client/TodoListHelper";
import TodoItemName, { renderDescription } from "@/views/todo-list/component/todo-item/todo-item-name";
import { ThemeContext } from "@/context/ThemeContext";
import CopyButton from "@/components/copy-button";
import MarkdownShow from "@/views/blog/blog-cont/markdown-show";

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

    return (
        <Modal
            title={
                <div className={styles.title}>
                    {activeTodo && <TodoItemName item={activeTodo} />}
                    &nbsp;
                    <Tooltip
                        placement="bottom"
                        title={
                            <>
                                <div>time: {activeTodo?.time}</div>
                                <div>创建时间：{activeTodo?.cTime}</div>
                                <div>编辑时间：{activeTodo?.mTime}</div>
                            </>
                        }
                    >
                        <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                    </Tooltip>
                </div>
            }
            open={visible}
            onCancel={() => onCancel()}
            width={"auto"}
            closable={false}
            className={`${styles.modal} ${theme === "dark" ? "darkTheme" : ""}`}
            footer={
                <>
                    <CopyButton
                        className={styles.copy_note}
                        text={
                            `${activeTodo?.name}\n${activeTodo?.description}` ||
                            ""
                        }
                    >
                        复制内容
                    </CopyButton>
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
                    {/* {activeTodo && renderDescription(activeTodo.description)} */}
                    {activeTodo?.description && <MarkdownShow blogcont={activeTodo.description} />}
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
