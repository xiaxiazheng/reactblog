import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { getNoteList, getNoteCategory, deleteNote } from "@/client/NoteHelper";
import {
    Input,
    Radio,
    Pagination,
    Empty,
    Button,
    message,
    Popconfirm,
    Spin,
    Modal,
} from "antd";
import { handleNote } from "../utils";
import ImgFileNoteList from "../img-file-note-list";
import { NoteType } from "../types";

interface IProps {
    visible: boolean;
    activeNote: NoteType | undefined;
    onCancel: Function;
    handleDelete: Function;
    handleEdit: Function;
}

const NoteDetailModal: React.FC<IProps> = (props) => {
    const { visible, activeNote, onCancel, handleDelete, handleEdit } = props;

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

    return (
        <Modal
            title="便签详情"
            visible={visible}
            onCancel={() => onCancel()}
            width={"auto"}
            footer={
                <>
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
            <div className={`${styles.note_item} ${styles.active} ScrollBar`}>
                <span className={styles.category}>{activeNote?.category}</span>
                <span>{handleNote(activeNote, "")}</span>
                <ImgFileNoteList
                    isOnlyShow={true}
                    activeNote={activeNote}
                    width="140px"
                />
            </div>
        </Modal>
    );
};

export default NoteDetailModal;
