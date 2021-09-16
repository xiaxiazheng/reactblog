import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Radio, Select } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getAllBlogList, getShowBlogList } from "@/client/BlogHelper";
import { IsLoginContext } from "@/context/IsLoginContext";
import { BlogListType } from "../BlogType";
import BlogListItem from "./blog-list-item";
import { BlogContext, BlogContextType } from "../BlogContext";
import Loading from "@/components/loading";
import classnames from "classnames";
import { UserContext } from "@/context/UserContext";

interface PropsType extends RouteComponentProps {}

const BlogList: React.FC<PropsType> = (props) => {
    const { history } = props;
    const { isLogin } = useContext(IsLoginContext); // 获取是否登录
    const { username } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    const { tabsState, setTabsState, activeTagId, isTagChange, setIsTagChange } =
        useContext<BlogContextType>(BlogContext);

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

    const [searchType, setSearchType] = useState<"分词查找" | "精准查找">(
        "精准查找"
    );
    const handleSearchType = (e: any) => {
        setSearchType(e.target.value);
    };

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
    }, [tabsState, username, searchType]);

    // 初始化日志列表
    const getBlogList = async () => {
        setLoading(true);

        let params: any = {
            pageNo,
            pageSize,
            orderBy,
            keyword: keyword
                ? searchType === "精准查找"
                    ? keyword
                    : keyword.split("").join("%")
                : "",
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
        setMyKeyword(e.target.value);
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

    // 处理按什么排序
    const handleOrderBy = (
        value: "create" | "modify" | "letter" | "letterDesc" | "visits"
    ) => {
        setTabsState({
            ...tabsState,
            orderBy: value,
            pageNo: 1,
        });
    };

    // 处理可见
    const handleVisible = (value: "all" | "show" | "hide") => {
        setTabsState({
            ...tabsState,
            showVisible: value === "all" || value === "show",
            showInvisible: value === "all" || value === "hide",
            pageNo: 1,
        });
    };

    // 处理未设置 tag
    const handleShowTag = (value: "all" | "hide") => {
        setTabsState({
            ...tabsState,
            showNotTag: value === "hide",
            pageNo: 1,
        });
    };

    return (
        <>
            <div className={styles.operateBox}>
                {props.children}
                {/* 排序条件 */}
                <Select
                    className={styles.orderbyBox}
                    value={orderBy}
                    onChange={handleOrderBy}
                >
                    <Select.Option value="create">按创建时间</Select.Option>
                    <Select.Option value="modify">按修改时间</Select.Option>
                    <Select.Option value="letter">首字母升序</Select.Option>
                    <Select.Option value="letterDesc">首字母降序</Select.Option>
                    <Select.Option value="visits">按访问的量</Select.Option>
                </Select>
                {isLogin && (
                    <>
                        {/* 是否可见 */}
                        <Select
                            className={styles.orderbyBox}
                            value={
                                showVisible
                                    ? showInvisible
                                        ? "all"
                                        : "show"
                                    : "hide"
                            }
                            onChange={handleVisible}
                        >
                            <Select.Option value="all">
                                <EyeOutlined />
                                全部
                            </Select.Option>
                            <Select.Option value="show">仅可见</Select.Option>
                            <Select.Option value="hide">不可见</Select.Option>
                        </Select>
                    </>
                )}

                {/* 是否设置 tag */}
                <Select
                    className={styles.orderbyBox}
                    value={showNotTag ? "hide" : "all"}
                    onChange={handleShowTag}
                >
                    <Select.Option value="all">不管 tag</Select.Option>
                    {/* <Select.Option value="show">设置了tag</Select.Option> */}
                    <Select.Option value="hide">未设置tag</Select.Option>
                </Select>

                {/* 搜索框 */}
                <Input
                    className={styles.searchBox}
                    value={myKeyword || ""}
                    onChange={handleKeyword}
                    onKeyDownCapture={handleSearch}
                    placeholder="回车搜，可用 % 分词查"
                    prefix={<SearchOutlined />}
                    allowClear
                ></Input>
                {/* 查找方式 */}
                <Radio.Group
                    onChange={handleSearchType}
                    value={searchType}
                    className={styles.searchType}
                >
                    <Radio value={"精准查找"}>精准查</Radio>
                    <Radio value={"分词查找"}>分词查</Radio>
                </Radio.Group>
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
                    pageSizeOptions={["5", "10", "15", "20"]}
                />
            )}
        </>
    );
};

export default withRouter(BlogList);
