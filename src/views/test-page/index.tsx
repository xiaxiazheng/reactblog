import React, { useContext, useEffect, useState, lazy } from "react";
import styles from "./index.module.scss";
import { Route, useHistory, withRouter } from "react-router-dom";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { IsLoginContext } from "@/context/IsLoginContext";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const H5 = lazy(() => import("./h5"));
const KNN = lazy(() => import("./knn"));
const VirtualScroll = lazy(() => import("./virtual-scroll"));
const KeepAlive = lazy(() => import("./keep-alive"));
const MousePosition = lazy(() => import("./mouse-position"));

const compList = [
    { path: "H5", name: "H5", component: H5 },
    { path: "knn", name: "knn", component: KNN },
    {
        path: "virtual-scroll",
        name: "virtual-scroll",
        component: VirtualScroll,
    },
    // { path: "keep-alive", name: "keep-alive", component: KeepAlive },
    {
        path: "mouse-position",
        name: "mouse-position",
        component: MousePosition,
    },
];

const Home = () => {
    const { isLogin } = useContext(IsLoginContext);
    const history = useHistory();

    return (
        <div className={styles.home}>
            {compList.map((item) => {
                const path = `${isLogin ? "/admin" : ""}/test-page/${
                    item.path
                }`;
                return (
                    <div key={item.name} onClick={() => history.push(path)}>
                        {item.name}
                    </div>
                );
            })}
        </div>
    );
};

const TestPage: React.FC = () => {
    const { isLogin } = useContext(IsLoginContext);
    const history = useHistory();

    useDocumentTitle("测试页");

    return (
        <div className={`${styles.testPage} ScrollBar`}>
            <Route
                path={`${isLogin ? "/admin" : ""}/test-page`}
                component={Home}
                exact
            />
            {compList.map((item) => {
                const path = `${isLogin ? "/admin" : ""}/test-page/${
                    item.path
                }`;
                return (
                    <Route
                        key={item.name}
                        path={path}
                        component={(props: any) => {
                            const Comp = item.component;
                            return (
                                <>
                                    <Button
                                        className={styles.backButton}
                                        type="primary"
                                        onClick={() =>
                                            history.push(
                                                `${
                                                    isLogin ? "/admin" : ""
                                                }/test-page`
                                            )
                                        }
                                    >
                                        <LeftOutlined type="left" />
                                        返回
                                    </Button>
                                    <Comp {...props} />
                                </>
                            );
                        }}
                    />
                );
            })}
        </div>
    );
};

export default withRouter(TestPage);
