import React, { useState, useEffect, useRef, useContext } from "react";
import { OneBlogType } from "@/views/blog/BlogType";
import styles from "./index.module.scss";
import { getBlogCont } from "@/client/BlogHelper";
import Loading from "@/components/loading";
import classnames from "classnames";
import { IsLoginContext } from "@/context/IsLoginContext";
import { Button, message, Drawer } from "antd";
import {
  CreditCardOutlined,
  EnvironmentOutlined,
  FilePdfOutlined,
  ShareAltOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { addVisits } from "@/client/BlogHelper";
import BlogContMao from "../blog-cont-mao";
import { withRouter, RouteComponentProps } from "react-router-dom";
import FileBox from "@/components/file-box";

import MarkdownShow from "../markdown-show";
import RichtextShow from "../richtext-show";
import useDocumentTitle from "@/hooks/useDocumentTitle";

interface PropsType extends RouteComponentProps {
  blog_id: string;
}

const BlogContShow: React.FC<PropsType> = (props) => {
  const { history, blog_id, match, location } = props;

  const [edittype, setEdittype] = useState<"richtext" | "markdown">("richtext");
  const [loading, setLoading] = useState(true);

  const { isLogin } = useContext(IsLoginContext);

  const blogcontShowWrapper = useRef<any>(null);

  const [blogdata, setblogdata] = useState<OneBlogType>();
  const [visits, setVisits] = useState<Number>();

  useDocumentTitle(blogdata?.title || "日志");

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      let id = decodeURIComponent(atob(blog_id));
      const res: OneBlogType = await getBlogCont(id);
      if (res) {
        setVisits(res.visits);
        setblogdata(res);
        setEdittype(res.edittype);
        setLoading(false);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog_id]);

  // 统计访问量
  useEffect(() => {
    let visit: any;
    if (blogdata) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogdata]);

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
        blogdata: blogdata,
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

  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <div className={className} ref={blogcontShowWrapper}>
        {loading ? (
          <Loading />
        ) : (
          blogdata && (
            <>
              <div className={styles.title}>{blogdata.title}</div>
              <div className={styles.author}>{blogdata.author}</div>
              <div className={styles.time}>
                <span>创建时间: {blogdata.cTime}</span>
                <span>修改时间: {blogdata.mTime}</span>
                {isLogin && <span>访问量：{visits}</span>}
              </div>
              {
                // 富文本展示
                edittype === "richtext" && (
                  <RichtextShow blogcont={blogdata.blogcont} />
                )
              }
              {
                // markdown 展示
                edittype === "markdown" && (
                  <MarkdownShow blogcont={blogdata.blogcont} />
                )
              }
              {blogdata.fileList && blogdata.fileList.length !== 0 && (
                <div className={styles.fileList}>
                  <h4>附件：</h4>
                  <div>
                    {blogdata.fileList.map((item) => {
                      return (
                        <FileBox
                          key={item.file_id}
                          type="blog"
                          fileId={item.file_id}
                          originalName={item.originalname}
                          fileName={item.filename}
                          fileUrl={item.fileUrl}
                          initFileList={() => {}}
                          width="140px"
                          isOnlyShow={true}
                          fileData={item}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )
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
        {window.screen.availWidth > 720 && blogdata && (
          <BlogContMao
            blogcont={blogdata.blogcont}
            isHasFiles={blogdata.fileList && blogdata.fileList.length !== 0}
          />
        )}
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
              {blogdata && (
                <BlogContMao
                  blogcont={blogdata.blogcont}
                  closeDrawer={() => setVisible(false)}
                  isHasFiles={
                    blogdata.fileList && blogdata.fileList.length !== 0
                  }
                />
              )}
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

export default withRouter(BlogContShow);
