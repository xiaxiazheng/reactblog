import React, {useState, useContext, useEffect} from 'react';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import { Menu, Icon, Input, Popover, Spin, Switch } from 'antd';
import { navTitle } from '@/env_config';
import { withRouter, match } from 'react-router';
import { Location, History } from 'history';
import { IsLoginContext } from '@/context/IsLoginContext';
import { ThemeContext } from '@/context/ThemeContext';
import { searchTree } from '@/client/TreeHelper';

interface PropsType {
  match: match;
  location: Location;
  history: History;
};

interface TreeNodeType {
  c_id: number;
  c_label: string;
  c_sort: number;
  category: string;
  category_id: string;
  f_id: number;
  f_label: string;
  f_sort: number;
};

const Header: React.FC<PropsType> = ({ location, history }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { isLogin } = useContext(IsLoginContext);  // 获取登录状态
  const [current, setCurrent] = useState('home');

  const [keyword, setKeyword] = useState('');  // 搜索关键字
  const [isSearching, setIsSearching] = useState(false);  // 是否正在搜索
  const [showSearch, setShowSearch] = useState(false);  // 展开搜索结果框

  const handleClick = (e: any) => {
    e.key !== 'github' ?
      setCurrent(e.key) :
      window.open("https://github.com/xiaxiazheng/reactblog", "_blank");
  }

  // 用于刷新的时候将当前模块高亮
  useEffect(() => {
    const list = ['/tree', '/log/', '/wall'];
    list.forEach((item) => {
      location.pathname.indexOf(item) !== -1 && setCurrent(item.replace(/\//g, ''));
    });

    if (location.pathname === '/login') {
      setCurrent('admin');
    }
  }, [isLogin]);

  const handleSearch = async () => {
    const res: TreeNodeType[] = await searchTree(keyword || '');
    if (res) {
      setSearchResult(res);
      setIsSearching(false);
    } else {
      setSearchResult([]);
    }
  }

  const [searchResult, setSearchResult] = useState<TreeNodeType[]>([]);
  useEffect(() => {
    if (keyword !== '') {
      setIsSearching(true);
      handleSearch();
      setShowSearch(true);
    } else {
      setSearchResult([]);
    }
  }, [keyword]);

  // 按照 keyword 高亮搜索结果
  const highlight = (word: string) => {
    const reg = new RegExp(keyword, "gi");
    let list = word.match(reg) || [];
    return word.split(reg).reduce((jsx: any, item: string, index: number): any => {
      return (
        <>
          {jsx}
          <span className={styles.active}>{list[index - 1]}</span>
          {item}
        </>
      )
    });
  }

  // 选中搜索结果
  const choiceResult = (item: TreeNodeType) => {
    history.push(`${isLogin ? '/admin' : ''}/tree/${item.category_id}/${item.f_id}/${item.c_id}`);
    setShowSearch(false);
  }

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
        <Popover
          trigger="click"
          content={
            isSearching
            ?
            <Spin />
            : (
              // 有搜索结果的情况
              searchResult.length !== 0
              ?
              <div className={`${styles.treeSearchList} ScrollBar`}>
                {searchResult.map((item) => {
                  return (
                    <div
                      key={item.c_id}
                      onClick={choiceResult.bind(null, item)}
                    >
                      <span>{highlight(item.c_label)}</span>
                      <span>{highlight(item.f_label)} => {highlight(item.category)}</span>
                    </div>
                  )
                })}
              </div>
              :
              <div className={styles.noResult}>没有搜索结果</div>
            )
          }
          visible={showSearch && keyword !== ''}
        >
          <Input
            className={styles.searchTree}
            prefix={<Icon type="search" />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setShowSearch(true)}
            onBlur={() => {
              setTimeout(() => {
                setShowSearch(false)
              }, 200)
            }}
            placeholder="搜索知识树节点"
            allowClear
          />
        </Popover>
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