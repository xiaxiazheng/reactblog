import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { OneLogType } from './LogType';
import hljs from 'highlight.js';
import ReactQuill, { Quill } from 'react-quill'; 
import ImageResize from 'quill-image-resize-module';
// import 'react-quill/dist/quill.snow.css';
Quill.register('modules/imageResize', ImageResize);

interface PropsType {
  logdata: OneLogType
};

const LogContEdit: React.FC<PropsType> = ({ logdata }) => {

  const [logTitle, setLogTitle] = useState(logdata.title);
  const [logAuthor, setLogAuthor] = useState(logdata.author);
  const [logCont, setLogCont] = useState(logdata.logcont);

  // useEffect(() => {
  //   console.log(Quill);
  // }, []);

  const toolbarOption: any = [  // 工具条配置
    ['code-block', 'blockquote'],
    ['bold', 'italic', 'underline', 'strike', 'clean'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link', 'image']
  ];

  const modules: any = {  // 编辑器配置
    // imageResize: { //调整大小组件。
    //   displayStyles: {
    //     backgroundColor: 'black',
    //     border: 'none',
    //     color: 'white'
    //   },
    //   modules: ['Resize', 'DisplaySize']
    // },
    toolbar: {
      container: toolbarOption,  // 工具栏
      // handlers: {
      //   // 劫持插入图片事件
      //   'image': (value: any) => {
      //     if (value) {
      //       // 获取当前光标位置，之所以在这里就获取因为 insertImage 会打开一个弹框，打开之后就丢失了光标位置了
      //       // const editor: any = this.$refs.myQuillEditor;
      //       // let index = editor.quill.getSelection().index;
      //       // this.insertImage(editor.quill, index);
      //     } else {
      //       // const editor: any = this.$refs.myQuillEditor;
      //       // editor.quill.format('image', false);
      //     }
      //   }
      // }
    },
    syntax: {
      highlight: (text: any) => hljs.highlightAuto(text).value
    },
    clipboard: { // 这个设置是防止每次保存都有莫名其妙的空行“<p><br></p>”插入到内容中
      matchVisual: false
    }
  };


  return (
    <div className="logcontedit">
      <Input value={logTitle} onChange={(e) => setLogTitle(e.target.value)}/>
      <Input value={logAuthor} onChange={(e) => setLogAuthor(e.target.value)}/>
      <span>
        <span>创建时间：{logdata.cTime}</span>
        <span>修改时间：{logdata.mTime}</span>
      </span>
      {/* 富文本编辑器 */}
      <div className="logcont-editor">
        <ReactQuill
          value={logCont}
          onChange={value => setLogCont(value)}
          modules={modules}
          // formats={formats}
        />
      </div>
    </div>
  )
};

export default LogContEdit;