import React, { useContext } from "react";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { IsLoginContext } from "../context/IsLoginContext";
import { message, notification, Button } from "antd";
import { postLogin } from "../client/UserHelper";

interface PropsType {
    component?: any;
    path?: string;
    exact?: boolean;
}

// 路由登录鉴权
export const AuthRoute: React.FC<PropsType> = ({
    component: Component,
    ...rest
}) => {
    const { isLogin, setIsLogin } = useContext(IsLoginContext);

    return (
        <>
            <Route
                {...rest}
                render={(props: RouteComponentProps) => {
                    // 使用了 AuthRoute 代替 Route 的组件都会先执行这里，检查是否登录

                    // 登录函数，主要是用于 localStorage 中存在用户名和密码时的登录
                    const login = async () => {
                        let name = localStorage.getItem("username");
                        let password = window.atob(
                            localStorage.getItem("password") as string
                        );
                        let params = {
                            username: name,
                            password,
                        };
                        let res = await postLogin(params);
                        if (!res?.access_token) {
                            // 说明本地 localStorage 的用户名或密码错误，跳转去 login 界面重新登录
                            notification.warning({
                                message: "token 已过期，请重新登录！",
                                description: (
                                    <>
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                props.history.push({
                                                    pathname: "/login",
                                                    state: {
                                                        from: props.location,
                                                    },
                                                });
                                            }}
                                        >
                                            点击跳转至登录界面
                                        </Button>
                                    </>
                                ),
                            });
                            return <Component {...props} />;
                        } else {
                            // 能到这里，说明是曾经登录过，但是由于刷新导致丢失了 context，所以重新设置 context 的 isLogin，返回要访问的组件即可
                            message.success("您已登录过", 1);
                            setIsLogin(true);
                            return <Component {...props} />;
                        }
                    };

                    // 主要逻辑在这里，若是登录过就返回该组件，若是没登录就开始判断
                    if (!isLogin) {
                        // 若是 localStorage 存在用户名和密码，则尝试登录
                        if (
                            localStorage.getItem("username") &&
                            localStorage.getItem("password")
                        ) {
                            login();
                        } else {
                            // 若是本地不存在用户名和密码，说明是新的浏览器 tab，通过分享链接进入的，需要登录才能进入
                            message.warning("请先登录", 2);
                            return (
                                <Redirect
                                    to={{
                                        pathname: "/login",
                                        state: {
                                            from: props.location.pathname,
                                        },
                                    }}
                                />
                            );
                        }
                    } else {
                        // context 的 isLogin 正常，正常返回要访问的组件
                        return <Component {...props} />;
                    }
                }}
            />
        </>
    );
};
