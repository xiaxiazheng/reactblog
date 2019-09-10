import React, {useState} from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { navTitle } from '../config';

const Header: React.FC = () => {
  const [current, setCurrent] = useState('home');

  const handleClick = function(e: any) {
    e.key !== 'github' ?
      setCurrent(e.key) :
      window.open("https://github.com/xiaxiazheng/reactblog", "_blank");
  }

  const handleClickHome = function() {
    setCurrent('home');
  }

  return (
    <div className="Header">
      <span className="header-left" onClick={handleClickHome}>
        <Link to="/">{navTitle}</Link>
      </span>
      <span className="header-right">
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="tree">
            <Icon type="cluster" />
            <Link to="/tree">知识树</Link>
          </Menu.Item>
          <Menu.Item key="log">
            <Icon type="book" />
            <Link to="/log">日志</Link>
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

export default Header;
