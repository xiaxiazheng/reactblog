import { getHelper } from '.';

/** 获取后台错误日志 */
export async function getLog() {
  const data = await getHelper(`/log`);
  return data || false;
}