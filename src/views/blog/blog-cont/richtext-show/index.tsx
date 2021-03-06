import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./index.module.scss";
// 代码高亮
import hljs from "highlight.js";
// import "highlight.js/styles/monokai-sublime.css";
import "highlight.js/styles/vs2015.css";
// 富文本编辑器
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

interface PropsType {
  blogcont: string;
}

const LogContShow: React.FC<PropsType> = (props) => {
  const { blogcont } = props;

  // 编辑器配置
  const modules: any = {
    syntax: {
      highlight: (text: any) => hljs.highlightAuto(text).value,
    },
    clipboard: {
      // 这个设置是防止每次保存都有莫名其妙的空行“<p><br></p>”插入到内容中
      matchVisual: false,
    },
  };

  return (
    <div className={styles.blogcontEditor}>
      <ReactQuill readOnly theme="bubble" value={blogcont} modules={modules} />
    </div>
  );
};

export default LogContShow;
