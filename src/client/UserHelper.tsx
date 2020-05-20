import { postHelper } from '.';

/** 用户 */
export async function postLogin(params: any): Promise<any | boolean> {
  const data = await postHelper(`/login`, params);
  return data && data.resultsCode === 'success' ? data : false;
}