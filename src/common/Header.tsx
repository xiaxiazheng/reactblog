import React, {useState, useEffect} from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { navTitle } from '../env_config';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';

interface PropsType {
  match: match;
  location: Location;
  history: History;
};

const Header: React.FC<PropsType> = ({ location }) => {
  const [current, setCurrent] = useState('home');

  const handleClick = function(e: any) {
    e.key !== 'github' ?
      setCurrent(e.key) :
      window.open("https://github.com/xiaxiazheng/reactblog", "_blank");
  }

  // 匹配 location，判断是否是控制台
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(/^\/admin*/.test(location.pathname));
  });

  return (
    <div className="Header">
      <span className="header-left" onClick={() => setCurrent(isAdmin ? 'admin' : 'home')}>
        <Link to={isAdmin ? '/admin' : '/'}>{navTitle}</Link>
      </span>
      <span className="header-right">
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key={isAdmin ? "admintree" : "tree"}>
            <Icon type="cluster" />
            <Link to={isAdmin ? "/admin/admintree" : "/tree"}>知识树</Link>
          </Menu.Item>
          <Menu.Item key={isAdmin ? "adminlog" : "log"}>
            <Icon type="book" />
            <Link to={isAdmin ? "/admin/adminlog/所有日志" : "/log/所有日志"}>日志</Link>
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
