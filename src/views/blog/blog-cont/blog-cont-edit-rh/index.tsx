import React from "react";
import { Input, Button, message } from "antd";
import {
    SaveOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { OneBlogType } from "../../BlogType";
import { modifyBlogCont } from "@xiaxiazheng/blog-libs";
import "./index.scss";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import FileListBox from "@/components/file-image-handle/file-list-box";
import FileImageUpload from "@/components/file-image-handle/file-image-upload";
import BlogContMao from "../anchor-list";
// 代码高亮
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
// 富文本编辑器及图片拉伸
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const icons = Quill.import("ui/icons");
icons["header"]["2"] = `<span class="header-icon">H2</span>`;
icons["header"]["3"] = `<span class="header-icon">H3</span>`;
icons["header"]["4"] = `<span class="header-icon">H4</span>`;

Quill.register("modules/counter", function (quill: any, options: any) {
    var container: any = document.querySelector("#counter");
    quill.on("text-change", function () {
        var text: string = quill.getText();
        // There are a couple issues with counting words
        // this way but we'll fix these later
        container.innerText = text
            .split("")
            .filter((item) => item !== " ").length;
    });
});

interface PropsType {
    blogData: OneBlogType;
    getBlogContData: Function; // 重新获取整个日志信息
    getImageFileList: Function; // 只重新获取日志图片和文件列表
}

class BlogContEdit extends React.Component<PropsType> {
    state = {
        quillref: React.createRef(),
        title: this.props.blogData.title,
        author: this.props.blogData.author,
        blogcont: this.props.blogData.blogcont,
        isTitleChange: false,
        isAuthorChange: false,
        isLogContChange: false,
        words: "0",
    };

    componentDidMount() {
        document.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown);
    }

    // 键盘事件
    onKeyDown = (e: any) => {
        // 监听 ctrl + s，加上了 mac 的 command 按键的 metaKey 的兼容
        if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            this.saveEditLog();
        }
    };

    // 工具条配置
    toolbarOption: any = [
        ["code-block", "blockquote"],
        ["bold", "italic", "underline", "strike", "clean"],
        [{ header: 2 }, { header: 3 }, { header: 4 }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [
            { list: "ordered" },
            { list: "bullet" },
            { list: "check" },
            { align: [] },
        ],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        ["link", "image"],
        [{ script: "sub" }, { script: "super" }],
        // ["insertStar"]
    ];

    // 编辑器配置
    modules: any = {
        counter: true,
        toolbar: {
            container: this.toolbarOption, // 工具栏
            handlers: {
                // 劫持插入图片事件
                image: (value: any) => {
                    if (value) {
                        // 获取当前光标位置，之所以在这里就获取因为 insertImage 会打开一个弹框，打开之后就丢失了光标位置了
                        if (this.state.quillref.current) {
                            /** 获取 quill 实例！ */
                            const quill = (this.state.quillref.current as any)
                                .editor;
                            // const quill: any = this.quill;  // this 指向 toolbar 对象自身，通过它也能获取到实例

                            const index = quill.getSelection().index; // 获取当前输入框的位置
                            this.insertImage(quill, index);
                        }
                    }
                },
            },
        },
        syntax: {
            highlight: (text: any) => hljs.highlightAuto(text).value,
        },
        clipboard: {
            // 这个设置是防止每次保存都有莫名其妙的空行“<p><br></p>”插入到内容中
            matchVisual: false,
        },
    };

    // 插入图片
    insertImage = (quill: any, cursorIndex: number) => {
        let name = prompt("请输入你要插入的图片的 url", "");
        if (name !== null && name !== "") {
            // 插入图片
            quill.insertEmbed(cursorIndex, "image", name);
            // 调整光标到最后
            quill.setSelection(cursorIndex + 1);
        }
    };

    // 保存日志
    saveEditLog = async () => {
        const params: any = {
            id: this.props.blogData.blog_id,
            title: this.state.title,
            author: this.state.author,
            blogcont: this.state.blogcont,
        };
        let res = await modifyBlogCont(params);
        if (res) {
            message.success("保存成功");
            this.setState({
                isTitleChange: false,
                isAuthorChange: false,
                isLogContChange: false,
            });
            this.props.getBlogContData(); // 调用父组件的函数，获取最新的东西
        } else {
            message.error("保存失败");
        }
    };

    // 监听标题变化
    handleTitleChange = (e: any) => {
        this.setState({
            title: e.target.value,
            isTitleChange: this.props.blogData.title !== e.target.value,
        });
    };

    // 监听作者变化
    handleAuthorChange = (e: any) => {
        this.setState({
            author: e.target.value,
            isAuthorChange: this.props.blogData.author !== e.target.value,
        });
    };

    // 监听富文本编辑内容变化
    handleLogContChange = (html: string) => {
        this.setState({
            blogcont: html,
            isLogContChange: this.props.blogData.blogcont !== html,
        });
    };

    // 滚动事件
    scrollTo = (type: "top" | "bottom") => {
        (this.state.quillref as any).current.editor.root.scroll({
            left: 0,
            top: type === "top" ? 0 : Number.MAX_SAFE_INTEGER,
            behavior: "smooth",
        });
        // contShowRef.current.scrollTop = type === 'top' ? 0 : Number.MAX_SAFE_INTEGER
    };

    render() {
        return (
            <div className="blogcontedit">
                {/* 保存按钮 */}
                <Button
                    className="save-button"
                    danger={
                        this.state.isTitleChange ||
                        this.state.isAuthorChange ||
                        this.state.isLogContChange
                    }
                    type="primary"
                    onClick={this.saveEditLog}
                >
                    <SaveOutlined type="save" />
                    保存
                </Button>
                {/* 标题名称和时间 */}
                <Input
                    className="blogcont-title"
                    size="large"
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                />
                <Input
                    className="blogcont-author"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                <div className="blogcont-time">
                    <span>创建时间：{this.props.blogData.cTime}</span>
                    <span>修改时间：{this.props.blogData.mTime}</span>
                    <span>
                        <span id={"counter"}>{this.state.words}</span> 字
                    </span>
                </div>
                <div className="editor-n-imgbox">
                    {/* 富文本编辑器 */}
                    <div className="blogcont-editor">
                        <ReactQuill
                            theme="snow"
                            value={this.state.blogcont}
                            modules={this.modules}
                            onChange={this.handleLogContChange}
                            ref={this.state.quillref as any}
                        />
                    </div>
                    {/* 图片列表和附件列表 */}
                    <div className="blogcont-imgbox">
                        {/* 上传图片 */}
                        <FileImageUpload
                            type="blog"
                            other_id={this.props.blogData.blog_id}
                            refresh={() => {
                                this.props.getImageFileList();
                            }}
                            width="140px"
                        />

                        {/* 图片列表 */}
                        <ImageListBox
                            type="blog"
                            refresh={this.props.getImageFileList}
                            width="140px"
                            imageList={this.props.blogData?.imgList || []}
                        />
                        {/* 附件列表 */}
                        <FileListBox
                            type={"blog"}
                            fileList={this.props.blogData?.fileList || []}
                            refresh={this.props.getImageFileList}
                            width="140px"
                        />
                    </div>
                </div>
                {/* 回到顶部 */}
                <Button
                    className={"scrollToTop"}
                    title="回到顶部"
                    type="primary"
                    shape="circle"
                    icon={<VerticalAlignTopOutlined />}
                    size="large"
                    onClick={this.scrollTo.bind(null, "top")}
                />
                {/* 回到底部 */}
                <Button
                    className={"scrollToBottom"}
                    title="回到底部"
                    type="primary"
                    shape="circle"
                    icon={<VerticalAlignBottomOutlined />}
                    size="large"
                    onClick={this.scrollTo.bind(null, "bottom")}
                />
                {/* 锚点 */}
                <BlogContMao blogcont={this.state.blogcont} />
            </div>
        );
    }
}

export default BlogContEdit;
