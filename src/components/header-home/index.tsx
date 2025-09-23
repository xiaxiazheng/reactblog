import React, { useState, useContext, useEffect } from "react";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { UserContext } from "@/context/UserContext";

interface PropsType extends RouteComponentProps {}

const HeaderHome: React.FC<PropsType> = (props) => {
    const { username, setUsername } = useContext(UserContext);

    const titleMap: any = {
        zyb: "XIAXIAZheng",
        hyp: "阿苹的小站",
    };

    const HeaderContent = () => (
        <header className={styles.Header}>
            <span
                className={styles.headerLeft}
            >
                <Link to={"/"}>{titleMap?.[username] || titleMap.zyb}</Link>
            </span>
            {/* <span className={styles.headerRight}> */}
                {/* 主题切换开关 */}
                {/* <Switch
                    className={styles.switch}
                    checkedChildren="light"
                    unCheckedChildren="dark"
                    checked={theme === "light"}
                    onClick={switchTheme}
                /> */}
                {/* 导航 */}
                {/* <Menu
                    onClick={handleClickTabs}
                    selectedKeys={[current]}
                    mode={"horizontal"}
                    className={styles.headerRouteList}
                >
                    <Menu.Item key="todo">
                        <BookOutlined className={styles.headerIcon} />
                        <Link to={"/todo"}>todo</Link>
                    </Menu.Item>
                    <Menu.Item key="blog">
                        <BookOutlined className={styles.headerIcon} />
                        <Link to={"/blog"}>Blog</Link>
                    </Menu.Item>
                    <Menu.Item key="test-page">
                        {
                            // @ts-ignore
                            <CodepenOutlined className={styles.headerIcon} />
                        }
                        <Link to={"/test-page"}>TestPage</Link>
                    </Menu.Item>
                </Menu> */}
            {/* </span> */}
        </header>
    );

    return <HeaderContent />;
};

export default withRouter(HeaderHome);
