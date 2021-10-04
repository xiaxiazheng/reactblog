import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { CategoryType, NoteType } from "../types";
import ImageBox from '@/components/image-box';
import { ImgType } from "@/client/ImgHelper";
import { staticUrl } from "@/env_config";
import { getNoteById } from '@/client/NoteHelper';

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
            <ImageBox
                otherId={activeNote?.note_id}
                type="note"
                imageUrl=""
                imageMinUrl=""
                initImgList={getNote}
                width="120px"
                imageData={{}}
            />
            {/* 图片列表 */}
            {note?.imgList?.map((jtem: ImgType) => {
                return (
                    <ImageBox
                        key={jtem.img_id}
                        type="note"
                        imageId={jtem.img_id}
                        imageName={jtem.imgname}
                        imageFileName={jtem.filename}
                        imageUrl={`${staticUrl}/img/note/${jtem.filename}`}
                        imageMinUrl={
                            jtem.has_min === "1"
                                ? `${staticUrl}/min-img/${jtem.filename}`
                                : `${staticUrl}/img/note/${jtem.filename}`
                        }
                        initImgList={getNote}
                        width="120px"
                        imageData={jtem}
                    />
                );
            })}
        </Modal>
    );
};

export default ImgNoteModal;
