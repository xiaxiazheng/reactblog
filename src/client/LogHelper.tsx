import { getHelper, postHelper } from '.';

/** 操作日志 */
export async function getAllLogList(params: any): Promise<any> {
  const data = await postHelper(`/getAllLogList`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getLogListIsVisible(params: any): Promise<any> {
  const data = await postHelper(`/loglistisvisible`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
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

export async function addVisits(params: any): Promise<any> {
  const data = await postHelper(`/addVisits`, params);
  return data && data.resultsCode === 'success' ? data : false;
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

export async function makeLogTag(params: any): Promise<any> {
  const data = await postHelper(`/makeLogTag`, params);
  return data && data.resultsCode === 'success' ? true : false;
}