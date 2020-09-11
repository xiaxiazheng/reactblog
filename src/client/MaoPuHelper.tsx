import { getHelper, postHelper } from '.';

/** 操作猫谱 */
export async function getMaoPuList(): Promise<any> {
  const data = await getHelper(`/getMaoPuList`);
  return data && data.resultsCode === 'success' ? data.data : false;
}