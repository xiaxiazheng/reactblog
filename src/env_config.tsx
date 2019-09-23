// 前端访问路径及所在环境
let host: string = "http://www.xiaxiazheng.cn";
let url: string = `${host}:3000`;
// let host: string = "http://localhost";
// let url: string = `${host}:300`;

let env: string = "production";
let nav: string = 'XIAXIAZheng';
// if (process.env.NODE_ENV === 'production') {
//   if (process.env.VUE_APP_TITLE === 'hyp') {
//     url = `${host}:518`;
//     env = "productionPig";
//     nav = '燕苹的小站';
//   }
//   if (process.env.VUE_APP_TITLE === 'zyb') {
//     url = `${host}:3000`;
//     env = "production";
//     nav = 'XIAXIAZheng';
//   }
// }
// if (process.env.NODE_ENV === 'development') {
//   if (process.env.VUE_APP_TITLE === 'hyp') {
//     url = 'http://localhost:518';
//     env = "development";
//     nav = '燕苹的小站';
//   }
//   if (process.env.VUE_APP_TITLE === 'zyb') {
//     url = 'http://localhost:3000';
//     env = "development";
//     nav = 'XIAXIAZheng';
//   }
// }

export const baseImgUrl = url;
export const baseUrl = `${url}/back`;
export const baseEnv = env;
export const navTitle = nav;