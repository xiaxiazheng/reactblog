import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './Router.scss';
import { PrivateRoute } from './PrivateRoute';
import Header from './Header';
import Log from '../views/log/Log';
import Home from '../views/home/Home';
import Tree from '../views/tree/Tree';
import LogCont from '../views/log/LogCont';
import Login from './Login';
import Admin from '../views/admin/Admin';
import AdminLog from '../views/adminLog/AdminLog';
import AdminTree from '../views/adminTree/AdminTree';

const Router: React.FC = () => {
  return (
    
    
    <BrowserRouter>
      <div className="Router-Head">
        <Header></Header>
      </div>
      <div className="Router-View">
        {/* 登录 */}
        <Route path="/login" component={Login} />
        {/* 前台 */}
        <Route exact path="/" component={Home} />
        <Switch>
          <Route path="/log/:log_class/:log_id" exact component={LogCont} />
          <Route path="/log/:log_class" component={Log} />
        </Switch>
        <Route path="/tree" component={Tree} />
        {/* 控制台 */}
        <PrivateRoute exact path="/admin" component={Admin} />
        <PrivateRoute path="/admin/admintree" component={AdminTree} />
        <Switch>
          <PrivateRoute path="/admin/adminlog/:log_class/:log_id" exact component={LogCont} />
          <PrivateRoute path="/admin/adminlog/:log_class" component={AdminLog} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default Router;