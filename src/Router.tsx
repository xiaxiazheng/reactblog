import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Log from './log/Log';
import Home from './home/Home';
import Tree from './tree/Tree';
import Header from './common/Header';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Header></Header>
      <div className="Router-View">
        <Route exact path="/" component={Home} />
        <Route path="/log" component={Log} />
        <Route path="/tree" component={Tree} />
      </div>
    </BrowserRouter>
  );
}

export default Router;