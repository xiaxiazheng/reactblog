import { postHelper } from '.';

/** 操作歌曲播放次数 */
export async function timesofSongAddOne(params: any): Promise<any> {
  const data = await postHelper(`/timeofsong/timesofSongAddOne`, params);
  return data && data.resultsCode === 'success' ? data : false;
}
