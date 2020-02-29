import { getHelper, postHelper } from '.';

/** 操作日志 */
export async function getLogAllClass(): Promise<any> {
  const data = await getHelper(`/logallclass`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getHomeLogAllClass(): Promise<any> {
  const data = await getHelper(`/homelogallclass`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getLogListAll(params: any): Promise<any> {
  const data = await postHelper(`/loglistall`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getLogListIsVisible(params: any): Promise<any> {
  const data = await postHelper(`/loglistisvisible`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function searchHomeTree(params: any): Promise<any[]> {
  const data = await postHelper(`/searchhomelog`, params);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function searchAdminTree(params: any): Promise<any[]> {
  const data = await postHelper(`/searchadminlog`, params);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function editClassName(params: any): Promise<any> {
  const data = await postHelper(`/editclassname`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function switchLogClass(params: any): Promise<any> {
  const data = await postHelper(`/switchlogclass`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function isStickLog(params: any): Promise<any> {
  const data = await postHelper(`/issticklog`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function isShowLog(params: any): Promise<any> {
  const data = await postHelper(`/isshowlog`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function getLogCont(id: string): Promise<any> {
  const data = await getHelper(`/logcont?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addLogCont(params: any): Promise<boolean> {
  const data = await postHelper(`/addlogcont`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function modifyLogCont(params: any): Promise<string | false> {
  const data = await postHelper(`/modifylogcont`, params);
  return data && data.resultsCode === 'success' ? data.message : false;
}

export async function deleteLogCont(params: any): Promise<boolean> {
  const data = await postHelper(`/deletelogcont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}