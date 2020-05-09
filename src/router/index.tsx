import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styles from './index.module.scss';
import Header from '@/components/header';
import { LogProvider } from '@/views/log/LogContext';
import { TreeProvider } from '@/views/tree/TreeContext';
import Loading from '@/components/loading';
import AdminRouterView from './AdminRouterView'
import HomeRouterView from './HomeRouterView'

const Login = lazy(() => import('../views/login'));

const Router: React.FC = () => {

  // loading 界面
  const fallback = () =>{
    return (
      <Loading />
    );
  };

  // const Router: any = appUser === 'hyp' ? HashRouter : BrowserRouter;
  const Router = BrowserRouter;

  /** 提供页面基本骨架 */
  // const DefaultLayout = (props: any) => {
  //   const {component: Component, ...rest} = props;
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
        <Suspense fallback={fallback()}>
          <Switch>
            {/* 登录页 */}
            <Route exact path="/login" component={Login} />
            {/* 控制台页 */}
            <Route path='/admin' component={AdminRouterView} />
            {/* 访客页 */}
            <Route path='/' component={HomeRouterView} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default Router;