import React, { useContext, useEffect } from "react";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { IsLoginContext } from "../context/IsLoginContext";
import { message, notification, Button } from "antd";
import { checkLogin } from "../client/UserHelper";

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

    // 访问受保护的路由时，都要经此进行鉴权
    const checkLoginAsync = async () => {
        await checkLogin();
        // 同时如果是新窗口打开的页面，鉴权通过后会将 isLogin 设置为已登录
        setIsLogin(true); // 只有 isLogin 为 true，context 刷新，才会命中具体的 Component，否则都是命中下面的 return null
    };

    return (
        <>
            <Route
                {...rest}
                render={(props: RouteComponentProps) => {
                    // 使用了 AuthRoute 代替 Route 的组件都会先执行这里，检查是否登录

                    if (!isLogin) {
                        checkLoginAsync();
                        return null;
                    }

                    return <Component {...props} />;
                }}
            />
        </>
    );
};
