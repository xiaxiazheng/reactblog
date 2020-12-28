import React, { useState, useEffect } from "react";
import { OneLogType } from "../../LogType";
import styles from "./index.module.scss";
import classnames from "classnames";
import { Icon } from "@ant-design/compatible";
import { Input, Button, message } from "antd";
import { modifyLogCont } from "@/client/LogHelper";
import MarkdownShow from "../markdown-show";
import ImageBox from "@/components/image-box";
import { staticUrl } from "@/env_config";

interface PropsType {
  logdata: OneLogType;
  getLogContData: Function; // 重新获取整个日志信息
  getImageList: Function; // 只重新获取日志图片列表
}

const LogContEditByMD: React.FC<PropsType> = (props) => {
  const { logdata, getLogContData, getImageList } = props;

  const { TextArea } = Input;

  const [title, setTitle] = useState<string>();
  const [author, setAuthor] = useState<string>();
  const [markString, setMarkString] = useState("");

  const [isTitleChange, setIsTitleChange] = useState(false);
  const [isAuthorChange, setIsAuthorChange] = useState(false);
  const [isLogContChange, setIsLogContChange] = useState(false);

  useEffect(() => {
    setTitle(logdata.title);
    setAuthor(logdata.author);
    setMarkString(logdata.logcont);
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
    [styles.logcontEditByMD]: true,
    ScrollBar: true,
  });

  // 保存日志
  const saveEditLog = async () => {
    const params: any = {
      id: logdata.log_id,
      title: title,
      author: author,
      logcont: markString,
    };
    let res = await modifyLogCont(params);
    if (res) {
      message.success("保存成功");
      setIsTitleChange(false);
      setIsAuthorChange(false);
      setIsLogContChange(false);
      getLogContData(); // 调用父组件的函数，获取最新的东西
    } else {
      message.error("保存失败");
    }
  };

  const handleLogContChange = (e: any) => {
    setMarkString(e.target.value);
    setIsLogContChange(logdata.logcont !== e.target.value);
  };

  // 监听标题变化
  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
    setIsTitleChange(logdata.title !== e.target.value);
  };

  // 监听作者变化
  const handleAuthorChange = (e: any) => {
    setAuthor(e.target.value);
    setIsAuthorChange(logdata.author !== e.target.value);
  };

  return (
    <div className={className}>
      {logdata && (
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
            className={styles.logcontTitle}
            size="large"
            value={title}
            onChange={handleTitleChange}
          />
          <Input
            className={styles.logcontAuthor}
            value={author}
            onChange={handleAuthorChange}
          />
          <div className={styles.logcontTime}>
            <span>创建时间：{logdata.cTime}</span>
            <span>修改时间：{logdata.mTime}</span>
          </div>
          {/* markdown 展示 */}
          <div className={`${styles.markdownShower} ScrollBar`}>
            <MarkdownShow logcont={markString} />
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
            <ImageBox
              otherId={logdata.log_id}
              type="log"
              imageUrl=""
              imageMinUrl=""
              initImgList={getImageList}
              width="140px"
            />
            {logdata.imgList.map((item) => {
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
