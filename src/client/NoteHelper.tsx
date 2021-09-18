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
export async function addNote(params: any): Promise<any> {
    const data = await postHelper(`/note/addNote`, params);
    return data && data.resultsCode === "success" ? data : false;
}

/** 编辑 note */
export async function editNote(params: any): Promise<any> {
    const data = await postHelper(`/note/editNote`, params);
    return data && data.resultsCode === "success" ? data : false;
}

/** 删除 note */
export async function deleteNote(params: any): Promise<any> {
    const data = await postHelper(`/note/deleteNote`, params);
    return data && data.resultsCode === "success" ? data : false;
}
