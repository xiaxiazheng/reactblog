import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Log from '../views/log/Log';
import Home from '../views/home/Home';
import Tree from '../views/tree/Tree';
import Header from './Header';
import './Router.scss';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="Router-Head">
        <Header></Header>
      </div>
      <div className="Router-View">
        <Route exact path="/" component={Home} />
        <Route path="/log" component={Log} />
        <Route path="/tree" component={Tree} />
      </div>
    </BrowserRouter>
  );
}

export default Router;