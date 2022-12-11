import { ImageType } from "@/client/ImgHelper";
import { FileType } from "@/client/FileHelper";

export interface TodoItemType {
    todo_id: string;
    time: string;
    description: string;
    name: string;
    status: number | string;
    color: string;
    category: string;
    other_id?: string;
    cTime?: string;
    doing: "0" | "1";
    mTime?: string;
    isNote?: "0" | "1";

    imgList: ImageType[];
    fileList: FileType[];
    other_todo: TodoItemType;
    child_todo_list: TodoItemType[];
    child_todo_list_length: number;
}

export interface CreateTodoItemReq {
    time: string;
    description: string;
    name: string;
    status: number | string;
    color: string;
    category: string;
    other_id?: string;
    doing: "0" | "1";
    isNote: "0" | "1";
}

export interface EditTodoItemReq extends CreateTodoItemReq {
    todo_id: string;
}

export type StatusType = "todo" | "done" | "pool";
export enum TodoStatus {
    todo = 0,
    done = 1,
    pool = 2,
}

export type OperatorType = "add" | "edit" | "add_progress" | "copy";

const obj2 = {
    category: "其他",
    count: "12",
};
export type CategoryType = typeof obj2;
