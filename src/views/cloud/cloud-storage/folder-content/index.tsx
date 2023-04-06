import React, { useEffect, useState, useContext } from "react";
import styles from "./index.module.scss";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { message, Modal, Tree } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";
import {
    getImgListByOtherId,
    switchImgOtherId,
    ImageType,
    ImgType,
} from "@/client/ImgHelper";
import {
    FType,
    getFileListByOtherId,
    switchFileOtherId,
} from "@/client/FileHelper";
import { switchFolderParent } from "@/client/FolderHelper";
import { staticUrl } from "@/env_config";
import { UserContext } from "@/context/UserContext";
import { FolderType, FolderMapType, IFolderTreeType } from "..";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import Loading from "@/components/loading";
import FileImageUpload from "@/components/file-image-handle/file-image-upload";
import FileListBox from "@/components/file-image-handle/file-list-box";
import FolderList from "../folder-list";

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
        folderTree,
        folderMap,
        folderList,
        getFolderList,
        getAllFolderList,
    } = props;

    const [loading, setLoading] = useState(true);
    const { username } = useContext(UserContext);

    useEffect(() => {
        // 获取文件夹列表
        getFolderList(parentId);
        console.log("parentId", parentId);

        if (parentId) {
            // 获取图片列表
            getImgList(parentId);
            // 获取文件列表
            getFileList(parentId);
        }
    }, [parentId]);

    // 图片列表
    const [imgList, setImgList] = useState<ImageType[]>([]);
    // 文件列表
    const [fileList, setFileList] = useState<FType[]>([]);

    // 获取图片列表
    const getImgList = async (parent_id: string) => {
        setImgList([]);
        setLoading(true);
        const res = await getImgListByOtherId(parent_id, username);
        if (res) {
            let resList = [...res];
            // 如果 parent_id 为空串，会把 other_id 为空的所有图片返回回来，需要自己手动筛选掉 type 不为 cloud 的
            if (parent_id === "") {
                resList = resList.filter((item) => item.type === "cloud");
            }
            setImgList(resList);
        }
        setLoading(false);
    };

    // 获取文件列表
    const getFileList = async (parent_id: string) => {
        setFileList([]);
        setLoading(true);
        const res = await getFileListByOtherId(parent_id, username);
        if (res) {
            const list: FType[] = [];
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
            message.warning("请选择一个节点", 0.5);
            return;
        }
        if (newParentId === active.parent_id) {
            message.warning("与原文件夹相同，无需切换", 0.5);
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
                    folderMap[newParentId]
                        ? folderMap[newParentId].name
                        : "根目录"
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
                    folderMap[newParentId]
                        ? folderMap[newParentId].name
                        : "根目录"
                }” 文件夹下失败`
            );
        }
    };

    const handleCancel = () => {
        message.warning("已取消更换文件夹", 0.5);

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
            message.warning("与源文件夹一致", 0.5);
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
                <FolderList
                    folderList={folderList}
                    Width={Width}
                    getFolderList={getFolderList}
                    parentId={parentId}
                    folderMap={folderMap}
                    getAllFolderList={getAllFolderList}
                    showModal={showModal}
                />
                {/* 上传组件 */}
                {parentId !== "root" && (
                    <FileImageUpload
                        type="cloud"
                        width={Width}
                        refresh={() => {
                            getImgList(parentId);
                            getFileList(parentId);
                        }}
                        other_id={parentId}
                    />
                )}
                {/* 图片列表 */}
                <ImageListBox
                    type={"cloud"}
                    imageList={imgList}
                    width={Width}
                    refresh={getImgList.bind(null, parentId)}
                    iconRender={(item: ImgType) => (
                        <RocketOutlined
                            title="切换文件夹"
                            onClick={showModal.bind(null, item, "image")}
                        />
                    )}
                />
                {/* 文件列表 */}
                <FileListBox
                    fileList={fileList}
                    width={Width}
                    refresh={getFileList.bind(null, parentId)}
                    type={"cloud"}
                    iconRender={(item: FType) => (
                        <RocketOutlined
                            title="切换文件夹"
                            onClick={showModal.bind(null, item, "file")}
                        />
                    )}
                />
            </div>
            <Modal
                title={`请选择要将 “${active ? active.name : ""}” 更换到的目录`}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Tree
                    showIcon
                    defaultExpandAll
                    onSelect={onSwitchSelect}
                    switcherIcon={<DownOutlined />}
                    treeData={folderTree}
                    selectedKeys={[newParentId || ""]}
                />
            </Modal>
        </>
    );
};

export default withRouter(FolderContent);
