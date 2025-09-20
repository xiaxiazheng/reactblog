import { getHelper, postHelper } from '.';

// 获取七牛文件列表
export async function getMediaList (): Promise<any[]> {
  const data = await getHelper(`/media/getMediaList`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

