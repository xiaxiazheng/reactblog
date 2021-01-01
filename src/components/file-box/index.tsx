import React, { useState, useEffect, useContext } from "react";
import { Icon } from "@ant-design/compatible";
import { message, Upload, Modal } from "antd";
import styles from "./index.module.scss";
import { staticUrl } from "@/env_config";
import { deleteFile } from "@/client/FileHelper";
import { UserContext } from "@/context/UserContext";
import Item from "antd/lib/list/Item";

interface PropsType {
  otherId?: string; // 跟这个图片要插入的地方有关联的记录 id
  type: string; // 图片在该系统中的类型的类型
  fileId?: string; // 若有图片则有 id
  originalName?: string;
  fileName?: string;
  fileUrl: string; // 完整的 url 的路径，若为 '' 则该组件需提供上传，不为 '' 则提供大图或删除图片
  initFileList: Function; // 用于上传成功或删除后的图片列表初始化
  width?: string; // 可以传递宽高给组件
}

const FileBox: React.FC<PropsType> = (props) => {
  const { username } = useContext(UserContext);

  const {
    type,
    fileId,
    originalName,
    fileName,
    fileUrl,
    otherId = "",
    initFileList,
    width = "170px",
  } = props;

  const { confirm } = Modal;

  // const [loading, setLoading] = useState(true);
  const [isHover, setIsHover] = useState(false);

  const handleChange = (info: any) => {
    // 上传成功触发
    if (info.file.status === "done") {
      message.success("上传图片成功");
      initFileList();
    }
    if (info.file.status === "error") {
      message.error("上传图片失败");
    }
  };

  // 下载文件
  const downloadFile = () => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = originalName || '文件名';
    a.click();
  };

  // 删除文件
  const deleteThisFile = async () => {
    confirm({
      title: `你将删除"${originalName}"`,
      content: "Are you sure？",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const params = {
          type,
          file_id: fileId,
          filename: fileName,
        };
        const res = await deleteFile(params);
        if (res) {
          message.success("删除成功");
          await initFileList();
        } else {
          message.error("删除失败");
        }
      },
      onCancel() {
        message.info("已取消删除", 1);
      },
    });
  };

  // 复制文件的 url
  const copyFileUrl = () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.setAttribute("value", fileUrl);
    input.select();
    document.execCommand("copy");
    message.success("复制文件路径成功", 1);
    document.body.removeChild(input);
  };

  return (
    <div
      className={styles.filebox}
      style={{
        width: `${width}`,
        height: `${width}`,
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setIsHover(false);
      }}
    >
      {/* 没有文件路径的情况，展示添加 */}
      {fileUrl === "" && (
        // 上传文件
        <Upload
          className={styles.Upload}
          name={`${type}file`}
          showUploadList={false}
          action={`${staticUrl}/api/upload_${type}_file`}
          data={{
            other_id: otherId || "",
            username,
          }}
          listType="picture-card"
          onChange={handleChange}
        >
          <Icon className={styles.addIcon} type="plus" />
          点击上传文件
        </Upload>
      )}
      {/* 有文件路径的情况，展示名称 */}
      {fileUrl !== "" && (
        <span
          className={styles.filename}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setIsHover(true);
          }}
        >
          {originalName}
        </span>
      )}
      {/* 有文件路径的情况，显示操作 */}
      {fileUrl !== "" && isHover && (
        <div className={styles.Icons}>
          <Icon
            className={styles.iconBoxIcon}
            title="复制文件链接"
            type="copy"
            onClick={copyFileUrl}
          />
          <Icon
            className={styles.iconBoxIcon}
            title="下载文件"
            type="download"
            onClick={downloadFile}
          />
          <Icon
            className={styles.iconBoxIcon}
            title="删除文件"
            type="delete"
            onClick={deleteThisFile}
          />
        </div>
      )}
    </div>
  );
};

export default FileBox;
