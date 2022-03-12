import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { NoteType } from "../types";
import ImageListBox from '@/components/file-image-handle/image-list-box';
import { getNoteById } from '@/client/NoteHelper';
import FileImageUpload from "@/components/file-image-handle/file-image-upload";

interface Props {
    visible: boolean;
    activeNote?: NoteType;
    onCancel: Function;
    refreshData: Function;
}

const ImgNoteModal: React.FC<Props> = (props) => {
    const { visible, activeNote, onCancel, refreshData } = props;

    useEffect(() => {
        activeNote && setNote(activeNote);
    }, [activeNote]);

    const [note, setNote] = useState<NoteType>();
    const getNote = async () => {
        if (activeNote?.note_id) {
            const res = await getNoteById(activeNote.note_id);
            setNote(res.data);
            // 这边数据改变之后要刷新外部的数据，避免下次进来数据有问题
            refreshData();
        }
    }

    return (
        <Modal
            visible={visible}
            title={"处理 note 图片"}
            onCancel={() => onCancel()}
            footer={<></>}
            getContainer={false}
        >
            {/* 上传组件 */}
            <FileImageUpload
                other_id={activeNote?.note_id}
                type="note"
                refresh={getNote}
                width="120px"
            />
            {/* 图片列表 */}
            <ImageListBox
                type="note"
                imageList={note?.imgList || []}
                refresh={getNote}
                width="120px"
            />
        </Modal>
    );
};

export default ImgNoteModal;
