import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./index.module.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getChildName } from "@/client/TreeHelper";
import { getNodeCont } from "@/client/TreeContHelper";
import { ImageType } from "@/client/ImgHelper";
import { staticUrl } from "@/env_config";
import Loading from "@/components/loading";
import PreviewImage from "@/components/preview-image";
import { TreeContext } from "../../TreeContext";
import { default as imgPlaceHolder } from "@/assets/loading.svg";
// 代码高亮
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
import { Button } from "antd";
import {
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined,
} from "@ant-design/icons";
import useScrollToHook from "@/hooks/useScrollToHooks";

interface PropsType extends RouteComponentProps {
    first_id: string;
    second_id: string;
}

interface TreeContType {
    c_id: string;
    cont: string;
    cont_id: string;
    cTime: string;
    imgList: ImageType[];
    mTime: string;
    sort: number;
    title: string;
}

const TreeContShow: React.FC<PropsType> = (props) => {
    const { location, second_id } = props;
    const { treeContTitle, setTreeContTitle } = useContext(TreeContext);

    const contShowRef = useRef<any>(null); // 用来滚动
    const contRef = useRef<any>(null); // 用来添加代码高亮

    const [previewImgUrl, setPreviewImgUrl] = useState("");
    const [previewImg, setPreviewImg] = useState<ImageType>();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    const { scrollToTop, scrollToBottom } = useScrollToHook(contShowRef);

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

    // 迁移到 todo，连着图片一起迁移
    // const transferToTodo = () => {
    //     const contSum = contList?.length || 0;
    //     const imgSum = contList?.reduce((prev: any, cur: any) => {
    //         prev += cur.imgList.length;
    //         return prev;
    //     }, 0);
    //     console.log("cont 数量, ", contSum);
    //     console.log("图片数量，", imgSum);
    //     let imgErrorCount = 0;
    //     let imgDoneCount = 0;
    //     let contDoneCount = 0;

    //     contList.forEach((item) => {
    //         item.imgList = item.imgList.map((i) => {
    //             return {
    //                 ...i,
    //                 imgUrl: `${staticUrl}/img/treecont/${i.filename}`,
    //             };
    //         });
    //     });

    //     const addTodo = async (item: any) => {
    //         const req: CreateTodoItemReq = {
    //             name: `${treeContTitle}，${item.title}`,
    //             time: dayjs(item.cTime).format("YYYY-MM-DD"),
    //             status: TodoStatus.done,
    //             description: item.cont.replaceAll("<br/>", "\n\n") || "",
    //             color: "2",
    //             category: "diary",
    //             other_id: "",
    //             doing: "0",
    //             isNote: "0",
    //             isTarget: "0",
    //             isBookMark: "0",
    //         };
    //         const res = await addTodoItem(req);
    //         if (res) {
    //             contDoneCount++;
    //             console.log("contDoneCount", contDoneCount, "/", contSum);
    //             contSum === contDoneCount && console.log("cont 完成");
    //             const other_id = res.data.newTodoItem.todo_id;
    //             item.imgList?.forEach((img: any) => {
    //                 runFive(() =>
    //                     handleUploadImage(img.imgUrl, other_id, img.imgname)
    //                 );
    //             });
    //         }
    //     };

    //     // 确保这个函数只跑最多五个，其他的要等才行
    //     let count = 0;
    //     let list: any[] = [];
    //     const runFive = async (fn: any) => {
    //         const promise = new Promise((resolve) => {
    //             list.push(resolve);
    //         });

    //         if (count < 5) {
    //             count++;
    //             list.shift()();
    //         }

    //         await promise;
    //         await fn();

    //         count--;
    //         list.length !== 0 && list.shift()();
    //     };

    //     const handleUploadImage = async (
    //         url: string,
    //         other_id: string,
    //         filename: string
    //     ) => {
    //         const file = await urlToBlob(url, filename);
    //         file && (await handleUpload(file, other_id));
    //         imgDoneCount++;
    //         console.log("imgDoneCount", imgDoneCount, "/", imgSum);
    //         imgDoneCount === imgSum && console.log("img 完成");
    //     };

    //     const urlToBlob = (url: string, filename = "") => {
    //         return fetch(url)
    //             .then((res) => res.blob())
    //             .then((blob) => {
    //                 if (!blob.type.includes("image")) {
    //                     message.error("请输入图片的 url，当前 url 抓不到图片");
    //                     imgErrorCount++;
    //                     console.log("imgErrorCount", imgErrorCount);
    //                     console.log("url", url);
    //                     return false;
    //                 }
    //                 const file = new File([blob], filename, {
    //                     type: blob.type,
    //                 });
    //                 return file;
    //             });
    //     };

    //     const handleUpload = (file: File, other_id = "") => {
    //         return new Promise((resolve) => {
    //             const username = "zyb";
    //             const type = "todo";

    //             const formData = new FormData();
    //             formData.append("other_id", other_id);
    //             formData.append("username", username);
    //             formData.append(type, file);

    //             fetch(`${staticUrl}/api/${type}_upload`, {
    //                 method: "POST",
    //                 body: formData,
    //             })
    //                 .then((res) => res.json())
    //                 .then((res) => {
    //                     message.success(res.message);
    //                 })
    //                 .catch((e) => {
    //                     console.log(e);
    //                 })
    //                 .finally(() => {
    //                     resolve("");
    //                 });
    //         });
    //     };

    //     contList.forEach((item) => {
    //         runFive(() => addTodo(item));
    //     });
    // };

    // // 删除当前 cont 下所有图片
    // const deleteImgs = () => {
    //     // console.log("contList", contList);
    //     let l: any = [];
    //     contList.forEach((item) => {
    //         l = l.concat(item.imgList);
    //     });
    //     console.log(l);

    //     // 确保这个函数只跑最多五个，其他的要等才行
    //     let count = 0;
    //     let list: any[] = [];
    //     const runFive = async (fn: any) => {
    //         const promise = new Promise((resolve) => {
    //             list.push(resolve);
    //         });

    //         if (count < 5) {
    //             count++;
    //             list.shift()();
    //         }

    //         await promise;
    //         await fn();

    //         count--;
    //         list.length !== 0 && list.shift()();
    //     };

    //     let deleteCount = 0;
    //     const deleteImage = async (item: any) => {
    //         const params = {
    //             type: "treecont",
    //             img_id: item.img_id,
    //             filename: item.filename,
    //         };
    //         const res = await deleteImg(params);
    //         if (res) {
    //             deleteCount++;
    //             console.log("delete img", deleteCount);
    //         } else {
    //             console.log("删除出错");
    //         }
    //     };

    //     l.forEach((item: any) => {
    //         runFive(() => deleteImage(item));
    //     });
    // };

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
                                                        setPreviewImgUrl(
                                                            `${staticUrl}/img/treecont/${imgItem.filename}`
                                                        );
                                                        setPreviewImg(imgItem);
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
                    isPreview={previewImgUrl !== ""}
                    image={previewImg}
                    imageUrl={previewImgUrl}
                    closePreview={() => {
                        setPreviewImgUrl("");
                        setPreviewImg(undefined);
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
                    onClick={() => scrollToTop()}
                />
                {/* 回到底部 */}
                <Button
                    className={styles.scrollToBottom}
                    title="回到底部"
                    type="primary"
                    shape="circle"
                    icon={<VerticalAlignBottomOutlined />}
                    size="large"
                    onClick={() => scrollToBottom()}
                />
            </div>
        </>
    );
};

export default withRouter(TreeContShow);
