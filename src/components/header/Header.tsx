import React, { useState, useContext, useEffect } from "react";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import { Menu, Icon, Switch } from "antd";
import { navTitle } from "@/env_config";
import { withRouter, match } from "react-router";
import { Location, History } from "history";
import { IsLoginContext } from "@/context/IsLoginContext";
import { ThemeContext } from "@/context/ThemeContext";
import HeaderSearch from "./header-search/HeaderSearch";
import moment from "moment";

interface PropsType {
  match: match;
  location: Location;
  history: History;
}

const Header: React.FC<PropsType> = ({ location, history }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { isLogin } = useContext(IsLoginContext); // 获取登录状态
  const [current, setCurrent] = useState("home");

  const [already, setAlready] = useState();
  const [alreadyDays, setAlreadyDays] = useState();

  useEffect(() => {
    // 获取相隔的年月日
    const getAlready = () => {
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
    getAlready();
    getAlreadyDays();
  }, []);

  const handleClick = (e: any) => {
    e.key !== "github"
      ? setCurrent(e.key)
      : window.open("https://github.com/xiaxiazheng/reactblog", "_blank");
  };

  // 用于刷新的时候将当前导航栏高亮
  useEffect(() => {
    const list = ["/tree", "/log/", "/wall"];
    list.forEach(item => {
      location.pathname.indexOf(item) !== -1 &&
        setCurrent(item.replace(/\//g, ""));
    });

    if (location.pathname === "/login") {
      setCurrent("admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  /** 点击切换主题 */
  const switchTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  /** 切换主题的原理是通过切换类切换 css 变量 */
  useEffect(() => {
    /** 通过设置 <App> 的类切换主题，主题样式在 Global.scss */
    let dom: any = document.querySelector(".App");
    dom.setAttribute("class", `App ${theme}Theme`);
  });

  return (
    <header className={styles.Header}>
      <span
        className={styles.headerLeft}
        onClick={() => setCurrent(isLogin ? "admin" : "home")}
      >
        <Link to={isLogin ? "/admin" : "/"}>{navTitle}</Link>
      </span>
      {isLogin && (
        <span className={styles.headerMiddle}>
          已经 {already} 啦（{alreadyDays}天）
        </span>
      )}
      <span className={styles.headerRight}>
        {/* 主题切换开关 */}
        <Switch
          className={styles.themeSwitch}
          checkedChildren="light"
          unCheckedChildren="dark"
          checked={theme === "light"}
          onClick={switchTheme}
        />
        {/* 搜索树节点 */}
        <HeaderSearch />
        {/* 导航 */}
        <Menu
          onClick={handleClick}
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
            <Link to={isLogin ? "/admin/log/所有日志" : "/log/所有日志"}>
              日志
            </Link>
          </Menu.Item>
          <Menu.Item key="wall">
            <Icon type="picture" className={styles.headerIcon} />
            <Link to={isLogin ? "/admin/wall" : "/wall"}>图片墙</Link>
          </Menu.Item>
          <Menu.Item key="github">
            <Icon type="github" className={styles.headerIcon} />
            <span>github</span>
          </Menu.Item>
        </Menu>
      </span>
    </header>
  );
};

export default withRouter(Header);
