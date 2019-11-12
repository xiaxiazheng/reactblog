import React, { useRef } from 'react';
import { Input, Button, message, Icon } from 'antd';
import { OneLogType } from '../LogType';
import { modifyLogCont } from '@/client/LogHelper';
import './LogContEditByClass.scss';
// 代码高亮
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
// 富文本编辑器及图片拉伸
import ReactQuill, { Quill } from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

interface PropsType {
  logdata: OneLogType;
};

const LogContEdit: React.FC<PropsType> = ({ logdata }) => {
  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const quillref = useRef(null);

  // 工具条配置
  const toolbarOption: any = [
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

  // 编辑器配置
  const modules: any = {
    imageResize: { //调整大小组件。
      displayStyles: {
        backgroundColor: 'black',
        border: 'none',
        color: 'white'
      },
      modules: ['Resize', 'DisplaySize']
    },
    toolbar: {
      container: toolbarOption,  // 工具栏
      handlers: {
        // 劫持插入图片事件
        'image': function (value: any) {
          if (value) {
            // 获取当前光标位置，之所以在这里就获取因为 insertImage 会打开一个弹框，打开之后就丢失了光标位置了
            if (quillref.current) {
              /** 获取 quill 实例！ */ 
              const quill = (quillref.current as any).editor;
              // const quill: any = this.quill;  // this 指向 toolbar 对象自身，通过它也能获取到实例

              const index = quill.getSelection().index;  // 获取当前输入框的位置
              insertImage(quill, index);
            }
          }
        }
      }
    },
    syntax: {
      highlight: (text: any) => hljs.highlightAuto(text).value
    },
    clipboard: {  // 这个设置是防止每次保存都有莫名其妙的空行“<p><br></p>”插入到内容中
      matchVisual: false
    }
  };

  // 插入图片
  const insertImage = (quill: any, cursorIndex: number) => {
    let name = prompt("请输入你要插入的图片的 url", '');
    if (name !== null && name !== '') {
      // 插入图片
      quill.insertEmbed(cursorIndex, 'image', name);
      // 调整光标到最后
      quill.setSelection(cursorIndex + 1);
    }
  }

  // 保存日志
  const saveEditLog = async () => {
    const params: any = {
      id: logdata.log_id,
      title: (titleRef.current as any).state.value,
      author: (authorRef.current as any).state.value,
      logcont: (quillref.current as any).state.value
    };
    let res = await modifyLogCont(params);
    if (res) {
      message.success("保存成功");
    } else {
      message.error("保存失败");
    }
  };

  return (
    <div className="logcontedit">
      {/* 保存按钮 */}
      <Button
        className="save-button"
        type='danger'
        onClick={saveEditLog}
      >
        <Icon type="save" />保存
      </Button>
      {/* 标题名称和时间 */}
      <Input className="logcont-title" size="large" ref={titleRef} defaultValue={logdata.title}/>
      <Input className="logcont-author" ref={authorRef} defaultValue={logdata.author}/>
      <div className="logcont-time">
        <span>创建时间：{logdata.cTime}</span>
        <span>修改时间：{logdata.mTime}</span>
      </div>
      <div className="editor-n-imgbox">
        {/* 富文本编辑器 */}
        <div className="logcont-editor">
          <ReactQuill
            theme="snow"
            defaultValue={logdata.logcont}
            modules={modules}
            ref={quillref}
          />
        </div>
        {/* 图片列表 */}
        <div className="logcont-imgbox">
          {[1,2,3].map(item => {
            return (
              <div key={item} className="image-box">
                弃用
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
};

export default LogContEdit;