import React from "react";
import axios from "axios";
import {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from "axios";
import { isDev, baseUrl } from "@/env_config";
import { isVisitor } from "./utils";
import { Button, notification } from "antd";
import { postRefresh } from "./UserHelper";
import httpCodeMessage from "./lib/http-code-msg";

export const instance = axios.create({
    baseURL: `${baseUrl}/api`,
    timeout: isDev ? 60 * 1000 : 20 * 1000,
});

// 请求拦截器
instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (!error.response) {
            if (!isVisitor) {
                notification.error({
                    description: "您的网络发生异常，无法连接服务器",
                    message: "网络异常",
                });
            }
            return Promise.reject(error);
        }

        // 这里如果不是返回 Promise.reject()，那会被当成正常的返回值的
        if (
            error.response.status === 401 ||
            error.response.data.statusCode === 401
        ) {
            return handleResponse401(error.response);
        }

        const res: any = error.response;
        if (!isVisitor) {
            noticeError(res);
        }

        return Promise.reject(error);
    }
);

const noticeError = (res: any) => {
    const errortext = httpCodeMessage[res?.statusCode] || res.statusText;
    const errorDesc = `${res.status}: ${errortext}`;
    const duration = isDev ? 4 : 2;
    notification.error({
        message: `请求错误 ${res.status}:  \n${res.config.url}\n`,
        description: `${errorDesc} \n 您可以点击刷新按钮进行重试\n ${JSON.stringify(
            res.data
        )}`,
        duration,
    });
};

// 处理 401 的情况，用 refresh_token 重发一次
const handleResponse401 = async (res: any) => {
    try {
        // 判断如果是用 access_token 请求的，就调用更新 access_token 的接口
        if (
            res.config.headers.Authorization ===
            `Bearer ${localStorage.getItem("token")}`
        ) {
            const newRes = await postRefresh();
            if (newRes) {
                const access_token = newRes?.data?.access_token;

                // 如果能获取到新的 access_token，则重发请求，并把 token 更新
                if (access_token) {
                    localStorage.setItem("token", access_token);
                    res.config.headers.Authorization = `Bearer ${access_token}`; // 使用新的 token
                    return await axios.request(res.config); // 传入 config，重发原来的请求
                }
            } else {
                // 说明刷新 refresh_token 失败，也走报错路径
                throw Error();
            }
        }
    } catch (e) {
        // 否则就抛错，提示跳转到更新页面
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
        return Promise.reject(e);
    }

    return Promise.reject("登录过期");
};

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
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            cancelToken: source.token,
        });
    } catch (e: any) {
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
export const postHelper = async (url: string, params: any = {}) => {
    let res: any;
    try {
        res = await instance.post(url, params, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            cancelToken: source.token,
        });
    } catch (e: any) {
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
