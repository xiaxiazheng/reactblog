import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import BlogList from "./blog-list";
import TagList from "./tag-list";
import { IsLoginContext } from "@/context/IsLoginContext";
import { BlogContext } from "./BlogContext";
import { addBlogCont } from "@xiaxiazheng/blog-libs";
import { Button, message, Space } from "antd";
import { FileMarkdownOutlined, FileTextOutlined } from "@ant-design/icons";
import { withRouter, RouteComponentProps } from "react-router-dom";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import SearchEngine from "./search-engine";
import Filter from "./filter";

interface PropsType extends RouteComponentProps {}

const Blog: React.FC<PropsType> = (props) => {
    const { history } = props;

    const { isLogin } = useContext(IsLoginContext);
    const { setActiveTagIdId } = useContext(BlogContext);

    useDocumentTitle("blog");

    // 添加日志
    const addNewBlog = async (type: "richtext" | "markdown") => {
        const params = {
            edittype: type,
        };
        const res: any = await addBlogCont(params);
        if (res) {
            message.success("新建成功");
            setActiveTagIdId("");
            /** 新建成功直接跳转到新日志 */
            const newId = res.newid;
            const path = `/admin/blog/${btoa(decodeURIComponent(newId))}`;
            history.push({
                pathname: path,
                state: {
                    editType: type, // 要带上日志类型
                },
            });
        } else {
            message.error("新建失败");
        }
    };

    // 是否打开高级搜索
    const [showSearchEngine, setShowSearchEngine] = useState<boolean>(false);

    return (
        <div className={styles.blog}>
            <div className={`${styles.blogLeft} ScrollBar`}>
                {!showSearchEngine && (
                    // 日志列表
                    <BlogList>
                        {isLogin && (
                            // 新建日志
                            <Space className={styles.addBlog} size={5}>
                                <Button
                                    className={styles.addBlogButton}
                                    title="新建富文本 blog"
                                    type="primary"
                                    size="small"
                                    icon={<FileTextOutlined />}
                                    onClick={addNewBlog.bind(null, "richtext")}
                                >
                                    富文本
                                </Button>
                                <Button
                                    className={styles.addBlogButton}
                                    title="新建 MarkDown blog"
                                    type="primary"
                                    size="small"
                                    icon={<FileMarkdownOutlined />}
                                    onClick={addNewBlog.bind(null, "markdown")}
                                >
                                    MD
                                </Button>
                                {/* 高级筛选 */}
                                <Filter />
                                {/* 高级搜索 */}
                                <Button
                                    onClick={() => setShowSearchEngine(true)}
                                >
                                    高级搜索
                                </Button>
                            </Space>
                        )}
                    </BlogList>
                )}
                {showSearchEngine && (
                    // 高级搜索
                    <SearchEngine back={() => setShowSearchEngine(false)} />
                )}
            </div>
            <div className={styles.blogRight}>
                <TagList />
            </div>
        </div>
    );
};

export default withRouter(Blog);
