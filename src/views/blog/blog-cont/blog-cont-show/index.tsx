import React, { useState, useEffect, useRef, useContext } from "react";
import { OneBlogType } from "@/views/blog/BlogType";
import styles from "./index.module.scss";
import { getBlogCont } from "@/client/BlogHelper";
import Loading from "@/components/loading";
import classnames from "classnames";
import { IsLoginContext } from "@/context/IsLoginContext";
import { Button, message, Empty } from "antd";
import {
    CreditCardOutlined,
    FilePdfOutlined,
    ShareAltOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { addVisits } from "@/client/BlogHelper";
import BlogContMao from "../blog-cont-mao";
import { withRouter, RouteComponentProps } from "react-router-dom";
import MarkdownShow from "../markdown-show";
import RichtextShow from "../richtext-show";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import FileListBox from "@/components/file-image-handle/file-list-box";

interface PropsType extends RouteComponentProps {
    blog_id: string;
}

const BlogContShow: React.FC<PropsType> = (props) => {
    const { history, blog_id, match, location } = props;

    const [edittype, setEdittype] = useState<"richtext" | "markdown">(
        "richtext"
    );
    const [loading, setLoading] = useState(true);

    const { isLogin } = useContext(IsLoginContext);

    const blogcontShowWrapper = useRef<any>(null);

    const [blogData, setBlogData] = useState<OneBlogType>();
    const [visits, setVisits] = useState<Number>();

    useDocumentTitle(blogData?.title || "日志");

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            let id = decodeURIComponent(atob(blog_id));
            const res: OneBlogType = await getBlogCont(id);
            if (res) {
                setVisits(res?.visits);
                setBlogData(res);
                setEdittype(res?.edittype || "richtext");
                setLoading(false);
            }
        };
        getData();
    }, [blog_id]);

    // 统计访问量
    useEffect(() => {
        let visit: any;
        if (blogData) {
            visit = setTimeout(async () => {
                const res1 = await addVisits({
                    blog_id: decodeURIComponent(atob(blog_id)),
                    visits: Number(visits),
                });
                // isLogin && message.success(res1.message, 1);
                setVisits(res1.data.visits);
            }, 20000);
        }

        return () => {
            clearTimeout(visit);
        };
    }, [blogData]);

    const className = classnames({
        [styles.blogcontShow]: true,
        ScrollBar: true,
    });

    // 回到顶部或底部
    const scrollTo = (type: "top" | "bottom") => {
        blogcontShowWrapper.current.scroll({
            left: 0,
            top: type === "top" ? 0 : Number.MAX_SAFE_INTEGER,
            behavior: "smooth",
        });
        // contShowRef.current.scrollTop = type === 'top' ? 0 : Number.MAX_SAFE_INTEGER
    };

    // 导出到 pdf
    const exportPdf = () => {
        history.push({
            pathname: "/pdf",
            state: {
                type: edittype,
                blogData: blogData,
            },
        });
    };

    // 打开游客界面
    const openVisitor = () => {
        window.open(window.location.href.replace("/admin", ""), "__blank");
    };

    // 复制访客 url
    const copyVisitor = () => {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.setAttribute("value", window.location.href.replace("/admin", ""));
        input.select();
        document.execCommand("copy");
        message.success("复制访客路径成功", 1);
        document.body.removeChild(input);
    };

    return (
        <>
            <div className={className} ref={blogcontShowWrapper}>
                {loading ? (
                    <Loading />
                ) : !blogData || JSON.stringify(blogData) === "{}" ? (
                    <Empty
                        className={styles.empty}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="日志不存在"
                    />
                ) : (
                    <>
                        <div className={styles.title}>{blogData.title}</div>
                        <div className={styles.author}>{blogData.author}</div>
                        <div className={styles.time}>
                            <span>创建时间: {blogData.cTime}</span>
                            <span>修改时间: {blogData.mTime}</span>
                            {isLogin && <span>访问量：{visits}</span>}
                        </div>
                        {
                            // 富文本展示
                            edittype === "richtext" && (
                                <RichtextShow blogcont={blogData.blogcont} />
                            )
                        }
                        {
                            // markdown 展示
                            edittype === "markdown" && (
                                <MarkdownShow blogcont={blogData.blogcont} />
                            )
                        }
                        {blogData.fileList && blogData.fileList.length !== 0 && (
                            <div className={styles.fileList}>
                                <h4>附件：</h4>
                                <div>
                                    <FileListBox
                                        type="blog"
                                        width="140px"
                                        fileList={blogData.fileList}
                                        refresh={() => {}}
                                        isOnlyShow={true}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
                {/* 导出到 pdf 按钮 */}
                <Button
                    className={styles.exportPdf}
                    // type={'danger'}
                    onClick={exportPdf}
                >
                    <FilePdfOutlined />
                    导出
                </Button>
                {/* 打开访客界面 */}
                {isLogin && (
                    <Button
                        className={styles.openVisitor}
                        onClick={openVisitor}
                        title={"新窗口打开访客界面"}
                    >
                        <CreditCardOutlined />
                        访客
                    </Button>
                )}
                {/* 复制访客 url */}
                {isLogin && (
                    <Button
                        className={styles.copyVisitor}
                        onClick={copyVisitor}
                        title={"复制访客 url"}
                    >
                        <ShareAltOutlined />
                        分享
                    </Button>
                )}
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
                {/* 锚点 */}
                {blogData && (
                    <BlogContMao
                        blogcont={blogData.blogcont}
                        isHasFiles={
                            blogData.fileList && blogData.fileList.length !== 0
                        }
                    />
                )}
            </div>
        </>
    );
};

export default withRouter(BlogContShow);
