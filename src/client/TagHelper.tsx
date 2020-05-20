import { getHelper, postHelper } from '.';

/** 操作 tag */
export async function getAllLogTags(): Promise<any> {
  const data = await getHelper(`/getAllLogTags`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getShowLogTags(username: string): Promise<any> {
  const data = await getHelper(`/getShowLogTags?username=${username}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addTag(params: any): Promise<any> {
  const data = await postHelper(`/addTag`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function updateTag(params: any): Promise<any> {
  const data = await postHelper(`/updateTag`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function deleteTag(params: any): Promise<any> {
  const data = await postHelper(`/deleteTag`, params);
  return data && data.resultsCode === 'success' ? true : false;
}