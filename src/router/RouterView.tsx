import React, { lazy, useContext, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { IsLoginContext } from "../context/IsLoginContext";
import { message } from "antd";
import { postLogin } from "../client/UserHelper";
import styles from "./index.module.scss";
import Header from "@/components/header";
import { PrivateRoute } from "./PrivateRoute";
import { LogProvider } from "@/views/log/LogContext";
import { TreeProvider } from "@/views/tree/TreeContext";
const Tree = lazy(() => import("../views/tree"));
const Log = lazy(() => import("../views/log"));
const LogCont = lazy(() => import("../views/log/log-cont"));
const Login = lazy(() => import("../views/login"));
const Admin = lazy(() => import("../views/admin"));
const Wall = lazy(() => import("../views/wall"));
const Media = lazy(() => import("../views/media"));

interface PropsType {
  component?: any;
  path?: string;
  exact?: boolean;
}

const RouterView: React.FC<PropsType> = ({ component: Component, ...rest }) => {
  // const { isLogin, setIsLogin } = useContext(IsLoginContext);

  const RouteBox = () => {
    return (
      <>
        <PrivateRoute exact path="/admin" component={Admin} />
        <TreeProvider>
          <Switch>
            <PrivateRoute
              path="/admin/tree/:first_id/:second_id"
              exact
              component={Tree}
            />
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
        <PrivateRoute path="/admin/media" component={Media} />
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

export default RouterView;
