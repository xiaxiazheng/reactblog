import React from 'react';
import './Home.scss';
import { Button } from 'antd';

const Home: React.FC = () => {
  return (
    <div className="Home">
      <header className="Home-header">
        我来组成头部
        <Button type="primary">Button</Button>
      </header>
    </div>
  );
}

export default Home;
