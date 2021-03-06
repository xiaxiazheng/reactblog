import React, { useEffect, useState, useContext } from "react";
import styles from "./index.module.scss";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { message, Modal, Tree } from "antd";
import { Icon } from "@ant-design/compatible";
import { DownOutlined } from "@ant-design/icons";
import {
  ImgType,
  getImgListByOtherId,
  switchImgOtherId,
} from "@/client/ImgHelper";
import {
  FileType,
  getFileListByOtherId,
  switchFileOtherId,
} from "@/client/FileHelper";
import {
  updateFolderName,
  deleteFolder,
  switchFolderParent,
} from "@/client/FolderHelper";
import { staticUrl } from "@/env_config";
import { UserContext } from "@/context/UserContext";
import { FolderType, FolderMapType, IFolderTreeType } from "../";
import ImageBox from "@/components/image-box";
import FileBox from "@/components/file-box";
import Loading from "@/components/loading";

interface CloudStorageProps extends RouteComponentProps {
  parentId: string;
  folderMap: FolderMapType;
  folderList: FolderType[];
  getFolderList: Function;
  getAllFolderList: Function;
  folderTree: IFolderTreeType[] | undefined;
}

const Width = "160px";

const FolderContent: React.FC<CloudStorageProps> = (props) => {
  const {
    parentId,
    history,
    folderTree,
    folderMap,
    folderList,
    getFolderList,
    getAllFolderList,
  } = props;

  const { confirm } = Modal;

  const [loading, setLoading] = useState(true);
  const { username } = useContext(UserContext);

  useEffect(() => {
    // 获取文件夹列表
    getFolderList(parentId);
    // 获取图片列表
    getImgList(parentId);
    // 获取文件列表
    getFileList(parentId);
  }, [parentId]);

  // 文件夹列表
  const [hoverFolder, setHoverFolder] = useState<FolderType>();
  // 图片列表
  const [imgList, setImgList] = useState<ImgType[]>([]);
  // 文件列表
  const [fileList, setFileList] = useState<FileType[]>([]);

  // 获取图片列表
  const getImgList = async (parent_id: string) => {
    setLoading(true);
    const res = await getImgListByOtherId(parent_id, username);
    if (res) {
      const list: ImgType[] = [];
      let resList = [...res];
      // 如果 parent_id 为空串，会把 other_id 为空的所有图片返回回来，需要自己手动筛选掉 type 不为 cloud 的
      if (parent_id === "") {
        resList = resList.filter((item) => item.type === "cloud");
      }
      for (let item of resList) {
        // 拼好 img 的 url
        list.push({
          ...item,
          imageUrl: `${staticUrl}/img/cloud/${item.filename}`,
          imageMinUrl:
            item.has_min === "1" ? `${staticUrl}/min-img/${item.filename}` : "",
        });
      }
      setImgList(list);
    }
    setLoading(false);
  };

  // 获取文件列表
  const getFileList = async (parent_id: string) => {
    setLoading(true);
    const res = await getFileListByOtherId(parent_id, username);
    if (res) {
      const list: FileType[] = [];
      let resList = [...res];
      // 如果 parent_id 为空串，会把 other_id 为空的所有图片返回回来，需要自己手动筛选掉 type 不为 cloud 的
      if (parent_id === "") {
        resList = resList.filter((item) => item.type === "cloud");
      }
      for (let item of resList) {
        // 拼好 img 的 url
        list.push({
          ...item,
          fileUrl: `${staticUrl}/file/cloud/${item.filename}`,
        });
      }
      setFileList(list);
    }
    setLoading(false);
  };

  // 双击打开文件夹
  const clickFolder = (id: string) => {
    history.push(`/admin/cloud/${id}`);
  };

  // 打开弹窗
  const showModal = (item: any, type: "folder" | "image" | "file") => {
    console.log(item);
    if (type === "folder") {
      setActive({
        name: item.name,
        id: item.folder_id,
        parent_id: item.parent_id,
      });
    }
    if (type === "image") {
      setActive({
        name: item.imgname,
        id: item.img_id,
        parent_id: item.parent_id,
      });
    }
    if (type === "file") {
      setActive({
        name: item.originalname,
        id: item.file_id,
        parent_id: item.parent_id,
      });
    }
    setActiveType(type);
    setIsModalVisible(true);
    setNewParentId(item.parent_id);
  };

  // 切换目录
  const handleOk = async () => {
    if (!newParentId) {
      message.warn("请选择一个节点", 0.5);
      return;
    }
    if (newParentId === active.parent_id) {
      message.warn("与原文件夹相同，无需切换", 0.5);
      return;
    }

    // 这里要加额外的判断：如果是文件夹转移的话，文件夹不能够转移到自己及自己的子文件夹下（不然这文件夹就没了）
    // if (activeType === "folder") {
    //   message.error("本功能暂不开放");
    //   return;
    // }

    let request: any = new Promise(() => {});
    let params = {};
    if (activeType === "file") {
      request = switchFileOtherId;
      params = {
        file_id: active.id,
        other_id: newParentId,
      };
    }
    if (activeType === "image") {
      request = switchImgOtherId;
      params = {
        img_id: active.id,
        other_id: newParentId,
      };
    }
    if (activeType === "folder") {
      request = switchFolderParent;
      params = {
        folder_id: active.id,
        parent_id: newParentId,
      };
    }

    let res = await request(params);
    const map: any = {
      folder: "文件夹",
      image: "图片",
      file: "文件",
    };

    if (res) {
      message.success(
        `更换${map[activeType || ""]} “${active.name}” 到 “${
          folderMap[newParentId] ? folderMap[newParentId].name : "根目录"
        }” 文件夹下成功`
      );

      setIsModalVisible(false);
      setActive(undefined);
      setActiveType(undefined);
      setNewParentId(undefined);

      if (activeType === "image") {
        getImgList(parentId);
      }
      if (activeType === "file") {
        getFileList(parentId);
      }
      if (activeType === "folder") {
        getFolderList(parentId);
        getAllFolderList();
      }
    } else {
      message.error(
        `更换${map[activeType || ""]} “${active.name}” 到 “${
          folderMap[newParentId] ? folderMap[newParentId].name : "根目录"
        }” 文件夹下失败`
      );
    }
  };

  // 编辑文件夹名称
  const editFolderName = async (oldName: string, folder_id: string) => {
    const name = prompt(`请输入新增的文件夹的名称`, oldName);
    if (name && name !== "") {
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
    if (typeof folderMap[folder_id].children !== "undefined") {
      message.warn(
        "该文件夹内还有文件夹，暂不支持递归删除（其实里面有文件的话也不推荐删除）"
      );
      return;
    }
    confirm({
      title: `你将删除"${name}"`,
      content: "Are you sure？",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const params = {
          folder_id,
        };
        const res = await deleteFolder(params);
        if (res) {
          message.success("删除文件夹成功");
          getFolderList(parentId);
        } else {
          message.error("删除文件夹失败");
        }
        getAllFolderList();
      },
      onCancel() {
        message.info("已取消删除文件夹", 1);
      },
    });
  };

  const handleCancel = () => {
    message.warn("已取消更换文件夹", 0.5);

    setIsModalVisible(false);
    setActive(undefined);
    setActiveType(undefined);
    setNewParentId(undefined);
  };

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [active, setActive] = useState<any>();
  const [activeType, setActiveType] = useState<"folder" | "image" | "file">();
  const [newParentId, setNewParentId] = useState<string>();

  const onSwitchSelect = (selectedKeys: any, info: any) => {
    if (selectedKeys[0] === active.parent_id) {
      message.warn("与源文件夹一致", 0.5);
    } else {
      setNewParentId(selectedKeys[0]);
      console.log(selectedKeys[0]);
    }
  };

  return (
    <>
      <div className={styles.imgLength}>
        {!loading && <>共 {imgList.length} 张图片</>}
        <br />
        {!loading && <>共 {fileList.length} 个文件</>}
      </div>
      <div className={styles.cloudStorage}>
        {loading && <Loading />}
        {/* 文件夹列表 */}
        {folderList.map((item) => {
          return (
            <div
              key={item.folder_id}
              className={styles.folderBox}
              style={{
                width: `${Width}`,
                height: `${Width}`,
              }}
              onDoubleClick={clickFolder.bind(null, item.folder_id)}
              onMouseEnter={() => {
                setHoverFolder(item);
              }}
              onMouseLeave={() => {
                setHoverFolder(undefined);
              }}
            >
              <Icon
                className={styles.folderIcon}
                type={
                  hoverFolder && hoverFolder.folder_id === item.folder_id
                    ? "folder-open"
                    : "folder"
                }
              />
              <div>{item.name}</div>
              {hoverFolder && hoverFolder.folder_id === item.folder_id && (
                <div>
                  <Icon
                    className={styles.icon}
                    type="edit"
                    title="编辑文件夹名称"
                    onClick={editFolderName.bind(
                      null,
                      item.name,
                      item.folder_id
                    )}
                  />
                  <Icon
                    className={styles.icon}
                    type="delete"
                    title="删除文件夹"
                    onClick={deleteAFolder.bind(
                      null,
                      item.name,
                      item.folder_id
                    )}
                  />
                  <Icon
                    className={styles.icon}
                    type="rocket"
                    title="切换文件夹"
                    onClick={showModal.bind(null, item, "folder")}
                  />
                </div>
              )}
            </div>
          );
        })}
        {/* 图片列表 */}
        <ImageBox
          otherId={parentId}
          type={"cloud"}
          imageUrl=""
          imageMinUrl=""
          initImgList={getImgList.bind(null, parentId)}
          imageData={{}}
          width={Width}
        />
        {imgList.map((item: ImgType) => {
          return (
            <ImageBox
              key={item.img_id}
              type={"cloud"}
              imageId={item.img_id}
              imageName={item.imgname}
              imageFileName={item.filename}
              imageUrl={item.imageUrl}
              imageMinUrl={item.imageMinUrl}
              initImgList={getImgList.bind(null, parentId)}
              imageData={item}
              width={Width}
              iconRender={
                <Icon
                  type="rocket"
                  title="切换文件夹"
                  onClick={showModal.bind(null, item, "image")}
                />
              }
            />
          );
        })}
        {/* 文件列表 */}
        <FileBox
          otherId={parentId}
          type={"cloud"}
          fileUrl=""
          initFileList={getFileList.bind(null, parentId)}
          fileData={{}}
          width={Width}
        />
        {fileList.map((item: FileType) => {
          return (
            <FileBox
              key={item.file_id}
              type={"cloud"}
              fileId={item.file_id}
              originalName={item.originalname}
              fileName={item.filename}
              fileUrl={item.fileUrl}
              initFileList={getFileList.bind(null, parentId)}
              fileData={item}
              width={Width}
              iconRender={
                <Icon
                  type="rocket"
                  title="切换文件夹"
                  onClick={showModal.bind(null, item, "file")}
                />
              }
            />
          );
        })}
      </div>
      <Modal
        title={`请选择要将 “${active ? active.name : ""}” 更换到的目录`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          showIcon
          defaultExpandAll
          onSelect={onSwitchSelect}
          // @ts-ignore
          switcherIcon={<DownOutlined />}
          treeData={folderTree}
          selectedKeys={[newParentId || ""]}
        />
      </Modal>
    </>
  );
};

export default withRouter(FolderContent);
