// 前端访问路径及所在环境
let host: string = "https://www.xiaxiazheng.cn";
let url: string = `${host}:3000`;

let nav: string = 'XIAXIAZheng';

// 接本地后台 300 接口
if (process.env.REACT_APP_IS_LocalHost && process.env.REACT_APP_IS_LocalHost === "yes") {
  host = "http://localhost";
  url = `${host}:300`;
} else {
  if (process.env.REACT_APP_User && process.env.REACT_APP_User === 'hyp') {
    nav = '燕苹的小站';
    url = `${host}:5180`;
  }
}

export const appUser = process.env.REACT_APP_User === 'hyp' ? 'hyp' : 'zyb';
export const baseImgUrl = url;
export const baseUrl = `${url}/back`;
export const navTitle = nav;