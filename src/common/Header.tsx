import React from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <div className="Router-Header Header">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/log">Log</Link>
        </li>
        <li>
          <Link to="/tree">Tree</Link>
        </li>
      </ul>
    </div>
  );
}

export default Header;
