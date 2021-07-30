import { getHelper, postHelper } from '.';

/** 操作树 */
export async function getShowTreeList(username: string): Promise<any[]> {
  const data = await getHelper(`/tree/getShowTreeList?username=${username}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getAllTreeList(): Promise<any[]> {
  const data = await getHelper(`/tree/getAllTreeList`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function searchTree(keyword: string): Promise<any[]> {
  const data = await getHelper(`/tree/searchtree?keyword=${keyword}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getChildName(id: string): Promise<any> {
  const data = await getHelper(`/tree/getchildname?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addTreeNode(params: any): Promise<boolean> {
  const data = await postHelper(`/tree/addtreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function modifyTreeNode(params: any): Promise<boolean> {
  const data = await postHelper(`/tree/modifytreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function deleteTreeNode(params: any): Promise<boolean> {
  const data = await postHelper(`/tree/deletetreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeSort(params: any): Promise<boolean> {
  const data = await postHelper(`/tree/changesort`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeFather(params: any) {
  const data = await postHelper(`/tree/changefather`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function updateIsShow(params: any) {
  const data = await postHelper(`/tree/updateIsShow`, params);
  return data && data.resultsCode === 'success' ? true : false;
}