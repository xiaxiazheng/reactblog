
import { ImageType } from "@/client/ImgHelper";

export type NoteType = {
    note_id: string;
    note: string;
    cTime: string;
    mTime: string;
    username: string;
    category: string;
    imgList: ImageType[];

    noteNode?: any;  // 这个是添加了关键字高亮和解析了 url 的 react 节点
}

const obj2 = {
    category: "其他",
    count: "12",
};
export type CategoryType = typeof obj2;
