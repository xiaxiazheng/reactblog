import React, { lazy, Suspense, useContext } from 'react';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';
import styles from './Router.module.scss';
import themeScss from '../assets/scss/Theme.module.scss';
import { PrivateRoute } from './PrivateRoute';
import Header from '../components/header/Header';
import { Icon } from 'antd';
import { LogProvider } from '../views/log/LogContext';
import { ThemeContext } from '../context/ThemeContext';
import { appUser } from '../env_config';

const Log = lazy(() => import('../views/log/Log'));
const Home = lazy(() => import('../views/home/Home'));
const Tree = lazy(() => import('../views/tree/Tree'));
const LogCont = lazy(() => import('../views/log/log-cont/LogCont'));
const Login = lazy(() => import('../views/login/Login'));
const Admin = lazy(() => import('../views/admin/Admin'));
const Wall = lazy(() => import('../views/wall/Wall'));

const Router: React.FC = () => {

  const { theme } : { theme: 'dark' | 'light' } = useContext(ThemeContext);

  // loading 界面
  const fallback = () =>{
    return (
      <div className={styles.routeLoading}>
        <Icon type="loading" />
        Loading...
      </div>
    );
  };

  const themeClass = {
    'light': themeScss.light_theme,
    'dark': themeScss.dark_theme
  };

  const Router: any = appUser === 'hyp' ? HashRouter : BrowserRouter;

  return (
    <div className={`${styles.routerWrapper} ${themeClass[theme]}`}>
      <Router>
        <div className={styles.RouterHead}>
          <Header></Header>
        </div>
        <Suspense fallback={fallback()}>
          <div className={`${styles.RouterView} ScrollBar`}>
            {/* 登录 */}
            <Route path="/login" component={Login} />
            {/* 前台 */}
            <Route exact path="/" component={Home} />
            <LogProvider>
              <Switch>
                <Route path="/log/:log_class/:log_id" exact component={LogCont} />
                <Route path="/log/:log_class" component={Log} />
              </Switch>
            </LogProvider>
            <Switch>
              <Route path="/tree/:first_id/:second_id/:third_id" component={Tree} />
              <Route path="/tree" component={Tree} />
            </Switch>
            <Route path="/wall" component={Wall} />
            {/* 控制台 */}
            <PrivateRoute exact path="/admin" component={Admin} />
            <Switch>
              <PrivateRoute path="/admin/tree/:first_id/:second_id/:third_id" component={Tree} />
              <PrivateRoute path="/admin/tree" component={Tree} />
            </Switch>
            <LogProvider>
              <Switch>
                <PrivateRoute path="/admin/log/:log_class/:log_id" exact component={LogCont} />
                <PrivateRoute path="/admin/log/:log_class" component={Log} />
              </Switch>
            </LogProvider>
            <PrivateRoute path="/admin/wall" component={Wall} />
          </div>
        </Suspense>
      </Router>
    </div>
  );
}

export default Router;