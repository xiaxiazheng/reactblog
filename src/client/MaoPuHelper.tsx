import { getHelper, postHelper } from '.';

/** 操作猫谱 */
export async function getMaoPuList(): Promise<any> {
  const data = await getHelper(`/getMaoPuList`);
  return data && data.resultsCode === 'success' ? data.data : false;
}

export async function addMaoPu(params: any): Promise<any> {
  const data = await postHelper(`/addMaoPu`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

export async function updateMaoPu(params: any): Promise<any> {
  const data = await postHelper(`/updateMaoPu`, params);
  return data && data.resultsCode === 'success' ? true : false;
}