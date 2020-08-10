// import { getHelper, postHelper } from '.';
import { ResType } from '.'
import axios from 'axios'

import { isDev, baseUrl } from '@/env_config';
const instance = axios.create({
  baseURL: `${baseUrl}/api`,
  timeout: isDev ? 5 * 1000 : 10 * 1000
})

/** 操作图片 */
// 获取某个类型的图片名称列表
export async function getImgList (type: string, username: string): Promise<any[]> {
  const data = await getHelper(`/getImgList?type=${type}&username=${username}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

// 获取图片的所有类型
export async function getImgTypeList (username: string): Promise<any[]> {
  const data = await getHelper(`/getImgTypeList?username=${username}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function deleteImg (params: any): Promise<boolean> {
  const data = await postHelper(`/deleteImg`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

// 封装 Get
const getHelper = async (url: string) => {
  let res: ResType;
  try {
    res = await instance.get(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      },
      // cancelToken: source.token
    });
  } catch (e) {
    console.log("get请求失败", e);
    return;
  }
  if (res.data.resultsCode === 'error') {
    console.log(res.data.message);
    return;
  }
  return res.data;
};

// 封装 Post
const postHelper = async (url: string, params?: any) => {
  let res: any;
  try {
    res = await instance.post(url, params, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      },
      // cancelToken: source.token
    });
  } catch (e) {
    console.log("post请求失败", e);
    return;
  }
  if (res.data.resultsCode === 'error') {
    console.log(res.data.message);
    return;
  }
  return res.data;
};