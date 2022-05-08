import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { UserContext } from "@/context/UserContext";
import { getFolder, addFolder, getAllFolder } from "@/client/FolderHelper";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { message, Tree } from "antd";
import { ArrowUpOutlined, FolderAddOutlined } from "@ant-design/icons";
import {
    FolderFilled,
    FolderOpenFilled,
    DownOutlined,
} from "@ant-design/icons";
import FolderContent from "./folder-content";

export interface FolderType {
    cTime: string;
    folder_id: string;
    isShow: string;
    name: string;
    parent_id: string;
    username: string;
}

export interface FolderMapType {
    [k: string]: FolderTreeType;
}

interface FolderTreeType extends FolderType {
    title: string;
    key: string;
    icon: Function;
    children?: FolderTreeType[];
}

export interface IFolderTreeType {
    title: string;
    key: string;
    icon: Function;
    children?: FolderTreeType[];
}

interface CloudStorageProps extends RouteComponentProps {}

// 云盘
const CloudStorage: React.FC<CloudStorageProps> = (props) => {
    const { match, history } = props;
    const { username } = useContext(UserContext);

    // 文件夹树
    const [folderTree, setFolderTree] = useState<IFolderTreeType[]>();
    const [folderMap, setFolderMap] = useState<FolderMapType>({});
    // 当前目录下的文件夹
    const [folderList, setFolderList] = useState<FolderType[]>([]);

    // 父文件夹的 id，如果是顶层则为空串
    const [parentId, setParentId] = useState<string>("root");

    useEffect(() => {
        // 获取文件夹树
        getAllFolderList();
    }, []);

    useEffect(() => {
        const parent_id = (match.params as any).parent_id || "root";
        setParentId(parent_id);
    }, [match]);

    // 获取所有文件夹（树状）
    const getAllFolderList = async () => {
        const res = await getAllFolder(username);
        if (res) {
            const { tree } = res;
            const map: FolderMapType = {};
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
                    map[item.folder_id] = item;
                });
                return list;
            };
            const newTree = walk(tree);
            setFolderTree([
                {
                    title: "根目录",
                    key: "root",
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

    // 获取文件夹
    const getFolderList = async (parent_id: string) => {
        const res = await getFolder(parent_id, username);
        if (res) {
            setFolderList(
                res.sort(
                    (a, b) =>
                        new Date(b.cTime).getTime() -
                        new Date(a.cTime).getTime()
                )
            );
        }
    };

    return (
        <>
            {parentId !== "root" && (
                <div className={styles.goback} onClick={goback}>
                    <ArrowUpOutlined />
                    返回上一层
                </div>
            )}
            <div className={styles.addFolder} onClick={addAFolder}>
                <FolderAddOutlined />
                新增文件夹
            </div>
            {/* 文件夹树 */}
            {/* <div className={styles.cloudTree}>
                <Tree
                    showIcon
                    defaultExpandAll
                    onSelect={onSelect}
                    switcherIcon={<DownOutlined />}
                    treeData={folderTree}
                    selectedKeys={[parentId]}
                />
            </div> */}
            {/* 具体的文件夹内容 */}
            <FolderContent
                parentId={parentId}
                folderList={folderList}
                folderMap={folderMap}
                folderTree={folderTree}
                getFolderList={getFolderList}
                getAllFolderList={getAllFolderList}
            />
        </>
    );
};

export default withRouter(CloudStorage);
