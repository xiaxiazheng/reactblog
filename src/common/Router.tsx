import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './Router.scss';
import Header from './Header';
import Log from '../views/log/Log';
import Home from '../views/home/Home';
import Tree from '../views/tree/Tree';
import LogCont from '../views/log/LogCont';
import Login from './Login';
import Admin from '../views/admin/Admin';
import AdminTree from '../views/adminLog/AdminLog';
import AdminLog from '../views/adminTree/AdminTree';

const Router: React.FC = () => {
  return (

    
    <BrowserRouter>
      <div className="Router-Head">
        <Header></Header>
      </div>
      <div className="Router-View">
        {/* 前台 */}
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Switch>
          <Route path="/log/:log_class/:log_id" exact component={LogCont} />
          <Route path="/log/:log_class" component={Log} />
        </Switch>
        <Route path="/tree" component={Tree} />
        {/* 控制台 */}
        <Route exact path="/admin" component={Admin} />
        <Route path="/admin/admintree" component={AdminTree} />
        <Route path="/admin/adminlog" component={AdminLog} />
      </div>
    </BrowserRouter>
  );
}

export default Router;