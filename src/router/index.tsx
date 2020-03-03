import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import { HashRouter } from 'react-router-dom';
import styles from './index.module.scss';
import { PrivateRoute } from './PrivateRoute';
import Header from '@/components/header';
import { LogProvider } from '@/views/log/LogContext';
import { TreeProvider } from '@/views/tree/TreeContext';
import Loading from '@/components/loading';

const Home = lazy(() => import('../views/home'));
const Tree = lazy(() => import('../views/tree'));
const Log = lazy(() => import('../views/log'));
const LogCont = lazy(() => import('../views/log/log-cont'));
const Login = lazy(() => import('../views/login'));
const Admin = lazy(() => import('../views/admin'));
const Wall = lazy(() => import('../views/wall'));

const Router: React.FC = () => {

  // loading 界面
  const fallback = () =>{
    return (
      <Loading width={300} />
    );
  };

  // const Router: any = appUser === 'hyp' ? HashRouter : BrowserRouter;
  const Router = BrowserRouter;

  /** 提供页面基本骨架 */
  const DefaultLayout = (props: any) => {
    const {component: Component, ...rest} = props;
    return (
      <Route {...rest} render={matchProps => (
        <>
          <div className={styles.RouterHead}>
            <Header></Header>
          </div>
          <div className={styles.RouterView}>
            <Component {...matchProps} />
          </div>
        </>
      )} />
    )
  };

  return (
    <div className={styles.routerWrapper}>
      <Router>
        <Suspense fallback={fallback()}>
          {/* 登录 */}
          <Route path="/login" component={Login} />

          {/* 前台 */}
          <DefaultLayout exact path="/" component={Home} />
          <TreeProvider>
            <Switch>
              <DefaultLayout path="/tree/:first_id/:second_id" component={Tree} />
              <DefaultLayout path="/tree" component={Tree} />
            </Switch>              
          </TreeProvider>
          <LogProvider>
            <Switch>
              <DefaultLayout path="/log/:log_id" exact component={LogCont} />
              <DefaultLayout path="/log" component={Log} />
            </Switch>
          </LogProvider>
          <DefaultLayout path="/wall" component={Wall} />

          {/* 控制台 */}
          <PrivateRoute exact path="/admin" component={Admin} />
          <TreeProvider>
            <Switch>
              <PrivateRoute path="/admin/tree/:first_id/:second_id" component={Tree} />
              <PrivateRoute path="/admin/tree" component={Tree} />
            </Switch>
          </TreeProvider>
          <LogProvider>
            <Switch>
              <PrivateRoute path="/admin/log/:log_id" exact component={LogCont} />
              <PrivateRoute path="/admin/log" component={Log} />
            </Switch>
          </LogProvider>
          <PrivateRoute path="/admin/wall" component={Wall} />
        </Suspense>
      </Router>
    </div>
  );
}

export default Router;