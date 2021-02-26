import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import styles from "./index.module.scss";
import Header from "@/components/header";
import { BlogProvider } from "@/views/blog/BlogContext";
import { TreeProvider } from "@/views/tree/TreeContext";
import { fallback } from "./index";
const Home = lazy(() => import("../views/home"));
const Tree = lazy(() => import("../views/tree"));
const Blog = lazy(() => import("../views/blog"));
const BlogCont = lazy(() => import("../views/blog/blog-cont"));
// const Cloud = lazy(() => import("../views/cloud"));
// const Media = lazy(() => import("../views/media"));
const TestPage = lazy(() => import("../views/test-page"));

interface PropsType {
  component?: any;
  path?: string;
  exact?: boolean;
}

const HomeRouterView: React.FC<PropsType> = ({
  component: Component,
  ...rest
}) => {
  return (
    <>
      <div className={styles.RouterHead}>
        <Header></Header>
      </div>
      <Suspense fallback={fallback()}>
        <div className={styles.RouterView}>
          <Route exact path="/" component={Home} />
          <TreeProvider>
            <Switch>
              <Route path="/tree/:first_id/:second_id" exact component={Tree} />
              <Route path="/tree" component={Tree} />
            </Switch>
          </TreeProvider>
          <BlogProvider>
            <Switch>
              <Route path="/blog/:blog_id" exact component={BlogCont} />
              <Route path="/blog" component={Blog} />
            </Switch>
          </BlogProvider>
          {/* <Route path="/cloud" component={Cloud} /> */}
          {/* <Route path="/media" component={Media} /> */}
          <Route path="/test-page" component={TestPage} />
        </div>
      </Suspense>
    </>
  );
};

export default HomeRouterView;
