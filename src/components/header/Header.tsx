import React, {useState, useContext, useEffect} from 'react';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import { Menu, Icon, Switch } from 'antd';
import { navTitle } from '@/env_config';
import { withRouter, match } from 'react-router';
import { Location, History } from 'history';
import { IsLoginContext } from '@/context/IsLoginContext';
import { ThemeContext } from '@/context/ThemeContext';
import HeaderSearch from './header-search/HeaderSearch'

interface PropsType {
  match: match;
  location: Location;
  history: History;
};

const Header: React.FC<PropsType> = ({ location, history }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { isLogin } = useContext(IsLoginContext);  // 获取登录状态
  const [current, setCurrent] = useState('home');

  const handleClick = (e: any) => {
    e.key !== 'github' ?
      setCurrent(e.key) :
      window.open("https://github.com/xiaxiazheng/reactblog", "_blank");
  }

  // 用于刷新的时候将当前导航栏高亮
  useEffect(() => {
    const list = ['/tree', '/log/', '/wall'];
    list.forEach((item) => {
      location.pathname.indexOf(item) !== -1 && setCurrent(item.replace(/\//g, ''));
    });

    if (location.pathname === '/login') {
      setCurrent('admin');
    }
  }, [isLogin]);

  /** 点击切换主题 */
  const switchTheme = () => {
    setTheme(theme === 'dark' ? 'light': 'dark');
  }

  /** 切换主题的原理是通过切换类切换 css 变量 */
  useEffect(() => {
    /** 通过设置 <App> 的类切换主题，主题样式在 Global.scss */
    let dom: any = document.querySelector('.App');
    dom.setAttribute('class', `App ${theme}Theme`);
  });

  return (
    <header className={styles.Header}>
      <span className={styles.headerLeft} onClick={() => setCurrent(isLogin ? 'admin' : 'home')}>
        <Link to={isLogin ? '/admin' : '/'}>{navTitle}</Link>
      </span>
      <span className={styles.headerRight}>
        {/* 主题切换开关 */}
        <Switch
          className={styles.themeSwitch}
          checkedChildren="light"
          unCheckedChildren="dark"
          checked={theme === 'light'}
          onClick={switchTheme}
        />
        {/* 搜索树节点 */}
        <HeaderSearch />
        {/* 导航 */}
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className={styles.headerRouteList}>
          <Menu.Item key="tree">
            <Icon type="cluster" className={styles.headerIcon} />
            <Link to={isLogin ? '/admin/tree' : '/tree'}>知识树</Link>
          </Menu.Item>
          <Menu.Item key="log">
            <Icon type="book" className={styles.headerIcon} />
            <Link to={isLogin ? "/admin/log/所有日志" : "/log/所有日志"}>日志</Link>
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
}

export default withRouter(Header);
