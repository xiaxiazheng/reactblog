import React, { lazy, Suspense, useState, useEffect } from "react";
import { RouteComponentProps, Switch, withRouter } from "react-router-dom";
import styles from "./index.module.scss";
import AdminHeader from "@/components/amdin-header";
import { AuthRoute } from "./AuthRoute";
import { BlogProvider } from "@/views/blog/BlogContext";
import { TreeProvider } from "@/views/tree/TreeContext";
import { fallback } from "./index";
import ImageManage from "@/views/image-manage";
import cmd from "@/views/cmd";

const Tree = lazy(() => import(/* webpackChunkName: "Tree" */ "../views/tree"));
const Blog = lazy(() => import(/* webpackChunkName: "Blog" */ "../views/blog"));
const BlogCont = lazy(
    () => import(/* webpackChunkName: "BlogCont" */ "../views/blog/blog-cont")
);
// const Note = lazy(() => import(/* webpackChunkName: "Note" */ "../views/note"));
const Admin = lazy(
    () => import(/* webpackChunkName: "Admin" */ "../views/admin")
);
const Cloud = lazy(
    () => import(/* webpackChunkName: "Cloud" */ "../views/cloud")
);
const Media = lazy(
    () => import(/* webpackChunkName: "Media" */ "../views/media")
);
const TestPage = lazy(
    () => import(/* webpackChunkName: "TestPage" */ "../views/test-page")
);
const MaoPu = lazy(
    () => import(/* webpackChunkName: "MaoPu" */ "../views/mao-pu")
);
const MindMap = lazy(
    () => import(/* webpackChunkName: "MindMap" */ "../views/mind-map")
);
const TodoList = lazy(
    () => import(/* webpackChunkName: "Todo" */ "../views/todo-list")
);
const Log = lazy(() => import(/* webpackChunkName: "Log" */ "../views/log"));
const Music = lazy(
    () => import(/* webpackChunkName: "Music" */ "../views/music")
);
const Settings = lazy(
    () => import(/* webpackChunkName: "Settings" */ "../views/settings")
);

interface PropsType extends RouteComponentProps {
    component?: any;
    path?: string;
    exact?: boolean;
}

export const routes = [
    {
        route: "/admin/todo-list",
        name: "Todo",
        component: TodoList,
        isShow: true,
    },
    {
        route: "/admin/blog/:blog_id",
        name: "Blog",
        component: BlogCont,
        isShow: false,
    },
    { route: "/admin/blog", name: "Blog", component: Blog, isShow: true },

    { route: "/admin/music", name: "Music", component: Music, isShow: false },

    {
        route: "/admin/cloud/:parent_id",
        name: "Cloud",
        component: Cloud,
        isShow: false,
    },
    { route: "/admin/cloud", name: "Cloud", component: Cloud, isShow: true },

    { route: "/admin/cmd", name: "CMD", component: cmd, isShow: true },

    { route: "/admin/tree", name: "Tree", component: Tree, isShow: true },

    {
        route: "/admin/tree/:first_id/:second_id",
        name: "Tree",
        component: Tree,
        isShow: false,
    },

    {
        route: "/admin/image-manage",
        name: "ImageManage",
        component: ImageManage,
        isShow: false,
    },

    {
        route: "/admin/mindmap",
        name: "MindMap",
        component: MindMap,
        isShow: false,
    },

    { route: "/admin/media", name: "Media", component: Media, isShow: false },

    {
        route: "/admin/test-page",
        name: "TestPage",
        component: TestPage,
        isShow: false,
        exact: false,
    },

    { route: "/admin/maopu", name: "猫谱", component: MaoPu, isShow: false },
    
    { route: "/admin/settings", name: "Settings", component: Settings, isShow: false },
    // { route: "/admin/log", name: 'log', component: Log, isShow: false },
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
    }, [location]);

    return (
        <>
            <div className={styles.AdminRouterHead}>
                <AdminHeader
                    // 会显示到导航上的路由
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
                            {routes.map((item, index) => {
                                return (
                                    <AuthRoute
                                        key={index}
                                        exact={
                                            typeof item.exact !== "undefined"
                                                ? item.exact
                                                : true
                                        }
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
