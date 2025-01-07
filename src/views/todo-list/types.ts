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
    isKeyNode?: "0" | "1";
    isFollowUp?: "0" | "1";

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
    isKeyNode: "0" | "1";
    isFollowUp: "0" | "1";
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export type EditTodoItemReq = Merge<CreateTodoItemReq, {
    todo_id: string;
    isNote?: "0" | "1";
    isTarget?: "0" | "1";
    isWork?: "0" | "1";
    isBookMark?: "0" | "1";
    isHabit?: "0" | "1";
    isKeyNode?: "0" | "1";
    isFollowUp?: "0" | "1";
}>

export type StatusType = "todo" | "done" | "target" | "bookMark" | "note" | "habit" | "followUp";
export enum TodoStatus {
    todo = 0,
    done = 1,
}
export const TodoStatusMap: any = {
    [TodoStatus.todo]: 'todo',
    [TodoStatus.done]: 'done',
}

export type OperatorType = "add" | "edit";
export type OperatorType2 = "add_progress" | "copy" | "add_child";

const obj2 = {
    category: "个人",
    count: "12",
};
export type CategoryType = typeof obj2;
