import { postHelper } from '.';

/** 用户 */
export async function postLogin(params: any): Promise<any | boolean> {
  const data = await postHelper(`/auth/login`, params);
  return data;
}