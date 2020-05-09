import React, { lazy } from "react";
import { Route, Switch } from 'react-router-dom';
import styles from "./index.module.scss";
import Header from "@/components/header";
import { LogProvider } from "@/views/log/LogContext";
import { TreeProvider } from "@/views/tree/TreeContext";
const Home = lazy(() => import('../views/home'));
const Tree = lazy(() => import('../views/tree'));
const Log = lazy(() => import('../views/log'));
const LogCont = lazy(() => import('../views/log/log-cont'));
const Wall = lazy(() => import('../views/wall'));
const Media = lazy(() => import('../views/media'));

interface PropsType {
  component?: any;
  path?: string;
  exact?: boolean;
}

const HomeRouterView: React.FC<PropsType> = ({ component: Component, ...rest }) => {
  const RouteBox = () => {
    return (
      <>
        <Route exact path="/" component={Home} />
        <TreeProvider>
          <Switch>
            <Route path="/tree/:first_id/:second_id" exact component={Tree} />
            <Route path="/tree" component={Tree} />
          </Switch>              
        </TreeProvider>
        <LogProvider>
          <Switch>
            <Route path="/log/:log_id" exact component={LogCont} />
            <Route path="/log" component={Log} />
          </Switch>
        </LogProvider>
        <Route path="/wall" component={Wall} />
        <Route path="/media" component={Media} />
      </>
    )
  };

  return (
    <>
      <div className={styles.RouterHead}>
        <Header></Header>
      </div>
      <div className={styles.RouterView}>
        <RouteBox />
      </div>
    </>
  );
};

export default HomeRouterView;
