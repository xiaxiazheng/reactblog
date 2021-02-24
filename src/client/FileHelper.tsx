import { getHelper, postHelper } from '.';
import { ResType } from '.'
import axios from 'axios'

import { isDev, baseUrl, staticUrl } from '@/env_config';

export interface IFileType {
  cTime: string
  file_id: string
  filename: string
  originalname: string
  other_id: string
  type: string
  username: string
  size: string
}

export interface FileType extends IFileType {
  fileUrl: string
}

/** 操作文件 */
// 获取某个类型的文件名称列表
export async function getFileList (type: string, username: string): Promise<IFileType[]> {
  const data = await getHelper(`/getFileList?type=${type}&username=${username}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

export async function getFileListByOtherId (otherId: string, username: string): Promise<IFileType[]> {
  const data = await getHelper(`/getFileListByOtherId?otherId=${otherId}&username=${username}`);
  return data && data.resultsCode === 'success' ? data.data : [];
}

// 访问静态服务的 axios 实例
const staticInstance = axios.create({
  baseURL: `${staticUrl}/api`,
  timeout: isDev ? 5 * 1000 : 10 * 1000
})

// 删除图片，这个比较特殊要操作图片，要访问静态资源服务
export async function deleteFile (params: any): Promise<boolean> {
  const data = await postStaticHelper(`/deleteFile`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

const postStaticHelper = async (url: string, params?: any) => {
  let res: any;
  try {
    res = await staticInstance.post(url, params, {
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

// 封装 Get
// const getHelper = async (url: string) => {
//   let res: ResType;
//   try {
//     res = await instance.get(url, {
//       headers: {
//         Authorization: `Bearer ${sessionStorage.getItem("token")}`
//       },
//       // cancelToken: source.token
//     });
//   } catch (e) {
//     console.log("get请求失败", e);
//     return;
//   }
//   if (res.data.resultsCode === 'error') {
//     console.log(res.data.message);
//     return;
//   }
//   return res.data;
// };

// 封装 Post
// const postHelper = async (url: string, params?: any) => {
//   let res: any;
//   try {
//     res = await instance.post(url, params, {
//       headers: {
//         Authorization: `Bearer ${sessionStorage.getItem("token")}`
//       },
//       // cancelToken: source.token
//     });
//   } catch (e) {
//     console.log("post请求失败", e);
//     return;
//   }
//   if (res.data.resultsCode === 'error') {
//     console.log(res.data.message);
//     return;
//   }
//   return res.data;
// };