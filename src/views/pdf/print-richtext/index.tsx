import React from 'react';
import rhStyles from '@/views/log/log-cont/log-cont-show/index.module.scss'
// 代码高亮
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark-reasonable.css";
// 富文本编辑器
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

interface IPrintRichtext {
  logcont: any
}

// 打印富文本内容
const PrintRichtext: React.FC<IPrintRichtext> = (props) => {
  const {logcont} = props

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
    <div className={rhStyles.logcontShow}>
      <div className={rhStyles.title}>{logcont.title}</div>
      <div className={rhStyles.author}>{logcont.author}</div>
      <div className={rhStyles.logcontEditor}>
        <ReactQuill
          readOnly
          theme="bubble"
          value={logcont.logcont}
          modules={modules}
        />
      </div>
    </div>
  );
}

export default PrintRichtext;
