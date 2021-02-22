import { getHelper, postHelper } from '.';

/** 操作日志 */
export async function getAllBlogList(params: any): Promise<any> {
  const data = await postHelper(`/getAllBlogList`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getVisiableBlogList(params: any): Promise<any> {
  const data = await postHelper(`/getVisiableBlogList`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function isStickBlog(params: any): Promise<any> {
  const data = await postHelper(`/isStickBlog`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function isShowBlog(params: any): Promise<any> {
  const data = await postHelper(`/isShowBlog`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function getBlogCont(id: string): Promise<any> {
  const data = await getHelper(`/getBlogcont?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addVisits(params: any): Promise<any> {
  const data = await postHelper(`/addVisits`, params);
  return data && data.resultsCode === 'success' ? data : false;
}

export async function addBlogCont(params: any): Promise<boolean> {
  const data = await postHelper(`/addBlogcont`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function modifyBlogCont(params: any): Promise<string | false> {
  const data = await postHelper(`/modifyBlogcont`, params);
  return data && data.resultsCode === 'success' ? data.message : false;
}

export async function deleteBlogCont(params: any): Promise<boolean> {
  const data = await postHelper(`/deleteBlogcont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function makeBlogTag(params: any): Promise<any> {
  const data = await postHelper(`/makeBlogTag`, params);
  return data && data.resultsCode === 'success' ? true : false;
}