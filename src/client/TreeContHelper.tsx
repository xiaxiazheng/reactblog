import { getHelper, postHelper } from '.';

/** 操作节点 */
// 操作子节点内容
export async function getNodeCont(id: any): Promise<any> {
  const data = await getHelper(`/treeCont/cont?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addNodeCont(params: any): Promise<boolean> {
  const data = await postHelper(`/treeCont/addnodecont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function modifyNodeCont(params: any): Promise<any> {
  const data = await postHelper(`/treeCont/modifynodecont`, params);
  return data && data.resultsCode === 'success' ? data.message : false;
}

export async function deleteNodeCont(params: any): Promise<boolean> {
  const data = await postHelper(`/treeCont/deleteNodeCont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeContSort(params: any): Promise<boolean> {
  const data = await postHelper(`/treeCont/changecontsort`, params);
  return data && data.resultsCode === 'success' ? true : false;
}