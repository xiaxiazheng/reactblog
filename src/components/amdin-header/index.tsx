import React, { useState, useContext, useEffect } from "react";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import { Popover, Switch } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { ThemeContext } from "@/context/ThemeContext";
import { getAlreadyDate } from "./utils";

interface PropsType extends RouteComponentProps {
    routes: any[];
    current: string | undefined;
    setCurrent: Function;
}

const Header: React.FC<PropsType> = (props) => {
    const { location, history, routes, current, setCurrent } = props;
    const { theme, setTheme } = useContext(ThemeContext);

    const [already, setAlready] = useState<string>();
    const [alreadyDays, setAlreadyDays] = useState<string | number>();

    useEffect(() => {
        const obj = getAlreadyDate();
        setAlready(obj.date);
        setAlreadyDays(obj.days);
    }, []);

    /** 点击切换主题 */
    const switchTheme = () => {
        const nowTheme = theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", nowTheme);
        setTheme(nowTheme);
    };
    /** 切换主题的原理是通过切换类切换 css 变量 */
    useEffect(() => {
        /** 通过设置 <App> 的类切换主题，主题样式在 Global.scss */
        let dom: any = document.querySelector(".App");
        dom.setAttribute("class", `App ${theme}Theme`);
    }, [theme]);

    const jumpToLogin = () => {
        localStorage.setItem("token", "");
        localStorage.setItem("refresh_token", "");
        history.push({
            pathname: "/login",
            state: {
                from: location.pathname,
            },
        });
    };

    const routerItem = (item: any) => (
        <span
            className={`${styles.routerItem} ${
                current === item.route ? styles.active : ""
            }`}
            key={item.name}
        >
            <span
                onClick={() => {
                    window.open(
                        `${window.location.origin}${item.route}`,
                        "_blank"
                    );
                }}
            >
                {item.name}
            </span>
        </span>
    );

    return (
        <header className={styles.Header}>
            <div
                className={styles.headerLeft}
                onClick={() => setCurrent("admin")}
            >
                <span className={styles.name}>
                    <Link to={"/admin"}>XIAXIAZheng</Link>
                </span>
                {/* 导航 */}
                {routes
                    .filter((item) => item.isShow)
                    .map((item) => routerItem(item))}
                <Popover
                    placement="bottom"
                    content={routes
                        .filter((item) => !item.isShow)
                        .map((item) => (
                            <div key={item.name}>{routerItem(item)}</div>
                        ))}
                >
                    <span
                        style={{
                            cursor: "pointer",
                            fontSize: 20,
                            marginLeft: 10,
                        }}
                    >
                        ......
                    </span>
                </Popover>
            </div>
            <div className={styles.headerRight}>
                {
                    <span className={styles.already}>
                        已经 {already} 啦({alreadyDays}天)
                    </span>
                }
                {/* 主题切换开关 */}
                <Switch
                    className={styles.switch}
                    checkedChildren="light"
                    unCheckedChildren="dark"
                    checked={theme === "light"}
                    onClick={switchTheme}
                />
                <span
                    className={styles.routerItem}
                    onClick={() =>
                        window.open(
                            "https://tongji.baidu.com/web/10000199972/overview/index?siteId=15040289",
                            "_blank"
                        )
                    }
                >
                    百度统计
                </span>
                <span
                    className={styles.routerItem}
                    onClick={() =>
                        window.open(
                            "https://github.com/xiaxiazheng/reactblog",
                            "_blank"
                        )
                    }
                >
                    github
                </span>
                <ExportOutlined
                    title="退出登录"
                    className={styles.exportIcon}
                    onClick={jumpToLogin}
                />
            </div>
        </header>
    );
};

export default withRouter(Header);
