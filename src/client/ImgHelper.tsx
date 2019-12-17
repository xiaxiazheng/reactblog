import { getHelper, postHelper } from './ClientHelper';

/** 操作图片 */
// 获取某个类型的图片名称列表
export async function getImgList (type: string): Promise<any[]> {
  const data = await getHelper(`/getimglist?type=${type}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function deleteImg (params: any): Promise<boolean> {
  const data = await postHelper(`/deleteimg`, params);
  return data && data.resultsCode === 'success' ? true : false;
}
