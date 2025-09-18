import React, { useState, useContext, useEffect } from "react";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import { Menu, Switch} from "antd";
import { BookOutlined } from "@ant-design/icons";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { IsLoginContext } from "@/context/IsLoginContext";
import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";

interface PropsType extends RouteComponentProps {}

const Header: React.FC<PropsType> = (props) => {
    const { location, history } = props;
    const { theme, setTheme } = useContext(ThemeContext);
    const { username, setUsername } = useContext(UserContext);
    const { isLogin } = useContext(IsLoginContext); // 获取登录状态

    const [current, setCurrent] = useState("home");

    const handleClickTabs = (e: any) => {
        e.key === "github"
            ? window.open("https://github.com/xiaxiazheng/reactblog", "_blank")
            : e.key === "baidu"
            ? window.open(
                  "https://tongji.baidu.com/web/10000199972/overview/index?siteId=15040289",
                  "_blank"
              )
            : setCurrent(e.key);

        setVisible(false);
    };

    // 用于刷新的时候将当前导航栏高亮
    useEffect(() => {
        const list = ["admin/tree", "admin/blog", "admin/cloud", "admin/media"];
        list.forEach((item) => {
            location.pathname.indexOf(item) !== -1 &&
                setCurrent(item.replace(/admin\//g, ""));
        });

        if (location.pathname === "/login") {
            setCurrent("admin");
        }
    }, [location]);

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

    const [visible, setVisible] = useState<boolean>(true);

    const HeaderContent = () => (
        <header className={styles.Header}>
            <span
                className={styles.headerLeft}
                onClick={() => setCurrent(isLogin ? "admin" : "home")}
            >
                <Link to={"/"}>{titleMap[username]}</Link>
            </span>
            <span className={styles.headerRight}>
                {/* 主题切换开关 */}
                {/* <Switch
                    className={styles.switch}
                    checkedChildren="light"
                    unCheckedChildren="dark"
                    checked={theme === "light"}
                    onClick={switchTheme}
                /> */}
                {/* 导航 */}
                <Menu
                    onClick={handleClickTabs}
                    selectedKeys={[current]}
                    mode={"horizontal"}
                    className={styles.headerRouteList}
                >
                    <Menu.Item key="todo">
                        <BookOutlined className={styles.headerIcon} />
                        <Link to={"/todo"}>todo</Link>
                    </Menu.Item>
                    <Menu.Item key="blog">
                        <BookOutlined className={styles.headerIcon} />
                        <Link to={"/blog"}>Blog</Link>
                    </Menu.Item>
                    {/* <Menu.Item key="test-page">
                        {
                            // @ts-ignore
                            <CodepenOutlined className={styles.headerIcon} />
                        }
                        <Link to={"/test-page"}>TestPage</Link>
                    </Menu.Item> */}
                </Menu>
            </span>
        </header>
    );

    return <HeaderContent />;
};

export default withRouter(Header);
