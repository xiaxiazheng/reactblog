import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { IsLoginContext } from "../context/IsLoginContext";
import { message } from "antd";
import { postLogin } from "../client/UserHelper";

interface PropsType {
  component?: any;
  path?: string;
  exact?: boolean;
}

export const PrivateRoute: React.FC<PropsType> = ({
  component: Component,
  ...rest
}) => {
  const { isLogin, setIsLogin } = useContext(IsLoginContext);

  return (
    <>
      <Route
        {...rest}
        render={(props) => {
          // 使用了 PrivateRoute 代替 Route 的组件都会先执行这里，检查是否登录

          // 登录函数，主要是用于 sessionStorage 中存在用户名和密码时的登录
          const login = async () => {
            let name = sessionStorage.getItem("xia_username");
            let pword = window.atob(
              sessionStorage.getItem("xia_password") as string
            );
            let params = {
              username: name,
              userpword: pword,
            };
            let res = await postLogin(params);
            if (!res) {
              // 说明本地 sessionStorage 的用户名或密码错误，跳转去 login 界面重新登录
              message.error("请重新登录", 2);
              return (
                <Redirect
                  to={{
                    pathname: "/login",
                    state: { from: props.location },
                  }}
                />
              );
            } else {
              // 能到这里，说明是曾经登录过，但是由于刷新导致丢失了 context，所以重新设置 context 的 isLogin，返回要访问的组件即可
              message.success("您已登录过", 1);
              setIsLogin(true);
              return <Component {...props} />;
            }
          };

          // 主要逻辑在这里，若是登录过就返回该组件，若是没登录就开始判断
          if (!isLogin) {
            // 若是 sessionStorage 存在用户名和密码，则尝试登录
            if (
              sessionStorage.getItem("xia_username") &&
              sessionStorage.getItem("xia_password")
            ) {
              login();
            } else {
              // 若是本地不存在用户名和密码，说明是新的浏览器 tab，通过分享链接进入的，需要登录才能进入
              message.warning("请先登录", 2);
              return (
                <Redirect
                  to={{
                    pathname: "/login",
                    state: { from: props.location },
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
