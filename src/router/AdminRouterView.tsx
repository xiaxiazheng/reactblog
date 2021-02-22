import React, { lazy, Suspense } from "react";
import { Switch } from "react-router-dom";
import styles from "./index.module.scss";
import Header from "@/components/header";
import { AuthRoute } from "./AuthRoute";
import { BlogProvider } from "@/views/blog/BlogContext";
import { TreeProvider } from "@/views/tree/TreeContext";
import { fallback } from "./index";
const Tree = lazy(() => import("../views/tree"));
const Log = lazy(() => import("../views/blog"));
const BlogCont = lazy(() => import("../views/blog/blog-cont"));
const Admin = lazy(() => import("../views/admin"));
const Wall = lazy(() => import("../views/wall"));
const Media = lazy(() => import("../views/media"));
const Knn = lazy(() => import("../views/knn"));
const MaoPu = lazy(() => import("../views/mao-pu"));

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
      <Suspense fallback={fallback()}>
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
          <BlogProvider>
            <Switch>
              <AuthRoute path="/admin/blog/:blog_id" exact component={BlogCont} />
              <AuthRoute path="/admin/blog" component={Log} />
            </Switch>
          </BlogProvider>
          <Switch>
            <AuthRoute path="/admin/wall/:parent_id" component={Wall} />
            <AuthRoute path="/admin/wall" component={Wall} />
          </Switch>
          <AuthRoute path="/admin/media" component={Media} />
          <AuthRoute path="/admin/knn" component={Knn} />
          <AuthRoute path="/admin/maopu" component={MaoPu} />
        </div>
      </Suspense>
    </>
  );
};

export default AdminRouterView;
