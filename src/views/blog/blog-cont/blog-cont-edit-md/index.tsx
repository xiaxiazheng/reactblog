import React, { useState, useEffect } from "react";
import { OneBlogType } from "../../BlogType";
import styles from "./index.module.scss";
import classnames from "classnames";
import { SaveOutlined } from "@ant-design/icons";
import { Input, Button, message } from "antd";
import { modifyBlogCont } from "@/client/BlogHelper";
import MarkdownShow from "../markdown-show";
import ImageBox from "@/components/image-box";
import FileBox from "@/components/file-box";
import { staticUrl } from "@/env_config";

interface PropsType {
    blogData: OneBlogType;
    getBlogContData: Function; // 重新获取整个日志信息
    getImageList: Function; // 只重新获取日志图片列表
    getFileList: Function; // 只重新获取日志附件列表
}

const LogContEditByMD: React.FC<PropsType> = (props) => {
    const { blogData, getBlogContData, getImageList, getFileList } = props;

    const { TextArea } = Input;

    const [title, setTitle] = useState<string>();
    const [author, setAuthor] = useState<string>();
    const [markString, setMarkString] = useState("");

    const [isTitleChange, setIsTitleChange] = useState(false);
    const [isAuthorChange, setIsAuthorChange] = useState(false);
    const [isLogContChange, setIsLogContChange] = useState(false);

    useEffect(() => {
        setTitle(blogData.title);
        setAuthor(blogData.author);
        setMarkString(blogData.blogcont || "");
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** 判断是否用 ctrl + s 保存修改，直接在 onKeyDown 运行 saveEditLog() 的话只会用初始值去发请求（addEventListener）绑的太死 */
    const [isKeyDown, setIsKeyDown] = useState(false);
    useEffect(() => {
        if (isKeyDown) {
            saveEditLog();
            setIsKeyDown(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isKeyDown]);

    // 键盘事件
    const onKeyDown = (e: any) => {
        // 加上了 mac 的 command 按键的 metaKey 的兼容
        if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            setIsKeyDown(true);
        }
    };

    const className = classnames({
        [styles.blogcontEditByMD]: true,
        ScrollBar: true,
    });

    // 保存日志
    const saveEditLog = async () => {
        const params: any = {
            id: blogData.blog_id,
            title: title,
            author: author,
            blogcont: markString,
        };
        let res = await modifyBlogCont(params);
        if (res) {
            message.success("保存成功");
            setIsTitleChange(false);
            setIsAuthorChange(false);
            setIsLogContChange(false);
            getBlogContData(); // 调用父组件的函数，获取最新的东西
        } else {
            message.error("保存失败");
        }
    };

    const handleLogContChange = (e: any) => {
        setMarkString(e.target.value);
        setIsLogContChange(blogData.blogcont !== e.target.value);
    };

    // 监听标题变化
    const handleTitleChange = (e: any) => {
        setTitle(e.target.value);
        setIsTitleChange(blogData.title !== e.target.value);
    };

    // 监听作者变化
    const handleAuthorChange = (e: any) => {
        setAuthor(e.target.value);
        setIsAuthorChange(blogData.author !== e.target.value);
    };

    return (
        <div className={className}>
            {blogData && (
                <>
                    {/* 保存按钮 */}
                    <Button
                        className={styles.saveButton}
                        danger={
                            isTitleChange || isAuthorChange || isLogContChange
                        }
                        type={"primary"}
                        onClick={saveEditLog}
                    >
                        <SaveOutlined />
                        保存
                    </Button>
                    {/* 标题名称和时间 */}
                    <Input
                        className={styles.blogcontTitle}
                        size="large"
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <Input
                        className={styles.blogcontAuthor}
                        value={author}
                        onChange={handleAuthorChange}
                    />
                    <div className={styles.blogcontTime}>
                        <span>创建时间：{blogData.cTime}</span>
                        <span>修改时间：{blogData.mTime}</span>
                    </div>
                    {/* markdown 展示 */}
                    <div className={`${styles.markdownShower} ScrollBar`}>
                        <MarkdownShow blogcont={markString} />
                    </div>
                    {/* markdown 编辑 */}
                    <TextArea
                        rows={10}
                        className={`${styles.markdownEditor} ScrollBar`}
                        value={markString}
                        onChange={handleLogContChange}
                    />
                    {/* 图片列表 */}
                    <div className={`${styles.imgBox} ScrollBar`}>
                        {/* 上传图片 */}
                        <ImageBox
                            otherId={blogData.blog_id}
                            type="blog"
                            imageUrl=""
                            imageMinUrl=""
                            initImgList={getImageList}
                            width="140px"
                            imageData={{}}
                        />
                        {/* 上传附件 */}
                        <FileBox
                            otherId={blogData.blog_id}
                            type="blog"
                            fileUrl=""
                            initFileList={getFileList}
                            width="140px"
                            fileData={{}}
                        />
                        {/* 图片列表 */}
                        {blogData?.imgList?.map((item) => {
                            return (
                                <ImageBox
                                    key={item.img_id}
                                    type="blog"
                                    imageId={item.img_id}
                                    imageName={item.imgname}
                                    imageFileName={item.filename}
                                    imageUrl={`${staticUrl}/img/blog/${item.filename}`}
                                    imageMinUrl={
                                        item.has_min === "1"
                                            ? `${staticUrl}/min-img/${item.filename}`
                                            : ""
                                    }
                                    initImgList={getImageList}
                                    width="140px"
                                    imageData={item}
                                />
                            );
                        })}
                        {/* 附件列表 */}
                        {blogData?.fileList?.map((item) => {
                            return (
                                <FileBox
                                    key={item.file_id}
                                    type="blog"
                                    fileId={item.file_id}
                                    originalName={item.originalname}
                                    fileName={item.filename}
                                    fileUrl={`${staticUrl}/file/blog/${item.filename}`}
                                    initFileList={getFileList}
                                    width="140px"
                                    fileData={item}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default LogContEditByMD;
