import React, { useState, useContext, useEffect, useCallback } from "react";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import { Menu, Switch, Drawer, Divider } from "antd";
import { BookOutlined, ExportOutlined } from '@ant-design/icons';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { IsLoginContext } from "@/context/IsLoginContext";
import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
import { CodepenOutlined } from "@ant-design/icons";
import MinHeader from "./min-header";

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

  const jumpToLogin = () => {
    history.replace({
      pathname: "/login",
      state: {
        from: location.pathname,
      },
    });
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
        <Switch
          className={styles.switch}
          checkedChildren="light"
          unCheckedChildren="dark"
          checked={theme === "light"}
          onClick={switchTheme}
        />
        {/* 导航 */}
        <Menu
          onClick={handleClickTabs}
          selectedKeys={[current]}
          mode={window.screen.availWidth <= 720 ? "vertical" : "horizontal"}
          className={styles.headerRouteList}
        >
          <Menu.Item key="blog">
            <BookOutlined className={styles.headerIcon} />
            <Link to={"/blog"}>Blog</Link>
          </Menu.Item>
          {window.screen.availWidth > 720 && (
            <Menu.Item key="test-page">
              {
                // @ts-ignore
                <CodepenOutlined className={styles.headerIcon} />
              }
              <Link to={"/test-page"}>TestPage</Link>
            </Menu.Item>
          )}
        </Menu>
        {isLogin && (
          <ExportOutlined
            title="退出登录"
            className={styles.exportIcon}
            onClick={jumpToLogin}
          />
        )}
      </span>
    </header>
  );

  return (
    <>
      {window.screen.availWidth > 720 && <HeaderContent />}
      <MinHeader visible={visible} setVisible={setVisible}>
        <HeaderContent />
      </MinHeader>
    </>
  );
};

export default withRouter(Header);
