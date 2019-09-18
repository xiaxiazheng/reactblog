import React, {useState, useContext} from 'react';
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

const Header: React.FC<PropsType> = () => {
  const { isLogin } = useContext(IsLoginContext);  // 获取登录状态
  const [current, setCurrent] = useState('home');

  const handleClick = function(e: any) {
    e.key !== 'github' ?
      setCurrent(e.key) :
      window.open("https://github.com/xiaxiazheng/reactblog", "_blank");
  }

  return (
    <div className="Header">
      <span className="header-left" onClick={() => setCurrent(isLogin ? 'admin' : 'home')}>
        <Link to={isLogin ? '/admin' : '/'}>{navTitle}</Link>
      </span>
      <span className="header-right">
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="tree">
            <Icon type="cluster" />
            <Link to={isLogin ? '/admin/tree' : '/tree'}>知识树</Link>
          </Menu.Item>
          <Menu.Item key="log">
            <Icon type="book" />
            <Link to={isLogin ? "/admin/log/所有日志" : "/log/所有日志"}>日志</Link>
          </Menu.Item>
          <Menu.Item key="github">
            <Icon type="github" />
            github
          </Menu.Item>
        </Menu>
      </span>
    </div>
  );
}

export default withRouter(Header);
