import React, { useState, useContext, useEffect, useCallback } from "react";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import { Menu, Switch, Drawer, Divider } from "antd";
import { HomeOutlined, ExportOutlined } from "@ant-design/icons";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { IsLoginContext } from "@/context/IsLoginContext";
import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
import MiniMusicPlayer from "./mini-music-player";
import { getAlreadyDate } from "./utils";

interface PropsType extends RouteComponentProps {
    routes: any[];
    current: string | undefined;
    setCurrent: Function;
}

const Header: React.FC<PropsType> = (props) => {
    const { location, history, routes, current, setCurrent } = props;
    const { theme, setTheme } = useContext(ThemeContext);
    const { username, setUsername } = useContext(UserContext);

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

    const titleMap: any = {
        zyb: "XIAXIAZheng",
        hyp: "阿苹的小站",
    };

    const jumpToLogin = () => {
        history.replace({
            pathname: "/login",
            state: {
                from: location.pathname,
            },
        });
    };

    const [showDrawer, setShowDrawer] = useState<boolean>(true);
    const [showPlayer, setShowPlayer] = useState<boolean>(false);

    const HeaderContent = () => {
        return (
            <header className={styles.Header}>
                <div
                    className={styles.headerLeft}
                    onClick={() => setCurrent("admin")}
                >
                    <span className={styles.name}>
                        <Link to={"/admin"}>{titleMap[username]}</Link>
                    </span>
                    {/* 导航 */}
                    {routes.map((item) => (
                        <span
                            className={`${styles.routerItem} ${
                                current === item.route ? styles.active : ""
                            }`}
                            key={item.name}
                        >
                            {/* <Link to={`${item.route}`}>{item.name}</Link> */}
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
                    ))}
                </div>
                <div className={styles.headerRight}>
                    {
                        <span className={styles.already}>
                            已经 {already} 啦({alreadyDays}天)
                        </span>
                    }
                    {/* 音乐播放器开关 */}
                    <Switch
                        className={styles.switch}
                        checkedChildren="music"
                        unCheckedChildren="music"
                        checked={showPlayer}
                        onClick={() => setShowPlayer(!showPlayer)}
                    />
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
                                "https://github.com/xiaxiazheng/reactblog",
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
                                "https://tongji.baidu.com/web/10000199972/overview/index?siteId=15040289",
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

    return (
        <>
            <div
                style={{
                    opacity: showPlayer ? 1 : 0,
                    pointerEvents: showPlayer ? "unset" : "none",
                }}
            >
                <MiniMusicPlayer />
            </div>
            <HeaderContent />
        </>
    );
};

export default withRouter(Header);
