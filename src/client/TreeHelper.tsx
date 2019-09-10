// 后台启动的服务地址
import { baseUrl } from '../config';
import { axiosGetHelper, axiosPostHelper } from './ClientHelper';

/** 操作树 */
export async function getTree(type: string): Promise<any[]> {
  const data = await axiosGetHelper(`${baseUrl}/tree?type=${type}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function searchTree(keyword: string): Promise<any[]> {
  const data = await axiosGetHelper(`${baseUrl}/searchtree?keyword=${keyword}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function getChildName(id: string): Promise<any[]> {
  const data = await axiosGetHelper(`${baseUrl}/getchildname?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function addTreeNode(params: any): Promise<boolean> {
  const data = await axiosPostHelper(`${baseUrl}/addtreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function modifyTreeNode(params: any): Promise<boolean> {
  const data = await axiosPostHelper(`${baseUrl}/modifytreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function deleteTreeNode(params: any): Promise<boolean> {
  const data = await axiosPostHelper(`${baseUrl}/deletetreenode`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeSort(params: any): Promise<boolean> {
  const data = await axiosPostHelper(`${baseUrl}/changesort`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function changeFather(params: any) {
  const data = await axiosPostHelper(`${baseUrl}/changefather`, params);
  return data && data.resultsCode === 'success' ? true : false;
}