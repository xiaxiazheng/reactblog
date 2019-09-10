// 后台启动的服务地址
import { baseUrl } from '../config';
import { axiosPostHelper } from './ClientHelper';

/** 用户 */
export async function postLogin(params: any): Promise<boolean> {
  const data = await axiosPostHelper(`${baseUrl}/login`, params);
  return data && data.resultsCode === 'success' ? true : false;
}