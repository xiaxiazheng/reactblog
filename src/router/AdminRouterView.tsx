/*
 * @Author: xiaxiazheng
 */
import React, { lazy, Suspense, useState, useEffect } from "react";
import { RouteComponentProps, Switch, withRouter } from "react-router-dom";
import styles from "./index.module.scss";
import AdminHeader from "@/components/amdin-header";
import { AuthRoute } from "./AuthRoute";
import { BlogProvider } from "@/views/blog/BlogContext";
import { TreeProvider } from "@/views/tree/TreeContext";
import { fallback } from "./index";
const Tree = lazy(() => import("../views/tree"));
const Blog = lazy(() => import("../views/blog"));
const BlogCont = lazy(() => import("../views/blog/blog-cont"));
const Admin = lazy(() => import("../views/admin"));
const Cloud = lazy(() => import("../views/cloud"));
const Media = lazy(() => import("../views/media"));
const TestPage = lazy(() => import("../views/test-page"));
const MaoPu = lazy(() => import("../views/mao-pu"));
const MindMap = lazy(() => import("../views/mind-map"));
const TodoList = lazy(() => import("../views/todo-list"));
const Log = lazy(() => import("../views/log"));

interface PropsType extends RouteComponentProps {
  component?: any;
  path?: string;
  exact?: boolean;
}

export const routes = [
  { route: "/admin/todo-list", name: "todoList", component: TodoList },
  {
    route: "/admin/tree/:first_id/:second_id",
    name: "Tree",
    component: Tree,
  },
  { route: "/admin/tree", name: "Tree", component: Tree },
  { route: "/admin/blog/:blog_id", name: "Blog", component: BlogCont },
  { route: "/admin/blog", name: "Blog", component: Blog },
  { route: "/admin/mindmap", name: "MindMap", component: MindMap },
  { route: "/admin/cloud/:parent_id", name: "Cloud", component: Cloud },
  { route: "/admin/cloud", name: "Cloud", component: Cloud },
  { route: "/admin/media", name: "Media", component: Media },
  { route: "/admin/test-page", name: "TestPage", component: TestPage },
  { route: "/admin/maopu", name: "猫谱", component: MaoPu },
  // { route: "/admin/log", name: 'log', component: Log },
];

const AdminRouterView: React.FC<PropsType> = (props) => {
  const { location } = props;

  const [current, setCurrent] = useState<string>();
  // 用于刷新的时候将当前导航栏高亮
  useEffect(() => {
    const l = location.pathname.split("/");
    if (l.length >= 3) {
      setCurrent(`/${l[1]}/${l[2]}`);
    } else {
      setCurrent(location.pathname);
    }
    if (location.pathname === "/login") {
      setCurrent("admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      <div className={styles.AdminRouterHead}>
        <AdminHeader
          routes={routes.filter((item) => !item.route.includes(":"))}
          current={current}
          setCurrent={setCurrent}
        />
      </div>
      <Suspense fallback={fallback()}>
        <div className={styles.AdminRouterView}>
          <TreeProvider>
            <BlogProvider>
              <AuthRoute exact path="/admin" component={Admin} />
              {routes.map((item) => {
                return (
                  <AuthRoute
                    exact
                    path={item.route}
                    component={item.component}
                  />
                );
              })}
            </BlogProvider>
          </TreeProvider>
        </div>
      </Suspense>
    </>
  );
};

export default withRouter(AdminRouterView);
