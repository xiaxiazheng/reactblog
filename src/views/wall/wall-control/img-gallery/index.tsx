import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { getImgList, getImgTypeList } from "@/client/ImgHelper";
import { staticUrl } from "@/env_config";
import ImageBox from "@/components/image-box";
import Loading from "@/components/loading";
import { UserContext } from "@/context/UserContext";
import {
  getFolder,
  addFolder,
  updateFolderName,
  deleteFolder,
} from "@/client/FolderHelper";
import { getImgListByOtherId } from "@/client/ImgHelper";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon } from "@ant-design/compatible";
import { message, Modal } from "antd";

interface ImgType {
  cTime: string;
  filename: string;
  img_id: string;
  imgname: string;
  other_id: string;
  type: string;
  imageUrl: string;
  has_min: "0" | "1";
  imageMinUrl: string;
}

interface FolderType {
  cTime: string;
  folder_id: string;
  isShow: string;
  name: string;
  parent_id: string;
  username: string;
}

interface ImgGalleryProps extends RouteComponentProps {}

// 图库
const ImgGallery: React.FC<ImgGalleryProps> = (props) => {
  const { match, history } = props;
  const { username } = useContext(UserContext);

  const { confirm } = Modal;

  // 文件夹列表
  const [folderList, setFolderList] = useState<FolderType[]>([]);
  // 图片列表
  const [imgList, setImgList] = useState<ImgType[]>([]);

  useEffect(() => {
    const parentId = (match.params as any).parent_id || "";
    // 获取文件夹列表
    getFolderList(parentId);
    // 获取图片列表
    getImgList(parentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match]);

  // 获取文件夹
  const getFolderList = async (parent_id: string) => {
    const res = await getFolder(parent_id, username);
    if (res) {
      setFolderList(res);
    }
  };

  // 获取图片列表
  const getImgList = async (parent_id: string) => {
    const res = await getImgListByOtherId(parent_id, username);
    if (res) {
      const list: ImgType[] = [];
      for (let item of res) {
        // 拼好 img 的 url
        list.push({
          ...item,
          imageUrl: `${staticUrl}/img/wall/${item.filename}`,
          imageMinUrl:
            item.has_min === "1" ? `${staticUrl}/min-img/${item.filename}` : "",
        });
      }
      setImgList(list);
    }
  };

  // 双击打开文件夹
  const clickFolder = (id: string) => {
    history.push(`/admin/wall/${id}`);
  };

  // 回退
  const goback = () => {
    history.goBack();
  };

  // 新增文件夹
  const addAFolder = async () => {
    const name = prompt(`请输入新增的文件夹的名称`, "new folder");
    if (name && name !== "") {
      const parentId = (match.params as any).parent_id || "";
      const params = {
        name,
        parent_id: parentId,
      };
      const res = await addFolder(params);
      if (res) {
        message.success("新增文件夹成功");
        getFolderList(parentId);
      } else {
        message.error("新增文件夹失败");
      }
    }
  };

  // 编辑文件夹名称
  const editFolderName = async (oldName: string, folder_id: string) => {
    const name = prompt(`请输入新增的文件夹的名称`, oldName);
    if (name && name !== "") {
      const parentId = (match.params as any).parent_id || "";
      const params = {
        name,
        folder_id,
      };
      const res = await updateFolderName(params);
      if (res) {
        message.success("新增文件夹成功");
        getFolderList(parentId);
      } else {
        message.error("新增文件夹失败");
      }
    }
  };

  // 删除文件夹
  const deleteAFolder = async (name: string, folder_id: string) => {
    confirm({
      title: `你将删除"${name}"`,
      content: "Are you sure？",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const parentId = (match.params as any).parent_id || "";
        const params = {
          folder_id
        };
        const res = await deleteFolder(params);
        if (res) {
          message.success("删除文件夹成功");
          getFolderList(parentId);
        } else {
          message.error("删除文件夹失败");
        }
      },
      onCancel() {
        message.info("已取消删除文件夹", 1);
      },
    });
  };

  return (
    <>
      <div className={styles.addFolder} onClick={addAFolder}>
        新增文件夹
      </div>
      {(match.params as any).parent_id && (
        <div className={styles.goback} onClick={goback}>
          返回上一层
        </div>
      )}
      <div className={styles.ImgGallery}>
        {/* 文件夹列表 */}
        {folderList.map((item) => {
          return (
            <div
              key={item.folder_id}
              className={styles.folderBox}
              onDoubleClick={clickFolder.bind(null, item.folder_id)}
            >
              <Icon className={styles.folderIcon} type="folder-open" />
              <div>{item.name}</div>
              <div>
                <Icon
                  className={styles.icon}
                  type="edit"
                  title="编辑文件夹名称"
                  onClick={editFolderName.bind(null, item.name, item.folder_id)}
                />
                <Icon
                  className={styles.icon}
                  type="delete"
                  title="删除文件夹"
                  onClick={deleteAFolder.bind(null, item.name, item.folder_id)}
                />
              </div>
            </div>
          );
        })}
        {/* 图片列表 */}
        <ImageBox
          type={"wall"}
          imageUrl=""
          imageMinUrl=""
          initImgList={getImgList.bind(null, (match.params as any).parent_id)}
        />
        {imgList.map((item: ImgType) => {
          return (
            <ImageBox
              key={item.img_id}
              type={"wall"}
              imageId={item.img_id}
              imageName={item.imgname}
              imageFileName={item.filename}
              imageUrl={item.imageUrl}
              imageMinUrl={item.imageMinUrl}
              initImgList={getImgList.bind(
                null,
                (match.params as any).parent_id
              )}
            />
          );
        })}
      </div>
    </>
  );
};

export default withRouter(ImgGallery);
