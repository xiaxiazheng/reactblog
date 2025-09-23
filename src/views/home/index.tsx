import React, { useEffect } from "react";
import styles from "./index.module.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";
import beian from "@/assets/beian.png";
import HomeTodo from "./home-todo";

interface IHome extends RouteComponentProps { }

const Home: React.FC<IHome> = (props) => {
    const { history } = props;

    // const { username } = useContext(UserContext);

    useEffect(() => {
        const listenLogin = (event: any) => {
            // 监听 ctrl + l 组合键，跳转到登录界面
            if (event.ctrlKey && event.keyCode === 76) {
                console.log("跳转到登录");
                history.push("/login");
                // 禁止浏览器的默认行为
                event.preventDefault();
            }
        };
        document.addEventListener("keydown", listenLogin);

        return () => {
            document.removeEventListener("keydown", listenLogin);
        };
    }, []);

    return (
        <div
            className={`${styles.Home} ScrollBar`}
        >
            <div className={`${styles.middle}`}>
                <HomeTodo />
            </div>
            <footer className={styles.footerBeian}>
                <div
                    style={{ padding: "20px 0" }}
                >
                    <a
                        target="_blank"
                        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602005623"
                        style={{
                            display: "inline-block",
                            textDecoration: "none",
                            height: "20px",
                            lineHeight: "20px",
                            verticalAlign: 'middle'
                        }}
                        rel="noreferrer"
                    >
                        <img src={beian} style={{ float: "left" }} />
                        <p
                            style={{
                                float: "left",
                                height: "20px",
                                lineHeight: "20px",
                                margin: "0px 0px 0px 5px",
                                color: "#939393"
                            }}
                        >
                            粤公网安备 44010602005623号
                        </p>
                    </a>
                    <a
                        href="https://beian.miit.gov.cn/"
                        rel="noreferrer"
                        target="_blank"
                        style={{
                            display: "inline-block",
                            textDecoration: "none",
                            height: "20px",
                            lineHeight: "20px",
                            verticalAlign: 'middle'
                        }}
                    >
                        <span>粤ICP备18097682号</span>
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default withRouter(Home);
