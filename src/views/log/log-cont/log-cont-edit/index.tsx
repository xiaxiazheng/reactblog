import React from 'react';
import { Input, Button, message, Icon } from 'antd';
import { OneLogType } from '../../LogType';
import { modifyLogCont } from '@/client/LogHelper';
import './index.scss';
import ImageBox from '@/components/image-box';
import { baseUrl } from '@/env_config';
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
  getLogContData: Function;  // 重新获取整个日志信息
  getImageList: Function;  // 只重新获取日志图片列表
};

class LogContEdit extends React.Component<PropsType> {
  state = {
    quillref: React.createRef(),
    title: this.props.logdata.title,
    author: this.props.logdata.author,
    logcont: this.props.logdata.logcont,
    isTitleChange: false,
    isAuthorChange: false,
    isLogContChange: false
  };

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  // 键盘事件
  onKeyDown = (e: any) => {
    if (e.keyCode === 83 && e.ctrlKey) {
      e.preventDefault();
      this.saveEditLog();
    }
  }
  
  // 工具条配置
  toolbarOption: any = [
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
  modules: any = {
    imageResize: { //调整大小组件。
      displayStyles: {
        backgroundColor: 'black',
        border: 'none',
        color: 'white'
      },
      modules: ['Resize', 'DisplaySize']
    },
    toolbar: {
      container: this.toolbarOption,  // 工具栏
      handlers: {
        // 劫持插入图片事件
        'image': (value: any) => {
          if (value) {
            // 获取当前光标位置，之所以在这里就获取因为 insertImage 会打开一个弹框，打开之后就丢失了光标位置了
            if (this.state.quillref.current) {
              /** 获取 quill 实例！ */ 
              const quill = (this.state.quillref.current as any).editor;
              // const quill: any = this.quill;  // this 指向 toolbar 对象自身，通过它也能获取到实例

              const index = quill.getSelection().index;  // 获取当前输入框的位置
              this.insertImage(quill, index);
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
  insertImage = (quill: any, cursorIndex: number) => {
    let name = prompt("请输入你要插入的图片的 url", '');
    if (name !== null && name !== '') {
      // 插入图片
      quill.insertEmbed(cursorIndex, 'image', name);
      // 调整光标到最后
      quill.setSelection(cursorIndex + 1);
    }
  };

  // 保存日志
  saveEditLog = async () => {
    const params: any = {
      id: this.props.logdata.log_id,
      title: this.state.title,
      author: this.state.author,
      logcont: this.state.logcont
    };
    let res = await modifyLogCont(params);
    if (res) {
      message.success("保存成功");
      this.setState({
        isTitleChange: false,
        isAuthorChange: false,
        isLogContChange: false
      });
      this.props.getLogContData();  // 调用父组件的函数，获取最新的东西
    } else {
      message.error("保存失败");
    }
  };

  // 监听标题变化
  handleTitleChange = (e: any) => {
    this.setState({
      title: e.target.value,
      isTitleChange: this.props.logdata.title !== e.target.value
    });
  };

  // 监听作者变化
  handleAuthorChange = (e: any) => {
    this.setState({
      author: e.target.value,
      isAuthorChange: this.props.logdata.author !== e.target.value
    });
  };

  // 监听富文本编辑内容变化
  handleLogContChange = (html: string) => {
    this.setState({
      logcont: html,
      isLogContChange: this.props.logdata.logcont !== html
    });
  };

  render() {
    return (
      <div className="logcontedit">
        {/* 保存按钮 */}
        <Button
          className="save-button"
          type={this.state.isTitleChange || this.state.isAuthorChange || this.state.isLogContChange ? 'danger' : 'primary'}
          onClick={this.saveEditLog}
        >
          <Icon type="save" />保存
        </Button>
        {/* 标题名称和时间 */}
        <Input className="logcont-title" size="large" value={this.state.title} onChange={this.handleTitleChange}/>
        <Input className="logcont-author" value={this.state.author} onChange={this.handleAuthorChange}/>
        <div className="logcont-time">
          <span>创建时间：{this.props.logdata.cTime}</span>
          <span>修改时间：{this.props.logdata.mTime}</span>
        </div>
        <div className="editor-n-imgbox">
          {/* 富文本编辑器 */}
          <div className="logcont-editor">
            <ReactQuill
              theme="snow"
              value={this.state.logcont}
              modules={this.modules}
              onChange={this.handleLogContChange}
              ref={this.state.quillref as any}
            />
          </div>
          {/* 图片列表 */}
          <div className="logcont-imgbox">
              {this.props.logdata.imgList.map((item) => {
                return (
                  <ImageBox
                    key={item.img_id}
                    type="log"
                    imageId={item.img_id}
                    imageName={item.imgname}
                    imageFileName={item.filename}
                    imageUrl={`${baseUrl}/img/log/${item.filename}`}
                    imageMinUrl={`${baseUrl}/min-img/${item.filename}`}
                    initImgList={this.props.getImageList}
                    width="140px"
                  />
                )
              })}
              <ImageBox otherId={this.props.logdata.log_id} type="log" imageUrl="" imageMinUrl="" initImgList={this.props.getImageList} width="140px"/>
          </div>
        </div>
      </div>
    )
  }
};

export default LogContEdit;