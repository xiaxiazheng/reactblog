import React, { useState, useContext, useEffect } from "react";
import { Input, Button, message, Radio, Modal } from "antd";
import {
    EyeInvisibleOutlined,
    EyeOutlined,
    LockOutlined,
    UserOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { postLogin } from "@/client/UserHelper";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { IsLoginContext } from "@/context/IsLoginContext";
import { UserContext } from "@/context/UserContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const RadioGroup = Radio.Group;

interface PropsType extends RouteComponentProps {}

const Login: React.FC<PropsType> = (props) => {
    const { history, location } = props;
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPwd, setIsShowPwd] = useState(false);
    const { setIsLogin } = useContext(IsLoginContext);
    const { setUsername } = useContext(UserContext);

    const isNewMachine =
        !localStorage.getItem("refresh_token") ||
        localStorage.getItem("refresh_token") === "";
    const [isTrust, setIsTrust] = useState<boolean>(!isNewMachine);

    useDocumentTitle("login");

    useEffect(() => {
        location.search &&
            message.warning("状态码 401：登录已过期，请重新登录");
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
            password,
        };
        let res = await postLogin(params);
        if (res?.access_token) {
            setIsLogin(true); // 将 context 的 isLogin 设置为 true
            localStorage.setItem("token", res.access_token);
            if (isTrust) {
                localStorage.setItem("refresh_token", res.refresh_token);
            } else {
                localStorage.setItem("refresh_token", "");
            }
            localStorage.setItem("username", user);
            setUsername(user);
            message.success("登录成功");
            const search = location.search;
            const state: any = history.location.state;
            const jumpTo = search
                ? search.replace("?from=", "")
                : state && state.from
                ? state.from
                : "/admin";
            history.push(jumpTo);
        } else {
            message.error("密码错误或用户不存在，请重新输入");
            setPassword("");
        }
    };

    // 监听回车
    useEffect(() => {
        const listenLogin = (event: any) => {
            // 监听回车直接登录
            if (event.key === "Enter") {
                submitLogin();
            }
        };
        document.addEventListener("keydown", listenLogin);

        return () => {
            document.removeEventListener("keydown", listenLogin);
        };
    }, [user, password]);

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
                        prefix={
                            <UserOutlined
                                style={{ color: "rgba(0,0,0,.25)" }}
                            />
                        }
                    />
                    <Input
                        className={styles.pwdInput}
                        type={isShowPwd ? "text" : "password"}
                        placeholder="请输入密码"
                        size="large"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onPressEnter={submitLogin}
                        prefix={
                            <LockOutlined
                                type="lock"
                                style={{ color: "rgba(0,0,0,.25)" }}
                            />
                        }
                        suffix={
                            !isShowPwd ? (
                                <EyeOutlined
                                    className={styles.pwdEye}
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                    onClick={() => setIsShowPwd(!isShowPwd)}
                                />
                            ) : (
                                <EyeInvisibleOutlined
                                    className={styles.pwdEye}
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                    onClick={() => setIsShowPwd(!isShowPwd)}
                                />
                            )
                        }
                    />
                    <RadioGroup
                        className={styles.trust}
                        value={isTrust}
                        onChange={(e) => {
                            if (e.target.value && isNewMachine) {
                                Modal.confirm({
                                    title: "你在一台新设备或之前不受信任的设备上登录，或者之前手动退出过登录，确认信任该设备吗？",
                                    onOk: () => setIsTrust(e.target.value),
                                });
                            } else {
                                setIsTrust(e.target.value);
                            }
                        }}
                    >
                        <Radio value={true}>信任该设备</Radio>
                        <Radio value={false}>不信任该设备</Radio>
                    </RadioGroup>
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
