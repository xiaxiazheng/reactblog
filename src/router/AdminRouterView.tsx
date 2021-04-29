/*
 * @Author: xiaxiazheng
 */
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
const Cloud = lazy(() => import("../views/cloud"));
const Media = lazy(() => import("../views/media"));
const TestPage = lazy(() => import("../views/test-page"));
const MaoPu = lazy(() => import("../views/mao-pu"));
const MindMap = lazy(() => import("../views/mind-map"))

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
            <AuthRoute path="/admin/cloud/:parent_id" component={Cloud} />
            <AuthRoute path="/admin/cloud" component={Cloud} />
          </Switch>
          <AuthRoute path="/admin/media" component={Media} />
          <AuthRoute path="/admin/test-page" component={TestPage} />
          <AuthRoute path="/admin/maopu" component={MaoPu} />
          <AuthRoute path="/admin/mindmap" component={MindMap} />
        </div>
      </Suspense>
    </>
  );
};

export default AdminRouterView;
