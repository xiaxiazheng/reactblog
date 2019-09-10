// 后台启动的服务地址
import { baseUrl } from '../config';
import { axiosGetHelper, axiosPostHelper } from './ClientHelper';

/** 操作日志 */
export async function getLogAllClass(): Promise<any> {
  const data = await axiosGetHelper(`${baseUrl}/logallclass`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getHomeLogAllClass(): Promise<any> {
  const data = await axiosGetHelper(`${baseUrl}/homelogallclass`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getLogListAll(params: any): Promise<any> {
  const data = await axiosPostHelper(`${baseUrl}/loglistall`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getLogListIsVisible(params: any): Promise<any> {
  const data = await axiosPostHelper(`${baseUrl}/loglistisvisible`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function searchHomeTree(params: any): Promise<any[]> {
  const data = await axiosPostHelper(`${baseUrl}/searchhomelog`, params);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function searchAdminTree(params: any): Promise<any[]> {
  const data = await axiosPostHelper(`${baseUrl}/searchadminlog`, params);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function editClassName(params: any): Promise<any> {
  const data = await axiosPostHelper(`${baseUrl}/editclassname`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function switchLogClass(params: any): Promise<any> {
  const data = await axiosPostHelper(`${baseUrl}/switchlogclass`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function isStickLog(params: any): Promise<any> {
  const data = await axiosPostHelper(`${baseUrl}/issticklog`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function isShowLog(params: any): Promise<any> {
  const data = await axiosPostHelper(`${baseUrl}/isshowlog`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function getLogCont(id: string): Promise<any> {
  const data = await axiosGetHelper(`${baseUrl}/logcont?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addLogCont(params: any): Promise<boolean> {
  const data = await axiosPostHelper(`${baseUrl}/addlogcont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function modifyLogCont(params: any): Promise<string | false> {
  const data = await axiosPostHelper(`${baseUrl}/modifylogcont`, params);
  return data && data.resultsCode === 'success' ? data.message : false;
}

export async function deleteLogCont(params: any): Promise<boolean> {
  const data = await axiosPostHelper(`${baseUrl}/deletelogcont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}