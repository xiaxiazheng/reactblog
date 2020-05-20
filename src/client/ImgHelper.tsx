import { getHelper, postHelper } from '.';

/** 操作图片 */
// 获取某个类型的图片名称列表
export async function getImgList (type: string, username: string): Promise<any[]> {
  const data = await getHelper(`/getimglist?type=${type}&username=${username}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function deleteImg (params: any): Promise<boolean> {
  const data = await postHelper(`/deleteimg`, params);
  return data && data.resultsCode === 'success' ? true : false;
}
