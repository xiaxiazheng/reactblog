
import { ImageType } from "@/client/ImgHelper";

export interface TodoItemType {
    todo_id?: string;
    time: string;
    description: string;
    name: string;
    status: number | string;
    color: string;
    category: string;

    imgList: ImageType[];
}

export type StatusType = "todo" | "done" | "pool";
export enum TodoStatus {
    todo = 0,
    done = 1,
    pool = 2,
}