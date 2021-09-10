import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./index.module.scss";
// import { withRouter, match } from 'react-router';
// import { History, Location } from 'history';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getChildName } from "@/client/TreeHelper";
import { getNodeCont } from "@/client/TreeContHelper";
import { ImgType } from "@/client/ImgHelper";
import { staticUrl } from "@/env_config";
import Loading from "@/components/loading";
import PreviewImage from "@/components/preview-image";
import { TreeContext } from "../../TreeContext";
import { default as imgPlaceHolder } from "@/assets/loading.svg";
// 代码高亮
import hljs from "highlight.js";
// import "highlight.js/styles/atom-one-dark-reasonable.css";
import "highlight.js/styles/vs2015.css";
import { Button, Drawer } from "antd";
import {
    EnvironmentOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined,
} from "@ant-design/icons";

interface PropsType extends RouteComponentProps {
    first_id: string;
    second_id: string;
}

interface TreeContType {
    c_id: string;
    cont: string;
    cont_id: string;
    cTime: string;
    imgList: ImgType[];
    mTime: string;
    sort: number;
    title: string;
}

const TreeContShow: React.FC<PropsType> = (props) => {
    const { location, second_id } = props;
    const { treeContTitle, setTreeContTitle } = useContext(TreeContext);

    const contShowRef = useRef<any>(null); // 用来滚动
    const contRef = useRef<any>(null); // 用来添加代码高亮

    const [previewImg, setPreviewImg] = useState("");
    const [previewImgName, setPreviewImgName] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // console.log('second_id', second_id);

        second_id && getTreeCont();
    }, [second_id]);

    const [hashValue, setHashValue] = useState("");

    useEffect(() => {
        if (location.hash !== "") {
            // 获取哈希值（用的是 sort）
            let list = location.hash.split("");
            list.shift(); // 去掉 #
            setHashValue(list.join(""));
            // 锚点跳转
            let dom: any = document.getElementById(
                `${second_id}-${list.join("")}`
            );
            dom && dom.scrollIntoView();
        } else {
            // 这里是为了切换该组件实例时回到头部
            let dom: any = contShowRef.current;
            dom && (dom.scrollTop = 0);
        }

        return () => {
            setHashValue(""); // 这个设置回来，不然切换之后指定顺序的依然高亮
        };
    }, [location]);

    const [contList, setContList] = useState<TreeContType[]>([]);

    // 获取树当前节点具体内容数据
    const getTreeCont = async () => {
        setLoading(true);

        // 获取标题，标题存到了 TreeContext
        const res = await getChildName(second_id);
        res && setTreeContTitle(res || "");

        // 获取数据
        let res2 = await getNodeCont(second_id);
        if (res2) {
            res2.forEach((item: any) => {
                item.cont = item.cont.replace(/</g, "&lt;"); // html标签的<转成实体字符,让所有的html标签失效
                item.cont = item.cont.replace(/&lt;pre/g, "<pre"); // 把pre标签转回来
                item.cont = item.cont.replace(/pre>\n/g, "pre>"); // 把pre后面的空格去掉
                item.cont = item.cont.replace(/&lt;\/pre>/g, "</pre>"); // 把pre结束标签转回来
                item.cont = item.cont.replace(/ {2}/g, "&nbsp;&nbsp;"); // 把空格转成实体字符，以防多空格被合并
                item.cont = item.cont.replace(/\n|\r\n/g, "<br/>"); // 把换行转成br标签
            });
            setContList(res2);
            setLoading(false);
        }
    };

    // 添加代码高亮
    useEffect(() => {
        let dom: any = contRef.current;
        if (dom) {
            document.querySelectorAll("pre").forEach((block: any) => {
                hljs.highlightBlock(block);
            });
        }
    });

    // 保存所有图片的 ref
    const [refMap, setRefMap] = useState<any>({});
    useEffect(() => {
        const map: any = {};
        contList.forEach((item) => {
            item.imgList.forEach((jtem) => {
                let imgId: string = jtem.img_id;
                map[imgId] = React.createRef();
            });
        });
        setRefMap(map);
    }, [contList]);

    // 交叉观察器加载图片
    useEffect(() => {
        let observer = new IntersectionObserver((entries) => {
            entries.forEach((item) => {
                if (item.isIntersecting) {
                    const img: any = item.target;
                    if (encodeURI(img["dataset"]["src"]) !== img["src"]) {
                        img["src"] = img["dataset"]["src"];
                    }
                }
            });
        });
        const list = Object.keys(refMap).map((item) => refMap[item]);
        list.forEach(
            (item) => item.current !== null && observer.observe(item.current)
        );
    }, [refMap]);

    const scrollTo = (type: "top" | "bottom") => {
        contShowRef.current.scroll({
            left: 0,
            top: type === "top" ? 0 : Number.MAX_SAFE_INTEGER,
            behavior: "smooth",
        });
        // contShowRef.current.scrollTop = type === 'top' ? 0 : Number.MAX_SAFE_INTEGER
    };

    const Mao = () => (
        <>
            {loading && <Loading />}
            {contList.map((item) => {
                return (
                    <a
                        key={item.sort}
                        href={`#${item.sort}`}
                        className={hashValue === `${item.sort}` ? "active" : ""}
                        onClick={() => setVisible(false)}
                    >
                        {item.title}
                    </a>
                );
            })}
        </>
    );

    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            <div className={`${styles.treecontshow}`}>
                {loading && <Loading />}
                <div
                    className={`${styles.treecontshowWrapper} ScrollBar`}
                    ref={contShowRef}
                >
                    <h2 className={styles.treecontTitle}>{treeContTitle}</h2>
                    {contList.map((item) => {
                        return (
                            <div
                                ref={contRef}
                                key={item.cont_id}
                                className={styles.contitem}
                            >
                                <h3 className={styles.contitemTitle}>
                                    <a
                                        href={`#${item.sort}`}
                                        id={`${item.c_id}-${item.sort}`}
                                        className={
                                            hashValue === `${item.sort}`
                                                ? "active"
                                                : ""
                                        }
                                    >
                                        {item.title}
                                    </a>
                                    <span>
                                        <span>
                                            字数：
                                            {
                                                item.cont.replaceAll("\n", "")
                                                    .length
                                            }
                                        </span>
                                        &nbsp;&nbsp;
                                        <span>修改时间：{item.mTime}</span>
                                    </span>
                                </h3>
                                <div
                                    className={styles.contitemCont}
                                    dangerouslySetInnerHTML={{
                                        __html: item.cont,
                                    }}
                                ></div>
                                {/* 展示图片 */}
                                {item.imgList.length !== 0 &&
                                    item.imgList.map((imgItem) => {
                                        return (
                                            <div
                                                key={imgItem.img_id}
                                                className={styles.contitemImg}
                                            >
                                                <img
                                                    ref={refMap[imgItem.img_id]}
                                                    src={imgPlaceHolder}
                                                    data-src={`${staticUrl}/img/treecont/${imgItem.filename}`}
                                                    alt={imgItem.imgname}
                                                    title={imgItem.imgname}
                                                    onClick={() => {
                                                        setPreviewImg(
                                                            `${staticUrl}/img/treecont/${imgItem.filename}`
                                                        );
                                                        setPreviewImgName(
                                                            imgItem.imgname
                                                        );
                                                    }}
                                                />
                                                <span
                                                    className={styles.imgName}
                                                >
                                                    {imgItem.imgname}
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                        );
                    })}
                </div>

                {/* 锚点们 */}
                <div className={`${styles.mao} ScrollBar`}>
                    <Mao />
                </div>

                {/* 图片预览 */}
                <PreviewImage
                    isPreview={previewImg !== ""}
                    imageName={previewImgName}
                    imageUrl={previewImg}
                    closePreview={() => {
                        setPreviewImg("");
                        setPreviewImgName("");
                    }}
                />

                {/* 回到顶部 */}
                <Button
                    className={styles.scrollToTop}
                    title="回到顶部"
                    type="primary"
                    shape="circle"
                    icon={<VerticalAlignTopOutlined />}
                    size="large"
                    onClick={scrollTo.bind(null, "top")}
                />
                {/* 回到底部 */}
                <Button
                    className={styles.scrollToBottom}
                    title="回到底部"
                    type="primary"
                    shape="circle"
                    icon={<VerticalAlignBottomOutlined />}
                    size="large"
                    onClick={scrollTo.bind(null, "bottom")}
                />

                {window.screen.availWidth <= 720 && (
                    <>
                        <Drawer
                            title={"锚点"}
                            placement="bottom"
                            closable={true}
                            onClose={() => {
                                setVisible(!visible);
                            }}
                            className={styles.drawer}
                            height={"auto"}
                            visible={visible}
                        >
                            <Mao />
                        </Drawer>
                        <Button
                            className={styles.openMao}
                            title="打开锚点列表"
                            type="primary"
                            shape="circle"
                            icon={<EnvironmentOutlined />}
                            size="large"
                            onClick={() => {
                                setVisible(true);
                            }}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default withRouter(TreeContShow);
