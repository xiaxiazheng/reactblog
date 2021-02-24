import React, { useState, useEffect } from "react";
import { OneBlogType } from "../../BlogType";
import styles from "./index.module.scss";
import classnames from "classnames";
import { Icon } from "@ant-design/compatible";
import { Input, Button, message } from "antd";
import { modifyBlogCont } from "@/client/BlogHelper";
import MarkdownShow from "../markdown-show";
import ImageBox from "@/components/image-box";
import FileBox from "@/components/file-box";
import { staticUrl } from "@/env_config";

interface PropsType {
  blogdata: OneBlogType;
  getBlogContData: Function; // 重新获取整个日志信息
  getImageList: Function; // 只重新获取日志图片列表
  getFileList: Function; // 只重新获取日志附件列表
}

const LogContEditByMD: React.FC<PropsType> = (props) => {
  const { blogdata, getBlogContData, getImageList, getFileList } = props;

  const { TextArea } = Input;

  const [title, setTitle] = useState<string>();
  const [author, setAuthor] = useState<string>();
  const [markString, setMarkString] = useState("");

  const [isTitleChange, setIsTitleChange] = useState(false);
  const [isAuthorChange, setIsAuthorChange] = useState(false);
  const [isLogContChange, setIsLogContChange] = useState(false);

  useEffect(() => {
    setTitle(blogdata.title);
    setAuthor(blogdata.author);
    setMarkString(blogdata.blogcont);
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
    if (e.keyCode === 83 && e.ctrlKey) {
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
      id: blogdata.blog_id,
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
    setIsLogContChange(blogdata.blogcont !== e.target.value);
  };

  // 监听标题变化
  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
    setIsTitleChange(blogdata.title !== e.target.value);
  };

  // 监听作者变化
  const handleAuthorChange = (e: any) => {
    setAuthor(e.target.value);
    setIsAuthorChange(blogdata.author !== e.target.value);
  };

  return (
    <div className={className}>
      {blogdata && (
        <>
          {/* 保存按钮 */}
          <Button
            className={styles.saveButton}
            type={
              isTitleChange || isAuthorChange || isLogContChange
                ? "danger"
                : "primary"
            }
            onClick={saveEditLog}
          >
            <Icon type="save" />
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
            <span>创建时间：{blogdata.cTime}</span>
            <span>修改时间：{blogdata.mTime}</span>
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
              otherId={blogdata.blog_id}
              type="log"
              imageUrl=""
              imageMinUrl=""
              initImgList={getImageList}
              width="140px"
              imageData={{}}
            />
            {/* 上传附件 */}
            <FileBox
              otherId={blogdata.blog_id}
              type="log"
              fileUrl=""
              initFileList={getFileList}
              width="140px"
              fileData={{}}
            />
            {/* 图片列表 */}
            {blogdata.imgList.map((item) => {
              return (
                <ImageBox
                  key={item.img_id}
                  type="log"
                  imageId={item.img_id}
                  imageName={item.imgname}
                  imageFileName={item.filename}
                  imageUrl={`${staticUrl}/img/log/${item.filename}`}
                  imageMinUrl={item.has_min === '1' ? `${staticUrl}/min-img/${item.filename}` : ''}
                  initImgList={getImageList} 
                  width="140px"
                  imageData={item}
                />
              );
            })}
            {/* 附件列表 */}
            {blogdata.fileList.map((item) => {
              return (
                <FileBox
                  key={item.file_id}
                  type="log"
                  fileId={item.file_id}
                  originalName={item.originalname}
                  fileName={item.filename}
                  fileUrl={`${staticUrl}/file/log/${item.filename}`}
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
