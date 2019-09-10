// 后台启动的服务地址
import { baseUrl } from '../config';
import { axiosGetHelper, axiosPostHelper } from './ClientHelper';

/** 操作节点 */
// 操作子节点内容
export async function getNodeCont(id: any): Promise<any> {
  const data = await axiosGetHelper(`${baseUrl}/cont?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getAllCont(params: any): Promise<any> {
  const data = await axiosPostHelper(`${baseUrl}/allcont`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getAlmostCont(params: any): Promise<any> {
  const data = await axiosPostHelper(`${baseUrl}/almostcont`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addNodeCont(params: any): Promise<boolean> {
  const data = await axiosPostHelper(`${baseUrl}/addnodecont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function modifyNodeCont(params: any): Promise<any> {
  const data = await axiosPostHelper(`${baseUrl}/modifynodecont`, params);
  return data && data.resultsCode === 'success' ? data.message : false;
}

export async function deleteNodeCont(params: any): Promise<boolean> {
  const data = await axiosPostHelper(`${baseUrl}/deletenodecont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeContSort(params: any): Promise<boolean> {
  const data = await axiosPostHelper(`${baseUrl}/changecontsort`, params);
  return data && data.resultsCode === 'success' ? true : false;
}