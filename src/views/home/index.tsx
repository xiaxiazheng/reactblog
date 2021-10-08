import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { IImageType, getImgList } from "@/client/ImgHelper";
import { staticUrl } from "@/env_config";
import classnames from "classnames";
import { UserContext } from "@/context/UserContext";
import { withRouter, RouteComponentProps } from "react-router-dom";
import beian from "@/assets/beian.png";

interface IHome extends RouteComponentProps {}

const Home: React.FC<RouteComponentProps> = (props) => {
    const { history } = props;

    const [backgroundUrl, setBackgroundUrl] = useState("");
    const { username } = useContext(UserContext);

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

    useEffect(() => {
        let imgList: any = [];
        const getData = async () => {
            const res: IImageType[] = await getImgList("main", username);
            for (let item of res) {
                // 拼好 img 的 url
                imgList.push({
                    ...item,
                    imageUrl: `${staticUrl}/img/main/${item.filename}`,
                    imageMinUrl:
                        item.has_min === "1"
                            ? `${staticUrl}/min-img/${item.filename}`
                            : "",
                });
            }
            imgList[0] && setBackgroundUrl(imgList[0].imageUrl);
        };

        getData();
    }, [username]);

    const homgClass = classnames({
        [styles.Home]: true,
        ScrollBar: true,
    });

    return (
        <div
            className={homgClass}
            style={{ backgroundImage: `url(${backgroundUrl})` }}
        >
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
                {/* <div>
                    <a
                        target="_blank"
                        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602005623"
                        rel="noreferrer"
                        style={{
                            display: "inline-block",
                            textDecoration: "none",
                            height: "20px",
                            lineHeight: "20px",
                        }}
                    >
                        <img src={beian} alt="备案" />
                        <span>粤公网安备 44010602005623号</span>
                    </a>
                    <a
                        href="http://www.beian.miit.gov.cn"
                        rel="noreferrer"
                        target="_blank"
                        style={{
                            display: "inline-block",
                            textDecoration: "none",
                            height: "20px",
                            lineHeight: "20px",
                        }}
                    >
                        <span>粤ICP备18097682号</span>
                    </a>
                </div> */}
            </footer>
        </div>
    );
};

export default withRouter(Home);
