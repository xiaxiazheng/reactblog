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
    isTarget?: "0" | "1";
    isWork?: "0" | "1";
    isBookMark?: "0" | "1";
    isHabit?: "0" | "1";

    imgList: ImageType[];
    fileList: FileType[];
    other_todo: TodoItemType;
    child_todo_list?: TodoItemType[];
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
    isTarget: "0" | "1";
    isWork: "0" | "1";
    isBookMark: "0" | "1";
    isHabit: "0" | "1";
}

export interface EditTodoItemReq extends CreateTodoItemReq {
    todo_id: string;
}

export type StatusType = "todo" | "done" | "pool" | "target" | "bookMark" | "note" | "hobit";
export enum TodoStatus {
    todo = 0,
    done = 1,
    pool = 2,
}
export const TodoStatusMap: any = {
    [TodoStatus.todo]: 'todo',
    [TodoStatus.done]: 'done',
    [TodoStatus.pool]: 'pool',
}

export type OperatorType = "add" | "edit";
export type OperatorType2 = "add_progress" | "copy" | "add_child";

const obj2 = {
    category: "个人",
    count: "12",
};
export type CategoryType = typeof obj2;
