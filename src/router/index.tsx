import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styles from './index.module.scss';
import Loading from '@/components/loading';

const Login = lazy(() => import('../views/login'));
const AdminRouterView = lazy(() => import('./AdminRouterView'));
const HomeRouterView = lazy(() => import('./HomeRouterView'));
const PDFView = lazy(() => import('@/views/pdf'))

const Router: React.FC = () => {

  // loading 界面
  const fallback = () =>{
    return (
      <Loading />
    );
  };

  const Router = BrowserRouter;

  return (
    <div className={styles.routerWrapper}>
      <Router>
        <Suspense fallback={fallback()}>
          <Switch>
            {/* 登录页 */}
            <Route exact path="/login" component={Login} />
            {/* 控制台页 */}
            <Route path='/admin' component={AdminRouterView} />
            {/* 空白页 */}
            <Route path='/pdf' component={PDFView} />
            {/* 访客页 */}
            <Route path='/' component={HomeRouterView} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default Router;