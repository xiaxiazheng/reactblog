// 前端访问路径及所在环境
let host: string = "https://www.xiaxiazheng.cn";
let url: string = `${host}`;
export const cdnUrl = 'http://cdn.xiaxiazheng.cn';
// 静态资源服务器
let staticurl = `${host}/static-server`

// 接本地后台 300 接口
if (process.env.REACT_APP_IS_LocalHost && process.env.REACT_APP_IS_LocalHost === "yes") {
  host = "http://localhost";
  url = `${host}:300`;
}

// 接本地静态资源服务 2333 接口
if (process.env.REACT_APP_IS_LOCALSTATIC && process.env.REACT_APP_IS_LOCALSTATIC === "yes") {
  host = "http://localhost";
  staticurl = `${host}:2333`;
}

export const isDev = process.env.NODE_ENV === 'development';
export const baseUrl = url;
export const staticUrl = staticurl;