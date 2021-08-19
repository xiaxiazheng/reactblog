import React from "react";
import axios from "axios";
import {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from "axios";
import { notification, message, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { isDev, baseUrl } from "@/env_config";
import httpCodeMessage from "./lib/http-code-msg";

// 是否是游客
const isVisitor = window.location.href.indexOf("admin") === -1;

const instance = axios.create({
    baseURL: `${baseUrl}/api`,
    timeout: isDev ? 5 * 1000 : 10 * 1000,
});

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// axios.defaults.retry = 3
// axios.defaults.retryDelay = 1000

// check 返回数据的状态是否正常，不正常就右侧 notification 报错
const checkStatus = (res: AxiosError["response"]) => {
    if (!res && !isVisitor) {
        notification.error({
            description: "您的网络发生异常，无法连接服务器",
            message: "网络异常",
        });
        return res;
    }

    // 错误提示
    apiErrorLog(res);

    return res;
};

function apiErrorLog(res: any) {
    const status: any = res.status;

    // 登录 401 校验
    if (res.status === 401) {
        notification.warning({
            message: "api报错, 登录已过期，请重新登录！",
            description: (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                            window.location.href = `${window.location.origin}/login?from=${window.location.pathname}`;
                        }}
                    >
                        点击跳转至登录界面
                    </Button>
                </>
            ),
        });
        return;
    }

    if (!isVisitor) {
        const errortext = httpCodeMessage[status] || res.statusText;
        const errorDesc = `${res.status}: ${errortext}`;
        const duration = isDev ? 4 : 2;
        notification.error({
            message: `请求错误 ${res.status}:  \n${res.config.url}\n`,
            description: `${errorDesc} \n 您可以点击刷新按钮进行重试\n ${JSON.stringify(
                res.data
            )}`,
            duration,
        });
    }
}

// 定义全局变量clearRequest，在route.js中要用到
const clearRequest = {
    source: {
        token: null,
        cancel: null,
    },
};

// 聚合多个交叉的请求成一个提示，但是防不住一个请求结束了另一个请求才开始，这时依然会有两条
let count = 0;
let key: any = undefined;
const createMessage = () => {
    if (count === 0) {
        key = Math.random();
        message.info({
            key,
            icon: <LoadingOutlined />,
            content: "请求发送中，请稍后",
            duration: 0,
        });
    }
    count++;
};
const destroyMessage = () => {
    if (count === 1) {
        message.destroy(key);
    }
    count--;
};

// 请求拦截器
instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // config.cancelToken = clearRequest.source.token;
        createMessage();
        return config;
    },
    (error: AxiosError) => {
        destroyMessage();
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        destroyMessage();
        return response;
    },
    (error: AxiosError) => {
        checkStatus(error.response);
        destroyMessage();
        return Promise.reject(error);
    }
);

export interface ResType {
    data: DataType;
}

interface DataType {
    resultsCode: string;
    message: string;
    data?: any;
}

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// 封装 Get
export const getHelper = async (url: string) => {
    let res: ResType;
    try {
        res = await instance.get(url, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            cancelToken: source.token,
        });
    } catch (e) {
        console.log("get请求失败", e);
        return;
    }

    if (res.data.resultsCode === "error") {
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
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            cancelToken: source.token,
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

declare global {
    interface Window {
        $axios: AxiosInstance;
    }
}
window.$axios = instance;

export default instance;
