import { getHelper, postHelper } from './ClientHelper';

/** 操作节点 */
// 操作子节点内容
export async function getNodeCont(id: any): Promise<any> {
  const data = await getHelper(`/cont?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getAllCont(params: any): Promise<any> {
  const data = await postHelper(`/allcont`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getAlmostCont(params: any): Promise<any> {
  const data = await postHelper(`/almostcont`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addNodeCont(params: any): Promise<boolean> {
  const data = await postHelper(`/addnodecont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function modifyNodeCont(params: any): Promise<any> {
  const data = await postHelper(`/modifynodecont`, params);
  return data && data.resultsCode === 'success' ? data.message : false;
}

export async function deleteNodeCont(params: any): Promise<boolean> {
  const data = await postHelper(`/deletenodecont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeContSort(params: any): Promise<boolean> {
  const data = await postHelper(`/changecontsort`, params);
  return data && data.resultsCode === 'success' ? true : false;
}