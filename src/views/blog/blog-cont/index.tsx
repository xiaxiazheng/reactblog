import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { getBlogCont } from "@/client/BlogHelper";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Switch } from "antd";
import { withRouter, RouteComponentProps, match } from "react-router-dom";
import { IsLoginContext } from "@/context/IsLoginContext";
import BlogContEditByRH from "./blog-cont-edit-rh";
import BlogContEditByMD from "./blog-cont-edit-md";
import BlogContShow from "./blog-cont-show";
import { OneBlogType } from "../BlogType";
import useDocumentTitle from "@/hooks/useDocumentTitle";

interface PropsType extends RouteComponentProps {
    match: match<{
        blog_class: string;
        blog_id: string;
    }>;
}

const BlogCont: React.FC<PropsType> = (props) => {
    const { match, history } = props;
    const { isLogin } = useContext(IsLoginContext);

    const [isEdit, setIsEdit] = useState(false);

    // 获取当前日志的数据
    const [blogData, setBlogData] = useState<OneBlogType>();
    const getData = async () => {
        let id = decodeURIComponent(atob(match.params.blog_id));
        const res: OneBlogType = await getBlogCont(id);
        setBlogData(res);
    };

    useDocumentTitle(blogData?.title || "blog");

    // 获取当前日志图片数组数据
    const getImageList = async () => {
        let id = decodeURIComponent(atob(match.params.blog_id));
        const res: OneBlogType = await getBlogCont(id);
        const imgList = res.imgList;
        setBlogData({
            ...(blogData as OneBlogType),
            imgList,
        });
    };

    // 获取当前日志附件数组数据
    const getFileList = async () => {
        let id = decodeURIComponent(atob(match.params.blog_id));
        const res: OneBlogType = await getBlogCont(id);
        const fileList = res.fileList;
        setBlogData({
            ...(blogData as OneBlogType),
            fileList,
        });
    };

    useEffect(() => {
        isEdit && getData();
    }, [match.params.blog_id, isEdit]);

    // 回到日志列表
    const backToLogList = () => {
        history.push(`${isLogin ? "/admin" : ""}/blog`);
    };

    return (
        <div className={styles.BlogCont}>
            <Button
                className={styles.backButton}
                type="primary"
                onClick={backToLogList}
            >
                <LeftOutlined />
                返回
            </Button>
            {
                // 编辑与查看的切换按钮
                isLogin && (
                    <Switch
                        className={styles.logEditSwitch}
                        checkedChildren="编辑"
                        unCheckedChildren="查看"
                        defaultChecked={isEdit}
                        onChange={() => setIsEdit(!isEdit)}
                    />
                )
            }
            {/* 展示 */}
            {!isEdit && <BlogContShow blog_id={match.params.blog_id} />}
            {/* 编辑 */}
            {isLogin &&
                isEdit &&
                blogData &&
                (blogData.edittype === "markdown" ? (
                    <BlogContEditByMD
                        blogData={blogData}
                        getBlogContData={getData}
                        getImageList={getImageList}
                        getFileList={getFileList}
                    />
                ) : (
                    <BlogContEditByRH
                        blogData={blogData}
                        getBlogContData={getData}
                        getImageList={getImageList}
                        getFileList={getFileList}
                    />
                ))}
        </div>
    );
};

export default withRouter(BlogCont);
