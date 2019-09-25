import React, {useState, useContext, useEffect} from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { navTitle } from '../env_config';
import { withRouter, match } from 'react-router';
import { Location, History } from 'history';
import { IsLoginContext } from './IsLoginContext';

interface PropsType {
  match: match;
  location: Location;
  history: History;
};

const Header: React.FC<PropsType> = ({ location }) => {
  const { isLogin } = useContext(IsLoginContext);  // 获取登录状态
  const [current, setCurrent] = useState('home');

  const handleClick = function(e: any) {
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
  }, []);

  return (
    <div className="Header">
      <span className="header-left" onClick={() => setCurrent(isLogin ? 'admin' : 'home')}>
        <Link to={isLogin ? '/admin' : '/'}>{navTitle}</Link>
      </span>
      <span className="header-right">
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="tree">
            <Icon type="cluster" className="header-icon"/>
            <Link to={isLogin ? '/admin/tree' : '/tree'}>知识树</Link>
          </Menu.Item>
          <Menu.Item key="log">
            <Icon type="book" className="header-icon"/>
            <Link to={isLogin ? "/admin/log/所有日志" : "/log/所有日志"}>日志</Link>
          </Menu.Item>
          <Menu.Item key="wall">
            <Icon type="picture" className="header-icon"/>
            <Link to={isLogin ? "/admin/wall" : "/wall"}>图片墙</Link>
          </Menu.Item>
          <Menu.Item key="github">
            <Icon type="github" className="header-icon"/>
            github
          </Menu.Item>
        </Menu>
      </span>
    </div>
  );
}

export default withRouter(Header);
