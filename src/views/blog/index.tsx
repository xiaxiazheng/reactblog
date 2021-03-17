/*
 * @Author: your name
 * @Date: 2021-03-07 17:05:23
 * @LastEditTime: 2021-03-17 22:32:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \reactblog\src\views\blog\index.tsx
 */
import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import BlogList from "./blog-list";
import TagList from "./tag-list";
import { IsLoginContext } from "@/context/IsLoginContext";
import { BlogContext } from "./BlogContext";
import { addBlogCont } from "@/client/BlogHelper";
// import { FileMarkdownOutlined, FileTextOutlined } from "@ant-design/icons";
import { Button, message, Icon, Drawer } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface PropsType extends RouteComponentProps {}

const Blog: React.FC<PropsType> = (props) => {
  const { history } = props;

  const { isLogin } = useContext(IsLoginContext);
  const { setActiveTag } = useContext(BlogContext);

  // 添加日志
  const addNewBlog = async (type: "richtext" | "markdown") => {
    const params = {
      edittype: type,
    };
    const res: any = await addBlogCont(params);
    if (res) {
      message.success("新建成功");
      setActiveTag("");
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

  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <div className={styles.blog}>
        <div className={styles.blogLeft}>
          <TagList />
        </div>
        <div className={`${styles.blogRight} ScrollBar`}>
          {/* 日志列表 */}
          <BlogList>
            {isLogin && (
              // 新建日志
              <div className={styles.addBlog}>
                <Button
                  className={styles.addBlogButton}
                  title="新建富文本 blog"
                  type="primary"
                  size="small"
                  icon="file-text"
                  onClick={addNewBlog.bind(null, "richtext")}
                >
                  富文本
                </Button>
                <Button
                  className={styles.addBlogButton}
                  title="新建 MarkDown blog"
                  type="primary"
                  size="small"
                  icon="file-markdown"
                  onClick={addNewBlog.bind(null, "markdown")}
                >
                  MD
                </Button>
              </div>
            )}
          </BlogList>
        </div>
      </div>
      {window.screen.availWidth <= 720 && (
        <>
          <div className={styles.songList} onClick={() => setVisible(true)}>
            <Icon type="unordered-list" />
          </div>
          <Drawer
            title={"tag 列表"}
            placement="bottom"
            closable={true}
            onClose={() => {
              setVisible(!visible);
            }}
            className={styles.drawer}
            height={"auto"}
            visible={visible}
          >
            <TagList closeDrawer={() => setVisible(false)} />
          </Drawer>
        </>
      )}
    </>
  );
};

export default withRouter(Blog);
