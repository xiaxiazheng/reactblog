import { postHelper } from './ClientHelper';

/** 用户 */
export async function postLogin(params: any): Promise<boolean> {
  const data = await postHelper(`/login`, params);
  return data && data.resultsCode === 'success' ? true : false;
}