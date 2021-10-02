
import { ImgType } from "@/client/ImgHelper";

export type NoteType = {
    note_id: string;
    note: string;
    cTime: string;
    mTime: string;
    username: string;
    category: string;
    imgList: ImgType[]
}

const obj2 = {
    category: "其他",
    count: "12",
};
export type CategoryType = typeof obj2;
