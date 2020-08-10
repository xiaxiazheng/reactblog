import React, { useState, useContext, useEffect } from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Icon } from '@ant-design/compatible'
import { Input, Button, message } from "antd";
import styles from "./index.module.scss";
import { postLogin } from "@/client/UserHelper";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { IsLoginContext } from "@/context/IsLoginContext";
import { UserContext } from "@/context/UserContext";

interface PropsType extends RouteComponentProps {}

const Login: React.FC<PropsType> = (props) => {
  const { history, location } = props;
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPwd, setIsShowPwd] = useState(false);
  const { setIsLogin } = useContext(IsLoginContext);
  const { setUsername } = useContext(UserContext);

  useEffect(() => {
    location.search && message.warning("状态码 401：登录已过期，请重新登录");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 查是否为空
  const checkEmpty = () => {
    if (user !== "" && password !== "") {
      return true;
    }
    message.warning(`${user === "" ? "账号" : "密码"}不可为空`);
    return false;
  };

  // 登录
  const submitLogin = async () => {
    if (!checkEmpty()) {
      return;
    }
    let params = {
      username: user,
      userpword: password,
    };
    let res = await postLogin(params);
    if (res) {
      setIsLogin(true); // 将 context 的 isLogin 设置为 true
      sessionStorage.setItem("token", res.data);
      sessionStorage.setItem("username", user);
      sessionStorage.setItem("password", window.btoa(password));
      localStorage.setItem("username", user);
      setUsername(user);
      message.success("登录成功");
      const search = location.search;
      const state: any = history.location.state;
      const jumpTo = search
        ? search.replace("?from=", "")
        : (state && state.from)
        ? state.from
        : "/admin";
      history.push(jumpTo);
    } else {
      message.error("密码错误或用户不存在，请重新输入");
      setPassword("");
    }
  };

  return (
    <div className={styles.Login}>
      <div className={styles.loginCont}>
        <div className={styles.loginBox}>
          <span className={styles.please}>Please Login:</span>
          <Input
            className={styles.userInput}
            placeholder="请输入用户名"
            size="large"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            onPressEnter={submitLogin}
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          />
          <Input
            className={styles.pwdInput}
            type={isShowPwd ? "text" : "password"}
            placeholder="请输入密码"
            size="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={submitLogin}
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            suffix={
              <Icon
                className={styles.pwdEye}
                type={!isShowPwd ? "eye" : "eye-invisible"}
                style={{ color: "rgba(0,0,0,.25)" }}
                onClick={() => setIsShowPwd(!isShowPwd)}
              />
            }
          />
          <Button
            className={styles.loginButton}
            type="primary"
            size="large"
            htmlType="submit"
            onClick={submitLogin}
          >
            登录
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
