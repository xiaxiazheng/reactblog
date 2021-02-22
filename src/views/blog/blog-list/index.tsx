import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { Icon } from "@ant-design/compatible";
import { Input, Pagination, Checkbox, Select } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getVisiableBlogList, getAllBlogList } from "@/client/BlogHelper";
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

  const {
    tabsState,
    setTabsState,
    activeTag,
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

  // 切换 activeTag 的时候，pageNo 要重置为 1
  useEffect(() => {
    if (isTagChange) {
      if (pageNo === 1) {
        getLogList();
      } else {
        setTabsState({
          ...tabsState,
          pageNo: 1,
        });
      }
      setIsTagChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTagChange]);

  useEffect(() => {
    getLogList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabsState, username]);

  // 初始化日志列表
  const getLogList = async () => {
    setLoading(true);

    let params: any = {
      pageNo: pageNo,
      pageSize: pageSize,
      orderBy: orderBy,
      keyword: keyword || "",
      activeTag: activeTag || "",
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
        res = await getVisiableBlogList(params);
      } else if (showInvisible) {
        // 仅显示不可见
        params.isVisible = false;
        params.username = username;
        res = await getVisiableBlogList(params);
      }
    } else {
      // 没登录只能显示可见
      params.isVisible = true;
      params.username = username;
      res = await getVisiableBlogList(params);
    }
    setBlogListData({
      blogList: res.list,
      total: res.total,
    });
    setLoading(false);
  };

  // 点击日志，路由跳转
  const choiceOneLog = (item: BlogListType) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // 处理可见
  const handleVisible = () => {
    setTabsState({
      ...tabsState,
      showVisible: !showVisible,
      pageNo: 1,
    });
  };

  // 处理不可见
  const handleInvisible = () => {
    setTabsState({
      ...tabsState,
      showInvisible: !showInvisible,
      pageNo: 1,
    });
  };

  // 处理未设置 tag
  const handleNotTag = () => {
    setTabsState({
      ...tabsState,
      showNotTag: !showNotTag,
      pageNo: 1,
    });
  };

  // 处理按什么排序
  const handleOrderBy = (value: any) => {
    setTabsState({
      ...tabsState,
      orderBy: value,
      pageNo: 1,
    });
  };

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
          <Select.Option value="visits">按访问量</Select.Option>
        </Select>
        {/* 显示条件 */}
        {isLogin && (
          <Checkbox
            className={styles.checkBox}
            checked={showVisible}
            onChange={handleVisible}
          >
            可见
          </Checkbox>
        )}
        {isLogin && (
          <Checkbox
            className={styles.checkBox}
            checked={showInvisible}
            onChange={handleInvisible}
          >
            不可见
          </Checkbox>
        )}
        {isLogin && (
          <Checkbox
            className={styles.checkBox}
            checked={!showNotTag}
            onChange={handleNotTag}
          >
            未设置 tag
          </Checkbox>
        )}
        {/* 搜索框 */}
        <Input
          className={styles.searchBox}
          value={myKeyword || ""}
          onChange={handleKeyword}
          onKeyDownCapture={handleSearch}
          placeholder="回车搜当前分类日志"
          prefix={<Icon type="search"></Icon>}
          allowClear
        ></Input>
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
                  item.isStick === "true" ? styles.activeStick : ""
                } ${styles.blogListLi}`}
                key={item.blog_id}
                onClick={choiceOneLog.bind(null, item)}
              >
                <BlogListItem
                  blogItemData={item}
                  orderBy={orderBy}
                  getNewList={getLogList}
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
