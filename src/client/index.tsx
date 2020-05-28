import axios from 'axios';
import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios'

import { notification } from 'antd';
import { isDev, baseUrl } from '@/env_config';
import httpCodeMessage from './lib/http-code-msg';

const instance = axios.create({
  baseURL: `${baseUrl}/api`,
  timeout: isDev ? 5 * 1000 : 10 * 1000
})

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// axios.defaults.retry = 3
// axios.defaults.retryDelay = 1000

const checkStatus = (res: AxiosError['response']) => {
  if (!res) {
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
  const status: any = res.status;

  if (res.status === 401) {
    window.location.href = `${window.location.origin}/login?from=${window.location.pathname}`
    return;
  }

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

// 定义全局变量clearRequest，在route.js中要用到
const clearRequest = {
	source: {
		token: null,
		cancel: null
	}
}

// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // config.cancelToken = clearRequest.source.token;
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

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

export interface ResType {
  data: DataType
}

interface DataType {
  resultsCode: string
  message: string
  data?: any
}

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// 封装 Get
export const getHelper = async (url: string) => {
  let res: ResType;
  try {
    res = await instance.get(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      },
      cancelToken: source.token
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
export const postHelper = async (url: string, params?: any) => {
  let res: any;
  try {
    res = await instance.post(url, params, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      },
      cancelToken: source.token
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


declare global {
  interface Window {
    $axios: AxiosInstance
  }
}
window.$axios = instance

export default instance