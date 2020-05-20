// 前端访问路径及所在环境
let host: string = "https://www.xiaxiazheng.cn";
let url: string = `${host}`;
const staticurl = `${host}:2333`

let nav: string = 'XIAXIAZheng';

// 接本地后台 300 接口
if (process.env.REACT_APP_IS_LocalHost && process.env.REACT_APP_IS_LocalHost === "yes") {
  host = "http://localhost";
  url = `${host}:300`;
}

export const isDev = process.env.NODE_ENV === 'development';
export const baseUrl = url;
export const staticUrl = staticurl;
export const navTitle = nav;