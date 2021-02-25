import { getHelper, postHelper } from ".";
import { ResType } from ".";
import axios from "axios";

import { isDev, baseUrl, staticUrl } from "@/env_config";

// 从接口拿到的数据类型
export interface IImageType {
  cTime: string;
  filename: string;
  has_min: "0" | "1"; // 是否有缩略图
  img_id: string;
  imgname: string;
  other_id: string;
  type: string;
  username: string;
  size: string;
}

// 项目中使用的稍微拓展过的类型
export interface ImgType extends IImageType {
  imageMinUrl: string;
  imageUrl: string;
}

/** 操作图片 */
// 获取某个类型的图片名称列表
export async function getImgList(
  type: string,
  username: string
): Promise<IImageType[]> {
  const data = await getHelper(`/getImgList?type=${type}&username=${username}`);
  return data && data.resultsCode === "success" ? data.data : [];
}

export async function getImgListByOtherId(
  otherId: string,
  username: string
): Promise<IImageType[]> {
  const data = await getHelper(
    `/getImgListByOtherId?otherId=${otherId}&username=${username}`
  );
  return data && data.resultsCode === "success" ? data.data : [];
}

// 获取图片的所有类型
export async function getImgTypeList(username: string): Promise<string[]> {
  const data = await getHelper(`/getImgTypeList?username=${username}`);
  return data && data.resultsCode === "success" ? data.data : [];
}

export async function switchImgOtherId (params: any): Promise<any> {
  const data = await postHelper(`/switchImgOtherId`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

// 访问静态服务的 axios 实例
const staticInstance = axios.create({
  baseURL: `${staticUrl}/api`,
  timeout: isDev ? 5 * 1000 : 10 * 1000,
});

// 删除图片，这个比较特殊要操作图片，要访问静态资源服务
export async function deleteImg(params: any): Promise<boolean> {
  const data = await postStaticHelper(`/deleteImg`, params);
  return data && data.resultsCode === "success" ? true : false;
}

const postStaticHelper = async (url: string, params?: any) => {
  let res: any;
  try {
    res = await staticInstance.post(url, params, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      // cancelToken: source.token
    });
  } catch (e) {
    console.log("post请求失败", e);
    return;
  }
  if (res.data.resultsCode === "error") {
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
