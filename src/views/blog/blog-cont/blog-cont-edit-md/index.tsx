import React, { useState, useEffect } from "react";
import { OneBlogType } from "../../BlogType";
import styles from "./index.module.scss";
import classnames from "classnames";
import { SaveOutlined } from "@ant-design/icons";
import { Input, Button, message } from "antd";
import { modifyBlogCont } from "@/client/BlogHelper";
import MarkdownShow from "../markdown-show";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import FileListBox from "@/components/file-image-handle/file-list-box";
import { staticUrl } from "@/env_config";
import FileImageUpload from "@/components/file-image-handle/file-image-upload";
import { useCtrlSHooks } from "@/hooks/useCtrlSHook";

interface PropsType {
    blogData: OneBlogType;
    getBlogContData: Function; // 重新获取整个日志信息
    getImageFileList: Function; // 只重新获取日志图片和文件列表
}

const LogContEditByMD: React.FC<PropsType> = (props) => {
    const { blogData, getBlogContData, getImageFileList } = props;

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
    }, []);

    useCtrlSHooks(() => {
        saveEditLog();
    });

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
                        <FileImageUpload
                            type="blog"
                            other_id={blogData.blog_id}
                            width="140px"
                            refresh={() => {
                                getImageFileList();
                            }}
                        />
                        {/* 图片列表 */}
                        <ImageListBox
                            type="blog"
                            refresh={getImageFileList}
                            width="140px"
                            imageList={blogData?.imgList || []}
                        />

                        {/* 附件列表 */}
                        <FileListBox
                            fileList={blogData?.fileList || []}
                            type="blog"
                            width="140px"
                            refresh={getImageFileList}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default LogContEditByMD;
