import { getHelper, postHelper } from ".";
import { ResType } from ".";
import axios from "axios";

import { isDev, baseUrl, staticUrl } from "@/env_config";

/** 操作文件夹 */
// 获取文件夹
export async function getFolder(
  parentId: string,
  username: string
): Promise<any[]> {
  const data = await getHelper(
    `/folder/getFolder?parentId=${parentId}&username=${username}`
  );
  return data && data.resultsCode === "success" ? data.data : [];
}

// 获取所有文件夹（树状）
export async function getAllFolder(username: string): Promise<any> {
  const data = await getHelper(`/folder/getAllFolder?username=${username}`);
  return data && data.resultsCode === "success" ? data.data : [];
}

// 新增文件夹
export async function addFolder(params: any): Promise<any> {
  const data = await postHelper(`/folder/addFolder`, params);
  return data && data.resultsCode === "success" ? data : false;
}

// 文件夹改名
export async function updateFolderName(params: any): Promise<any> {
  const data = await postHelper(`/folder/updateFolderName`, params);
  return data && data.resultsCode === "success" ? data : false;
}

export async function switchFolderParent (params: any): Promise<any> {
  const data = await postHelper(`/folder/switchFolderParent`, params);
  return data && data.resultsCode === 'success' ? true : false;
}

// 删除文件夹
export async function deleteFolder(params: any): Promise<any> {
  const data = await postHelper(`/folder/deleteFolder`, params);
  return data && data.resultsCode === "success" ? data : false;
}
