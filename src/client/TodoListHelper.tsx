import { CreateTodoItemReq, EditTodoItemReq } from "@/views/todo-list/types";
import { getHelper, postHelper } from ".";

/** 获取列表 */
export async function getTodoList(params: any): Promise<any> {
    const data = await postHelper(`/todo/getTodoList`, params);
    return data && data.resultsCode === "success" ? data : false;
}

export async function getTodoByIdList(params: any): Promise<any> {
    const data = await postHelper(`/todo/getTodoByIdList`, params);
    return data && data.resultsCode === "success" ? data : false;
}

export async function getTodoDoneCountList(params: any): Promise<any> {
    const data = await postHelper(`/todo/getTodoDoneCountList`, params);
    return data && data.resultsCode === "success" ? data : false;
}

/** 获取类别 */
export async function getTodoCategory(params?: {
    isNote?: string;
}): Promise<any> {
    const data = await getHelper(
        `/todo/getTodoCategory${
            typeof params?.isNote === "undefined"
                ? ""
                : `?isNote=${params.isNote}`
        }`
    );
    return data && data.resultsCode === "success" ? data : false;
}

/** 获取单个 todo */
export async function getTodoById(
    todo_id: string,
    isFindAllLevelChild: boolean = false
): Promise<any> {
    const data = await getHelper(
        `/todo/getTodoById?todo_id=${todo_id}${
            isFindAllLevelChild
                ? `&isFindAllLevelChild=${isFindAllLevelChild}`
                : ""
        }`
    );
    return data && data.resultsCode === "success" ? data : false;
}

/** 获取所有前置 todo，根据 other_id 一路往上查 */
export async function getTodoChainById(todo_id: string): Promise<any> {
    const data = await getHelper(`/todo/getTodoChainById?todo_id=${todo_id}`);
    return data && data.resultsCode === "success" ? data : false;
}

/** 完成 todo */
export async function doneTodoItem(params: any): Promise<any> {
    const data = await postHelper(`/todo/doneTodoItem`, params);
    return data && data.resultsCode === "success" ? data : false;
}

/** 新增 todo */
export async function addTodoItem(params: CreateTodoItemReq): Promise<any> {
    const data = await postHelper(`/todo/addTodoItem`, params);
    return data && data.resultsCode === "success" ? data : false;
}

/** 编辑 todo */
export async function editTodoItem(params: EditTodoItemReq): Promise<any> {
    const data = await postHelper(`/todo/editTodoItem`, params);
    return data && data.resultsCode === "success" ? data : false;
}

/** 删除 todo */
export async function deleteTodoItem(params: any): Promise<any> {
    const data = await postHelper(`/todo/deleteTodoItem`, params);
    return data && data.resultsCode === "success" ? data : false;
}
