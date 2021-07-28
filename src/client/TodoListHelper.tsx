import { postHelper } from ".";

/** 获取列表 */
export async function getTodoList(params: any): Promise<any> {
  const data = await postHelper(`/getTodoList`, params);
  return data && data.resultsCode === "success" ? data : false;
}

/** 完成 todo */
export async function doneTodoItem(params: any): Promise<any> {
  const data = await postHelper(`/doneTodoItem`, params);
  return data && data.resultsCode === "success" ? data : false;
}

/** 新增 todo */
export async function addTodoItem(params: any): Promise<any> {
  const data = await postHelper(`/addTodoItem`, params);
  return data && data.resultsCode === "success" ? data : false;
}

/** 编辑 todo */
export async function editTodoItem(params: any): Promise<any> {
  const data = await postHelper(`/editTodoItem`, params);
  return data && data.resultsCode === "success" ? data : false;
}

/** 删除 todo */
export async function deleteTodoItem(params: any): Promise<any> {
  const data = await postHelper(`/deleteTodoItem`, params);
  return data && data.resultsCode === "success" ? data : false;
}