import React, { useEffect, useState } from "react";
import { Modal, Space } from "antd";
import { NoteType } from "../types";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import FileListBox from "@/components/file-image-handle/file-list-box";
import { getNoteById } from "@/client/NoteHelper";
import FileImageUpload from "@/components/file-image-handle/file-image-upload";

interface Props {
    activeNote: NoteType | undefined;
    refreshData?: Function;
    isOnlyShow?: boolean; // 是否只展示，不上传&编辑&删除
    width?: string;
}

const ImgNoteModal: React.FC<Props> = (props) => {
    const { activeNote, refreshData, isOnlyShow = false, width } = props;

    useEffect(() => {
        activeNote && setNote(activeNote);
    }, [activeNote]);

    const [note, setNote] = useState<NoteType>();
    const getNote = async () => {
        if (activeNote?.note_id) {
            const res = await getNoteById(activeNote.note_id);
            setNote(res.data);
            // 这边数据改变之后要刷新外部的数据，避免下次进来数据有问题
            refreshData && refreshData();
        }
    };

    return (
        <>
            <div style={{ margin: "10px 0" }}>
                <Space size={10}>
                    {/* 上传组件 */}
                    {!isOnlyShow && (
                        <FileImageUpload
                            other_id={activeNote?.note_id}
                            type="note"
                            refresh={getNote}
                            width={width}
                        />
                    )}
                    {/* 图片列表 */}
                    <ImageListBox
                        imageList={note?.imgList || []}
                        width={width}
                        refresh={getNote}
                        type={"note"}
                        isOnlyShow={isOnlyShow}
                    />
                    {/* 文件列表 */}
                    <FileListBox
                        fileList={note?.fileList || []}
                        width={width}
                        refresh={getNote}
                        type={"note"}
                        isOnlyShow={isOnlyShow}
                    />
                </Space>
            </div>
        </>
    );
};

export default ImgNoteModal;
