import React, { useState, useEffect } from 'react';
import { OneLogType } from './LogType';
import './LogContShow.scss';
// 代码高亮
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
// 富文本编辑器
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

interface PropsType {
  logdata: OneLogType;
};

const LogContShow: React.FC<PropsType> = ({ logdata }) => {

  // 编辑器配置
  const modules: any = {
    syntax: {
      highlight: (text: any) => hljs.highlightAuto(text).value
    },
    clipboard: {  // 这个设置是防止每次保存都有莫名其妙的空行“<p><br></p>”插入到内容中
      matchVisual: false
    }
  };

  const [logCont, setLogCont] = useState(logdata.logcont);

  useEffect(() =>{
    setLogCont(logdata.logcont);
  }, [logdata]);

  return (
    <div className="logcont-show">
      <h2 className="title">{logdata.title}</h2>
      <h3 className="author">{logdata.author}</h3>
      <div className="time">
        <span>创建时间: {logdata.cTime}</span>
        <span>修改时间: {logdata.mTime}</span>
      </div>
      {/* 富文本编辑器 */}
      <div className="logcont-editor">
        <ReactQuill
          readOnly
          theme="bubble"
          defaultValue={logCont}
          modules={modules}
        />
      </div>
    </div>
  )
};

export default LogContShow;