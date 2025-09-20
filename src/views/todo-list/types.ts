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
