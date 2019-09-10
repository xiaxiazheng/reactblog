import axios from 'axios';

// 封装 Get
export const axiosGetHelper = async (url: string) => {
  let res: any;
  try {
    res = await axios.get(url);
  } catch (e) {
    console.log("get请求失败", e);
    return;
  }
  // 拦截下请求失败的情况
  if (res['data']['resultsCode'] === 'error') {
    console.log(res.data.message);
    return;
  }
  return res.data;
};

// 封装 Post
export const axiosPostHelper = async (url: string, params?: any) => {
  let res: any;
  try {
    res = await axios.post(url, params);
  } catch (e) {
    console.log("post请求失败");
    return;
  }
  // 拦截下请求失败的情况
  if (res['data']['resultsCode'] === 'error') {
    console.log(res.data.message);
    return;
  }
  return res.data;
};