import React from "react";
import styles from "./index.module.scss";
import { deleteNote } from "@/client/NoteHelper";
import { Button, message, Popconfirm, Modal, Tooltip } from "antd";
import { handleNote } from "../utils";
import ImgFileNoteList from "../img-file-note-list";
import { NoteType } from "../types";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { CreateTodoItemReq, TodoStatus } from "@/views/todo-list/types";
import dayjs from "dayjs";
import { addTodoItem } from "@/client/TodoListHelper";

interface IProps {
    visible: boolean;
    activeNote: NoteType | undefined;
    onCancel: Function;
    handleDelete: Function;
    handleEdit: Function;
    refreshData: Function;
}

const NoteDetailModal: React.FC<IProps> = (props) => {
    const {
        visible,
        activeNote,
        onCancel,
        handleDelete,
        handleEdit,
        refreshData,
    } = props;

    const addTodo = async (item: NoteType) => {
        const req: CreateTodoItemReq = {
            name: item.note.split("\n")?.[0],
            time: dayjs(item.cTime).format("YYYY-MM-DD"),
            status: TodoStatus.done,
            description: item.note.split("\n")?.slice(1)?.join("\n") || "",
            color: "2",
            category: item.category,
            other_id: "",
            doing: "0",
            isNote: "1",
            isTarget: "0",
            isBookMark: "0",
        };
        await addTodoItem(req);
        message.success("迁移成功, 若有图片需手动处理");
    };

    const onDelete = async () => {
        if (activeNote?.imgList.length !== 0) {
            message.warning("图片不为空，不能删除");
            return false;
        }
        const params = {
            note_id: activeNote?.note_id,
        };
        await deleteNote(params);
        message.success("删除 note 成功");
        handleDelete();
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
                                <div>创建时间：{activeNote?.cTime}</div>
                                <div>编辑时间：{activeNote?.mTime}</div>
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
                        danger
                        onClick={() => {
                            activeNote && addTodo(activeNote);
                        }}
                    >
                        迁移到 todo-note
                    </Button>
                    <Button
                        className={styles.copy_note}
                        onClick={() => {
                            handleCopy(activeNote?.note || "");
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
                <span className={styles.category}>{activeNote?.category}</span>
                <span>{handleNote(activeNote, "")}</span>
                <ImgFileNoteList
                    activeNote={activeNote}
                    width="140px"
                    refreshData={refreshData}
                />
            </div>
        </Modal>
    );
};

export default NoteDetailModal;
