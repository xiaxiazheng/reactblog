import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";
import MarkdownShow from "@/views/blog/blog-cont/markdown-show";
import RichtextShow from "@/views/blog/blog-cont/richtext-show";
import rhStyles from "@/views/blog/blog-cont/blog-cont-show/index.module.scss";
import { message } from "antd";
import useDocumentTitle from "@/hooks/useDocumentTitle";

interface IPDF extends RouteComponentProps {}

const PDF: React.FC<IPDF> = (props) => {
  const { state } = props.location;

  const [blogType, setBLogType] = useState<"richtext" | "markdown" | "">("");
  const [blogdata, setBlogdata] = useState<any>();

  useDocumentTitle(`打印：${blogdata?.title || ''}`)

  useEffect(() => {
    setTimeout(() => {
      message.info('Alt + ← 返回', 5)
    }, 3000)
  }, [])

  useEffect(() => {
    let myState: any = state;
    if (myState && myState.type) {
      setBLogType(myState.type);
      setBlogdata(myState.blogData);
    }
  }, [state]);

  useEffect(() => {
    if (blogType !== "") {
      // 这里在下一个宏任务才执行打印，因为 MarkdownShow 需要拿到 blogcont 之后再做一次转换才能渲染
      setTimeout(() => {
        window.print();
      }, 2000)
    }
  }, [blogType]);

  return (
    <div className={`${styles.pdf} ScrollBar`}>
      {/* 打印 markdown */}
      {blogType === "markdown" && <MarkdownShow blogcont={blogdata?.blogcont} />}
      {/* 打印富文本 */}
      {blogType === "richtext" && (
        <div className={rhStyles.blogcontShow}>
          <div className={rhStyles.title}>{blogdata?.title}</div>
          <div className={rhStyles.author}>{blogdata?.author}</div>
          <RichtextShow blogcont={blogdata?.blogcont} />
        </div>
      )}
    </div>
  );
};

export default withRouter(PDF);
