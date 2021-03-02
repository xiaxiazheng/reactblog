import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { staticUrl } from "@/env_config";
import ImageBox from "@/components/image-box";
import FileBox from "@/components/file-box";
import Loading from "@/components/loading";
import { UserContext } from "@/context/UserContext";
import {
  getFolder,
  addFolder,
  updateFolderName,
  deleteFolder,
  getAllFolder,
  switchFolderParent,
} from "@/client/FolderHelper";
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
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon } from "@ant-design/compatible";
import { message, Modal, Tree } from "antd";
import {
  FolderFilled,
  FolderOpenFilled,
  DownOutlined,
} from "@ant-design/icons";

interface FolderType {
  cTime: string;
  folder_id: string;
  isShow: string;
  name: string;
  parent_id: string;
  username: string;
}

interface FolderMapType {
  [k: string]: FolderType
}

interface FolderTreeType extends FolderType {
  title: string;
  key: string;
  icon: Function;
  children?: FolderTreeType[];
}

interface IFolderTreeType {
  title: string;
  key: string;
  icon: Function;
  children?: FolderTreeType[];
}

const Width = "160px";

interface CloudStorageProps extends RouteComponentProps {}

// 云盘
const CloudStorage: React.FC<CloudStorageProps> = (props) => {
  const { match, history } = props;
  const { username } = useContext(UserContext);

  const { confirm } = Modal;

  // 文件夹树
  const [folderTree, setFolderTree] = useState<IFolderTreeType[]>();
  const [folderMap, setFolderMap] = useState<FolderMapType>({});

  // 父文件夹的 id，如果是顶层则为空串
  const [parentId, setParentId] = useState<string>("root");
  // 文件夹列表
  const [folderList, setFolderList] = useState<FolderType[]>([]);
  const [hoverFolder, setHoverFolder] = useState<FolderType>();
  // 图片列表
  const [imgList, setImgList] = useState<ImgType[]>([]);
  // 文件列表
  const [fileList, setFileList] = useState<FileType[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取文件夹树
    getAllFolderList();
  }, []);

  useEffect(() => {
    const parent_id = (match.params as any).parent_id || "root";
    setParentId(parent_id);
    // 获取文件夹列表
    getFolderList(parent_id);
    // 获取图片列表
    getImgList(parent_id);
    // 获取文件列表
    getFileList(parent_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match]);

  // 获取所有文件夹（树状）
  const getAllFolderList = async () => {
    const res = await getAllFolder(username);
    if (res) {
      const { tree, map } = res;
      const walk = (list: FolderTreeType[]) => {
        list.forEach((item) => {
          item.title = item.name;
          item.icon = ({ selected }: any) =>
            // @ts-ignore
            selected ? <FolderOpenFilled /> : <FolderFilled />;
          item.key = item.folder_id;
          if (item.children) {
            item.children = walk(item.children);
          }
        });
        return list;
      };
      const newTree = walk(tree);
      setFolderTree([
        {
          title: "根目录",
          key: 'root',
          // @ts-ignore
          icon: ({ selected }: any) =>
            // @ts-ignore
            selected ? <FolderOpenFilled /> : <FolderFilled />,
          children: newTree,
        },
      ]);
      setFolderMap(map);
    }
  };

  // 获取文件夹
  const getFolderList = async (parent_id: string) => {
    const res = await getFolder(parent_id, username);
    if (res) {
      setFolderList(res);
    }
  };

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

  // 回退上一层
  const goback = () => {
    history.push(`/admin/cloud/${folderMap[parentId].parent_id}`);
  };

  // 新增文件夹
  const addAFolder = async () => {
    const name = prompt(`请输入新增的文件夹的名称`, "new folder");
    if (name && name !== "") {
      const params = {
        name,
        parent_id: parentId,
      };
      const res = await addFolder(params);
      if (res) {
        message.success("新增文件夹成功");
        getFolderList(parentId);
        getAllFolderList();
      } else {
        message.error("新增文件夹失败");
      }
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

  // 点击文件夹
  const onSelect = (selectedKeys: any, info: any) => {
    history.push(`/admin/cloud/${selectedKeys[0]}`);
  };

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [active, setActive] = useState<any>();
  const [activeType, setActiveType] = useState<"folder" | "image" | "file">();
  const [newParentId, setNewParentId] = useState<string>();

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
          folderMap[newParentId] ? folderMap[newParentId].name : '根目录'
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
          folderMap[newParentId] ? folderMap[newParentId].name : '根目录'
        }” 文件夹下失败`
      );
    }
  };

  const handleCancel = () => {
    message.warn("已取消更换文件夹", 0.5);

    setIsModalVisible(false);
    setActive(undefined);
    setActiveType(undefined);
    setNewParentId(undefined);
  };

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
      {parentId !== "" && (
        <div className={styles.goback} onClick={goback}>
          <Icon type="arrow-up" />
          返回上一层
        </div>
      )}
      <div className={styles.addFolder} onClick={addAFolder}>
        <Icon type="folder-add" />
        新增文件夹
      </div>
      <div className={styles.imgLength}>
        {!loading && <>共 {imgList.length} 张图片</>}
        <br />
        {!loading && <>共 {fileList.length} 个文件</>}
      </div>
      {/* 文件夹树 */}
      <div className={styles.cloudTree}>
        <Tree
          showIcon
          defaultExpandAll
          onSelect={onSelect}
          // @ts-ignore
          switcherIcon={<DownOutlined />}
          treeData={folderTree}
          selectedKeys={[parentId]}
        />
      </div>
      {/* 具体的文件夹内容 */}
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

export default withRouter(CloudStorage);
