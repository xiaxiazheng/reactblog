import { getHelper, postHelper } from ".";

/** 获取列表 */
export async function getNoteList(params: any): Promise<any> {
    const data = await postHelper(`/note/getNoteList`, params);
    return data && data.resultsCode === "success" ? data : false;
}

/** 获取类别 */
export async function getNoteCategory(): Promise<any> {
    const data = await getHelper(`/note/getNoteCategory`);
    return data && data.resultsCode === "success" ? data : false;
}

/** 新增 note */
export async function addNoteItem(params: any): Promise<any> {
    const data = await postHelper(`/note/addNoteItem`, params);
    return data && data.resultsCode === "success" ? data : false;
}

/** 编辑 note */
export async function editNoteItem(params: any): Promise<any> {
    const data = await postHelper(`/note/editNoteItem`, params);
    return data && data.resultsCode === "success" ? data : false;
}

/** 删除 note */
export async function deleteNoteItem(params: any): Promise<any> {
    const data = await postHelper(`/note/deleteNoteItem`, params);
    return data && data.resultsCode === "success" ? data : false;
}
