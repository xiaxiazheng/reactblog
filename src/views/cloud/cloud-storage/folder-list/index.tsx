import { message, Modal } from "antd";
import React, { useEffect, useState, useContext } from "react";
import styles from "./index.module.scss";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
    DeleteOutlined,
    EditOutlined,
    FolderOpenOutlined,
    FolderOutlined,
    RocketOutlined,
} from "@ant-design/icons";
import { updateFolderName, deleteFolder } from "@/client/FolderHelper";
import { FolderType } from "..";

interface IProps extends RouteComponentProps {
    folderList: any[];
    Width: string;
    getFolderList: Function;
    parentId: string;
    folderMap: any;
    getAllFolderList: any;
    showModal: Function;
}

const { confirm } = Modal;

const FolderList: React.FC<IProps> = (props) => {
    const {
        folderList,
        Width,
        history,
        getFolderList,
        parentId,
        folderMap,
        getAllFolderList,
        showModal,
    } = props;

    // 文件夹列表
    const [hoverFolder, setHoverFolder] = useState<FolderType>();

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

    // 单击打开文件夹
    const clickFolder = (id: string) => {
        history.push(`/admin/cloud/${id}`);
    };

    // 删除文件夹
    const deleteAFolder = async (name: string, folder_id: string) => {
        if (typeof folderMap[folder_id].children !== "undefined") {
            message.warning(
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

    return (
        <>
            {folderList.map((item) => {
                return (
                    <div
                        key={item.folder_id}
                        className={styles.folderBox}
                        style={{
                            width: `${Width}`,
                            height: `${Width}`,
                        }}
                        onClick={clickFolder.bind(null, item.folder_id)}
                        onMouseEnter={() => {
                            setHoverFolder(item);
                        }}
                        onMouseLeave={() => {
                            setHoverFolder(undefined);
                        }}
                    >
                        {hoverFolder &&
                        hoverFolder.folder_id === item.folder_id ? (
                            <FolderOpenOutlined className={styles.folderIcon} />
                        ) : (
                            <FolderOutlined className={styles.folderIcon} />
                        )}
                        <div>{item.name}</div>
                        {hoverFolder &&
                            hoverFolder.folder_id === item.folder_id && (
                                <div>
                                    <EditOutlined
                                        className={styles.icon}
                                        title="编辑文件夹名称"
                                        onClick={(e) => {
                                            editFolderName(
                                                item.name,
                                                item.folder_id
                                            );
                                            e.stopPropagation();
                                        }}
                                    />
                                    <DeleteOutlined
                                        className={styles.icon}
                                        title="删除文件夹"
                                        onClick={(e) => {
                                            deleteAFolder(
                                                item.name,
                                                item.folder_id
                                            );
                                            e.stopPropagation();
                                        }}
                                    />
                                    <RocketOutlined
                                        className={styles.icon}
                                        title="切换文件夹"
                                        onClick={(e) => {
                                            showModal(item, "folder");
                                            e.stopPropagation();
                                        }}
                                    />
                                </div>
                            )}
                    </div>
                );
            })}
        </>
    );
};

export default withRouter(FolderList);
