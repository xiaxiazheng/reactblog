import React, { useState, useContext, useEffect, useCallback } from "react";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import { Icon } from "@ant-design/compatible";

import { Menu, Switch, Drawer, Divider } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { IsLoginContext } from "@/context/IsLoginContext";
import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
// import MusicPlayer from "../music-player";
import MiniMusicPlayer from "./mini-music-player";
import moment from "moment";
import { CodepenOutlined } from "@ant-design/icons";

interface PropsType extends RouteComponentProps {}

const Header: React.FC<PropsType> = (props) => {
  const { location, history } = props;
  const { theme, setTheme } = useContext(ThemeContext);
  const { username, setUsername } = useContext(UserContext);
  const { isLogin } = useContext(IsLoginContext); // 获取登录状态

  const [current, setCurrent] = useState("home");

  const [already, setAlready] = useState<string>();
  const [alreadyDays, setAlreadyDays] = useState<string | number>();

  useEffect(() => {
    getAlreadyDate();
  }, []);

  // 获取已经在一起多久的日期
  const getAlreadyDate = () => {
    // 获取相隔的年月日
    const getAlreadyDate = () => {
      const startDate = moment("2016-04-16");
      const endDate = moment(new Date());
      // 計算兩者差異年數
      const years = endDate.diff(startDate, "years");
      // 計算兩者差異月數，這邊要扣掉上面計算的差異年，否則會得到12個月
      const months = endDate.diff(startDate, "months") - years * 12;
      // 把差異的年、月數加回來，否則會變成計算起訖日相差的天數(365天)
      startDate.add(years, "years").add(months, "months");
      const days = endDate.diff(startDate, "days");
      setAlready(`${years} 年 ${months} 个月 ${days} 天`);
    };
    // 获取相隔的日期
    const getAlreadyDays = () => {
      const startDate = moment("2016-04-16");
      const endDate = moment(new Date());
      setAlreadyDays(endDate.diff(startDate, "days"));
    };
    getAlreadyDate();
    getAlreadyDays();
  };

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
      // console.log(location.pathname)
      // console.log(item.replace(/admin\//g, ""))
    });

    if (location.pathname === "/login") {
      setCurrent("admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  /** 点击切换主题 */
  const switchTheme = () => {
    const nowTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nowTheme);
    setTheme(nowTheme);
  };

  /** 点击切换用户 */
  const switchUser = () => {
    const nowUser = username === "zyb" ? "hyp" : "zyb";
    localStorage.setItem("username", nowUser);
    setUsername(nowUser);
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

  const HeaderContent = useCallback(
    () => (
      <header className={styles.Header}>
        <span
          className={styles.headerLeft}
          onClick={() => setCurrent(isLogin ? "admin" : "home")}
        >
          <Link to={isLogin ? "/admin" : "/"}>{titleMap[username]}</Link>
        </span>
        <span className={styles.headerRight}>
          {isLogin && (
            <span className={styles.already}>
              已经 {already} 啦({alreadyDays}天)
            </span>
          )}
          {/* 用户切换开关 */}
          {/* {!isLogin && (
            <Switch
              className={styles.switch}
              checkedChildren="hyp"
              unCheckedChildren="zyb"
              checked={username === "hyp"}
              onClick={switchUser}
            />
          )} */}
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
            {isLogin && (
              <Menu.Item key="tree">
                <Icon type="cluster" className={styles.headerIcon} />
                <Link to={isLogin ? "/admin/tree" : "/tree"}>Tree</Link>
              </Menu.Item>
            )}
            <Menu.Item key="blog">
              <Icon type="book" className={styles.headerIcon} />
              <Link to={isLogin ? "/admin/blog" : "/blog"}>Blog</Link>
            </Menu.Item>
            {isLogin && (
              <Menu.Item key="mind-map">
                <Icon type="partition" className={styles.headerIcon} />
                <Link to={isLogin ? "/admin/mindmap" : "/mindmap"}>MindMap</Link>
              </Menu.Item>
            )}
            {isLogin && (
              <Menu.Item key="cloud">
                <Icon type="cloud" className={styles.headerIcon} />
                <Link to={isLogin ? "/admin/cloud" : "/cloud"}>Cloud</Link>
              </Menu.Item>
            )}
            {isLogin && (
              <Menu.Item key="media">
                <Icon type="video-camera" className={styles.headerIcon} />
                <Link to={isLogin ? "/admin/media" : "/media"}>Media</Link>
              </Menu.Item>
            )}
            {window.screen.availWidth > 720 && (
              <Menu.Item key="test-page">
                {
                  // @ts-ignore
                  <CodepenOutlined className={styles.headerIcon} />
                }
                <Link to={isLogin ? "/admin/test-page" : "/test-page"}>TestPage</Link>
              </Menu.Item>
            )}
            {isLogin && (
              <Menu.Item key="maopu">
                <Icon type="reddit" className={styles.headerIcon} />
                <Link to={isLogin ? "/admin/maopu" : "/maopu"}>猫谱</Link>
              </Menu.Item>
            )}
            {isLogin && (
              <Menu.Item key="baidu">
                <Icon type="bar-chart" className={styles.headerIcon} />
                <span>百度统计</span>
              </Menu.Item>
            )}
            {isLogin && (
              <Menu.Item key="github">
                <Icon type="github" className={styles.headerIcon} />
                <span>github</span>
              </Menu.Item>
            )}
          </Menu>
          {isLogin && (
            <Icon
              title="退出登录"
              className={styles.exportIcon}
              type="export"
              onClick={jumpToLogin}
            />
          )}
        </span>
      </header>
    ),
    [isLogin, current, theme, username, already, alreadyDays]
  );

  return (
    <>
      {window.screen.availWidth > 720 && (
        <>
          {isLogin && <MiniMusicPlayer />}
          <HeaderContent />
        </>
      )}
      {/* 移动端展示 */}
      {window.screen.availWidth <= 720 && (
        <>
          <Drawer
            // title="Basic Drawer"
            placement="left"
            closable={false}
            onClose={() => {
              setVisible(!visible);
            }}
            className={styles.drawer}
            width={"calc(100% - 80px)"}
            visible={visible}
          >
            {isLogin && <MiniMusicPlayer />}
            <HeaderContent />
          </Drawer>
          <div
            className={styles.drawerControl}
            onClick={() => setVisible(true)}
          >
            <Icon type="home" className={styles.headerIcon} />
          </div>
        </>
      )}
    </>
  );
};

export default withRouter(Header);
