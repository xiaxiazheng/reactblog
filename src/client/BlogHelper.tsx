import { getHelper, postHelper } from '.';

/** 操作日志 */
export async function getAllBlogList(params: any): Promise<any> {
  const data = await postHelper(`/blog/getAllBlogList`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function getShowBlogList(params: any): Promise<any> {
  const data = await postHelper(`/blog/getShowBlogList`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function isStickBlog(params: any): Promise<any> {
  const data = await postHelper(`/blog/isStickBlog`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function isShowBlog(params: any): Promise<any> {
  const data = await postHelper(`/blog/isShowBlog`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function getBlogCont(id: string): Promise<any> {
  const data = await getHelper(`/blog/getBlogcont?id=${id}`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addVisits(params: any): Promise<any> {
  const data = await postHelper(`/blog/addVisits`, params);
  return data && data.resultsCode === 'success' ? data : false;
}

export async function addBlogCont(params: any): Promise<boolean> {
  const data = await postHelper(`/blog/addBlogcont`, params);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function modifyBlogCont(params: any): Promise<string | false> {
  const data = await postHelper(`/blog/modifyBlogcont`, params);
  return data && data.resultsCode === 'success' ? data.message : false;
}

export async function deleteBlogCont(params: any): Promise<boolean> {
  const data = await postHelper(`/blog/deleteBlogcont`, params);
  return data && data.resultsCode === 'success' ? true : false;
}
