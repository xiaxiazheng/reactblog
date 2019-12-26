import React, { lazy, Suspense, useContext } from 'react';
import { BrowserRouter, HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import styles from './Router.module.scss';
import { PrivateRoute } from './PrivateRoute';
import Header from '../components/header/Header';
import { LogProvider } from '../views/log/LogContext';
import { TreeProvider } from '../views/tree/TreeContext';
import { appUser } from '../env_config';
import Loading from '../components/loading/Loading';

const Log = lazy(() => import('../views/log/Log'));
const Home = lazy(() => import('../views/home/Home'));
const Tree = lazy(() => import('../views/tree/Tree'));
const LogCont = lazy(() => import('../views/log/log-cont/LogCont'));
const Login = lazy(() => import('../views/login/Login'));
const Admin = lazy(() => import('../views/admin/Admin'));
const Wall = lazy(() => import('../views/wall/Wall'));

const Router: React.FC = () => {

  // loading 界面
  const fallback = () =>{
    return (
      <Loading fontSize={80} />
    );
  };

  // const Router: any = appUser === 'hyp' ? HashRouter : BrowserRouter;
  const Router: any = BrowserRouter;

  // const Layout = ({ children }) => {
  //   return (
  //     <>
  //       <div className={styles.RouterHead}>
  //         <Header></Header>
  //       </div>
  //       <div className={styles.RouterView}>
  //         {children}
  //       </div>
  //     </>
  //   )
  // }

  // const DefaultLayout = ({component: Component, ...rest}) => {
  //   return (
  //     <Route {...rest} render={matchProps => (
  //       <>
  //         <div className={styles.RouterHead}>
  //           <Header></Header>
  //         </div>
  //         <div className={styles.RouterView}>
  //           <Component {...matchProps} />
  //         </div>
  //       </>
  //     )} />
  //   )
  // };

  return (
    <div className={styles.routerWrapper}>
      <Router>
        <div className={styles.RouterHead}>
          <Header></Header>
        </div>
        <Suspense fallback={fallback()}>
          <div className={styles.RouterView}>
            {/* 登录 */}
            <Route path="/login" component={Login} />

            {/* 前台 */}
            <Route exact path="/" component={Home} />
            <TreeProvider>
              <Switch>
                <Route path="/tree/:first_id/:second_id/:third_id" component={Tree} />
                <Route path="/tree" component={Tree} />
              </Switch>              
            </TreeProvider>
            <LogProvider>
              <Switch>
                <Route path="/log/:log_class/:log_id" exact component={LogCont} />
                <Route path="/log/:log_class" component={Log} />
              </Switch>
            </LogProvider>
            <Route path="/wall" component={Wall} />
            {/* 控制台 */}
            <PrivateRoute exact path="/admin" component={Admin} />
            <TreeProvider>
              <Switch>
                <PrivateRoute path="/admin/tree/:first_id/:second_id/:third_id" component={Tree} />
                <PrivateRoute path="/admin/tree" component={Tree} />
              </Switch>
            </TreeProvider>
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