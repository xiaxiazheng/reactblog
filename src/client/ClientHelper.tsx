import axios from 'axios';
import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios'
import { notification } from 'antd';
import { isDev } from '@/env_config';
import httpCodeMessage from './lib/http-code-msg';

const instance = axios.create({
  baseURL: '/back',
  timeout: isDev ? 20 * 1000 : 50 * 1000,
})

const checkStatus = (res: AxiosError['response']) => {
  if (!res) {
    console.log('res不存在！', res)
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常'
    })
    return res
  }

  // 错误提示
  apiErrorLog(res)

  return res
}

function apiErrorLog(res: any) {
  // 打印到控制台
  // console.log('res: ', res)
  // 显示提示
  const status: any = res.status;
  const errortext = httpCodeMessage[status] || res.statusText
  const errorDesc = `${res.status}: ${errortext}`
  const duration = isDev ? 4 : 2
  notification.error({
    message: `请求错误 ${res.status}:  \n${res.config.url}\n`,
    description: `${errorDesc} \n 您可以点击刷新按钮进行重试\n ${JSON.stringify(
      res.data
    )}`,
    duration
  })
}

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    checkStatus(error.response)
    return Promise.reject(error)
  }
)

// 封装 Get
export const axiosGetHelper = async (url: string) => {
  let res: any;
  try {
    res = await instance({
      url: url
    });
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


declare global {
  interface Window {
    $axios: AxiosInstance
  }
}
window.$axios = instance

export default instance