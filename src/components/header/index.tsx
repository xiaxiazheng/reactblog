import React, { useState, useContext, useEffect } from "react";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";

import {
  BookOutlined,
  ClusterOutlined,
  ExportOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Icon } from "@ant-design/compatible";

import { Menu, Switch } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { IsLoginContext } from "@/context/IsLoginContext";
import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
import MusicPlayer from "./music-player";
import moment from "moment";

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
    e.key !== "github"
      ? setCurrent(e.key)
      : window.open("https://github.com/xiaxiazheng/reactblog", "_blank");
  };

  // 用于刷新的时候将当前导航栏高亮
  useEffect(() => {
    const list = ["admin/tree", "admin/log", "admin/wall", "admin/media"];
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
  }, []);

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
    hyp: "XIAXIAHuang",
  };

  const jumpToLogin = () => {
    history.replace({
      pathname: "/login",
      state: {
        from: location.pathname,
      },
    });
  };

  return (
    <header className={styles.Header}>
      <span
        className={styles.headerLeft}
        onClick={() => setCurrent(isLogin ? "admin" : "home")}
      >
        <Link to={isLogin ? "/admin" : "/"}>{titleMap[username]}</Link>
      </span>
      {isLogin && (
        <span className={styles.headerMiddle}>
          已经 {already} 啦({alreadyDays}天)
        </span>
      )}
      {isLogin && <MusicPlayer />}
      <span className={styles.headerRight}>
        {/* 用户切换开关 */}
        {!isLogin && (
          <Switch
            className={styles.switch}
            checkedChildren="hyp"
            unCheckedChildren="zyb"
            checked={username === "hyp"}
            onClick={switchUser}
          />
        )}
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
          mode="horizontal"
          className={styles.headerRouteList}
        >
          <Menu.Item key="tree">
            <Icon type="cluster" className={styles.headerIcon} />
            <Link to={isLogin ? "/admin/tree" : "/tree"}>知识树</Link>
          </Menu.Item>
          <Menu.Item key="log">
            <Icon type="book" className={styles.headerIcon} />
            <Link to={isLogin ? "/admin/log" : "/log"}>日志</Link>
          </Menu.Item>
          {isLogin && (
            <Menu.Item key="wall">
              <Icon type="picture" className={styles.headerIcon} />
              <Link to={isLogin ? "/admin/wall" : "/wall"}>图库</Link>
            </Menu.Item>
          )}
          {isLogin && (
            <Menu.Item key="media">
              <Icon type="video-camera" className={styles.headerIcon} />
              <Link to={isLogin ? "/admin/media" : "/media"}>媒体库</Link>
            </Menu.Item>
          )}
          <Menu.Item key="knn">
            <Icon type="book" className={styles.headerIcon} />
            <Link to={isLogin ? "/admin/knn" : "/knn"}>KNN</Link>
          </Menu.Item>
          {isLogin && (
            <Menu.Item key="maopu">
              <Icon type="cat" className={styles.headerIcon} />
              <Link to={isLogin ? "/admin/maopu" : "/maopu"}>猫谱</Link>
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
  );
};

export default withRouter(Header);
