import React, { lazy } from "react";
import { Switch } from "react-router-dom";
import styles from "./index.module.scss";
import Header from "@/components/header";
import { AuthRoute } from "./AuthRoute";
import { LogProvider } from "@/views/log/LogContext";
import { TreeProvider } from "@/views/tree/TreeContext";
const Tree = lazy(() => import("../views/tree"));
const Log = lazy(() => import("../views/log"));
const LogCont = lazy(() => import("../views/log/log-cont"));
const Admin = lazy(() => import("../views/admin"));
const Wall = lazy(() => import("../views/wall"));
const Media = lazy(() => import("../views/media"));

interface PropsType {
  component?: any;
  path?: string;
  exact?: boolean;
}

const AdminRouterView: React.FC<PropsType> = ({
  component: Component,
  ...rest
}) => {

  return (
    <>
      <div className={styles.RouterHead}>
        <Header />
      </div>
      <div className={styles.RouterView}>
        <AuthRoute exact path="/admin" component={Admin} />
        <TreeProvider>
          <Switch>
            <AuthRoute
              path="/admin/tree/:first_id/:second_id"
              exact
              component={Tree}
            />
            <AuthRoute path="/admin/tree" component={Tree} />
          </Switch>
        </TreeProvider>
        <LogProvider>
          <Switch>
            <AuthRoute path="/admin/log/:log_id" exact component={LogCont} />
            <AuthRoute path="/admin/log" component={Log} />
          </Switch>
        </LogProvider>
        <AuthRoute path="/admin/wall" component={Wall} />
        <AuthRoute path="/admin/media" component={Media} />
      </div>
    </>
  );
};

export default AdminRouterView;
