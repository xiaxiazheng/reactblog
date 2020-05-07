import { getHelper, postHelper } from '.';

/** 视频 */
// 获取音乐列表
export async function getMusicList (): Promise<any[]> {
  const data = await getHelper(`/getMusicList`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

// 获取视频列表
export async function getVideoList (): Promise<any[]> {
  const data = await getHelper(`/getVideoList`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

