import { getHelper, postHelper } from '.';

/** 操作 tag */
export async function getAllBlogTags(): Promise<any> {
  const data = await getHelper(`/tag/getAllBlogTags`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getShowBlogTags(username: string): Promise<any> {
  const data = await getHelper(`/tag/getShowBlogTags?username=${username}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addTag(params: any): Promise<any> {
  const data = await postHelper(`/tag/addTag`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function updateTag(params: any): Promise<any> {
  const data = await postHelper(`/tag/updateTag`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function deleteTag(params: any): Promise<any> {
  const data = await postHelper(`/tag/deleteTag`, params);
  return data && data.resultsCode === 'success' ? true : false;
}