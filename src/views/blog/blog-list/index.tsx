import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Popover, Radio, Select, Space } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getAllBlogList, getShowBlogList } from "@xiaxiazheng/blog-libs";
import { IsLoginContext } from "@/context/IsLoginContext";
import { BlogListType } from "../BlogType";
import BlogListItem from "./blog-list-item";
import { BlogContext, BlogContextType } from "../BlogContext";
import { Loading } from "@xiaxiazheng/blog-libs";
import classnames from "classnames";
import { UserContext } from "@/context/UserContext";

interface PropsType extends RouteComponentProps {}

const BlogList: React.FC<PropsType> = (props) => {
    const { history } = props;
    const { isLogin } = useContext(IsLoginContext); // 获取是否登录
    const { username } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    const {
        tabsState,
        setTabsState,
        activeTagId,
        isTagChange,
        setIsTagChange,
    } = useContext<BlogContextType>(BlogContext);

    // 展开方便用
    const {
        keyword,
        pageNo,
        pageSize,
        orderBy,
        showVisible,
        showInvisible,
        showNotTag,
    } = tabsState;

    const [blogListData, setBlogListData] = useState({
        blogList: [], // 日志列表
        total: 0, // 日志总数
    });

    // 切换 activeTagId 的时候，pageNo 要重置为 1
    useEffect(() => {
        if (isTagChange) {
            if (pageNo === 1) {
                getBlogList();
            } else {
                setTabsState({
                    ...tabsState,
                    pageNo: 1,
                });
            }
            setIsTagChange(false);
        }
    }, [isTagChange]);

    useEffect(() => {
        getBlogList();
    }, [tabsState, username]);

    // 初始化日志列表
    const getBlogList = async () => {
        setLoading(true);

        let params: any = {
            pageNo,
            pageSize,
            orderBy,
            keyword: keyword || "",
            activeTagId: activeTagId || "",
        };
        if (showNotTag) {
            params.showNotTag = true;
        }
        let res = {
            list: [],
            total: 0,
        };
        if (isLogin) {
            if (showVisible && showInvisible) {
                // 显示所有日志
                res = await getAllBlogList(params);
            } else if (showVisible) {
                // 仅显示可见
                params.isVisible = true;
                params.username = username;
                res = await getAllBlogList(params);
            } else if (showInvisible) {
                // 仅显示不可见
                params.isVisible = false;
                params.username = username;
                res = await getAllBlogList(params);
            }
        } else {
            // 没登录只能显示可见
            params.username = username;
            res = await getShowBlogList(params);
        }
        setBlogListData({
            blogList: res.list,
            total: res.total,
        });
        setLoading(false);
    };

    // 点击日志，路由跳转
    const choiceOneBlog = (item: BlogListType) => {
        const path = `${isLogin ? "/admin" : ""}/blog/${btoa(
            decodeURIComponent(item.blog_id)
        )}`;
        history.push({
            pathname: path,
            state: {
                editType: item.edittype, // 要带上日志类型
            },
        });
    };

    // 输入搜索关键字
    const [myKeyword, setMyKeyword] = useState<any>();
    useEffect(() => {
        setMyKeyword(keyword);
    }, [keyword]);
    const handleKeyword = (e: any) => {
        setMyKeyword(e.target.value || "");
    };

    // myKeyword 删除到空就发请求
    useEffect(() => {
        // 这样限制就不会在初始化的时候又跑多一次了
        if (keyword !== "" && myKeyword === "") {
            setTabsState({
                ...tabsState,
                keyword: "",
                pageNo: 1,
            });
        }
    }, [myKeyword]);

    // 回车搜索，是通过修改 tabsState 的 keyword 实现搜索的
    const handleSearch = (e: any) => {
        if (e.keyCode === 13) {
            setTabsState({
                ...tabsState,
                keyword: myKeyword,
                pageNo: 1,
            });
        }
    };

    const blogListClass = classnames({
        [styles.blogList]: true,
        ScrollBar: true,
    });

    // 切换页
    const handlePageNo = (page: number) => {
        setTabsState({
            ...tabsState,
            pageNo: page,
        });
    };

    // 切换页面容量
    const handlePageSize = (current: number, size: number) => {
        setTabsState({
            ...tabsState,
            pageSize: size,
            pageNo: 1,
        });
    };

    return (
        <>
            <div className={styles.operateBox}>
                <div>
                    {props.children}
                    {/* 搜索框 */}
                    <Input
                        className={styles.searchBox}
                        value={myKeyword || ""}
                        onChange={handleKeyword}
                        onKeyDownCapture={handleSearch}
                        placeholder="回车搜，可用空格添加%分词查"
                        prefix={<SearchOutlined />}
                        allowClear
                    ></Input>
                </div>
                <Button
                    title="刷新"
                    onClick={() => getBlogList()}
                    icon={<RedoOutlined />}
                    type="primary"
                />
            </div>
            {/* 日志列表 */}
            {loading && <Loading />}
            <ul className={blogListClass}>
                {blogListData.blogList && blogListData.blogList.length === 0 ? (
                    <div className={styles.emptyList}>No Data</div>
                ) : (
                    blogListData.blogList &&
                    blogListData.blogList.map((item: BlogListType) => {
                        return (
                            <li
                                className={`${
                                    item.isStick === "true"
                                        ? styles.activeStick
                                        : ""
                                } ${styles.blogListLi}`}
                                key={item.blog_id}
                                onClick={choiceOneBlog.bind(null, item)}
                            >
                                <BlogListItem
                                    blogItemData={item}
                                    orderBy={orderBy}
                                    getNewList={getBlogList}
                                />
                            </li>
                        );
                    })
                )}
            </ul>
            {/* 分页 */}
            {blogListData.blogList && blogListData.blogList.length !== 0 && (
                <Pagination
                    className={styles.pagination}
                    pageSize={pageSize}
                    current={pageNo}
                    total={blogListData.total}
                    showTotal={(total) => `共${total}篇`}
                    onChange={handlePageNo}
                    onShowSizeChange={handlePageSize}
                    showSizeChanger
                    pageSizeOptions={['15', '20', '30', '40', '50']}
                />
            )}
        </>
    );
};

export default withRouter(BlogList);
