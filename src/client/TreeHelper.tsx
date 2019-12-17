import { getHelper, postHelper } from './ClientHelper';

/** 操作树 */
export async function getTree(type: string): Promise<any[]> {
  const data = await getHelper(`/tree?type=${type}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function searchTree(keyword: string): Promise<any[]> {
  const data = await getHelper(`/searchtree?keyword=${keyword}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function getChildName(id: string): Promise<any[]> {
  const data = await getHelper(`/getchildname?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function addTreeNode(params: any): Promise<boolean> {
  const data = await postHelper(`/addtreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function modifyTreeNode(params: any): Promise<boolean> {
  const data = await postHelper(`/modifytreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function deleteTreeNode(params: any): Promise<boolean> {
  const data = await postHelper(`/deletetreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeSort(params: any): Promise<boolean> {
  const data = await postHelper(`/changesort`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeFather(params: any) {
  const data = await postHelper(`/changefather`, params);
  return data && data.resultsCode === 'success' ? true : false;
}