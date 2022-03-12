import React, { useState, useEffect, useContext } from "react";
import { Progress, message, Upload, Modal, Tooltip } from "antd";
import {
    CopyOutlined,
    DownloadOutlined,
    DeleteOutlined,
    PlusOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { staticUrl } from "@/env_config";
import { IFileType, deleteFile } from "@/client/FileHelper";
import { handleSize, copyUrl } from '../utils';

interface PropsType {
    type: string; // 图片在该系统中的类型的类型
    fileId?: string; // 若有图片则有 id
    originalName?: string;
    fileName?: string;
    fileUrl: string; // 完整的 url 的路径，若为 '' 则该组件需提供上传，不为 '' 则提供大图或删除图片
    initFileList: Function; // 用于上传成功或删除后的图片列表初始化
    width?: string; // 可以传递宽高给组件
    isOnlyShow?: boolean; // 是否只查看，若是只查看则不给删除
    fileData: IFileType | {}; // 从接口拿的文件原始信息
    iconRender?: any; // 用于渲染在操作台上进行操作的 antd 的 icon
}

const FileBox: React.FC<PropsType> = (props) => {
    const {
        type,
        fileId,
        originalName,
        fileName,
        fileUrl,
        initFileList,
        width = "170px",
        isOnlyShow = false,
        fileData,
        iconRender,
    } = props;

    const { confirm } = Modal;

    const [isHover, setIsHover] = useState(false);

    // 下载文件
    const downloadFile = () => {
        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = originalName || "文件名";
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
            {/* 有文件路径的情况，展示文件名称 */}
            <div
                className={styles.content}
                onMouseEnter={(e) => {
                    e.stopPropagation();
                    setIsHover(true);
                }}
            >
                <div className={styles.filename}>{originalName}</div>
                <div className={styles.size}>
                    {handleSize(Number((fileData as IFileType).size || 0))}
                </div>
                <div className={styles.time}>
                    {(fileData as IFileType).cTime}
                </div>
            </div>
            {/* hover 显示操作 */}
            {isHover && (
                <div className={styles.Icons}>
                    <CopyOutlined
                        className={styles.iconBoxIcon}
                        title="复制文件链接"
                        onClick={copyUrl.bind(null, fileUrl)}
                    />
                    <DownloadOutlined
                        className={styles.iconBoxIcon}
                        title="下载文件"
                        onClick={downloadFile}
                    />
                    {!isOnlyShow && (
                        <DeleteOutlined
                            className={styles.iconBoxIcon}
                            title="删除文件"
                            onClick={deleteThisFile}
                        />
                    )}
                    <Tooltip
                        title={
                            <>
                                <div className={styles.name}>
                                    文件名称：
                                    {(fileData as IFileType).filename}
                                </div>
                                <div className={styles.size}>
                                    文件大小：
                                    {handleSize(
                                        Number(
                                            (fileData as IFileType).size || 0
                                        )
                                    )}
                                </div>
                                <div className={styles.time}>
                                    更新时间：{(fileData as IFileType).cTime}
                                </div>
                            </>
                        }
                        placement="bottom"
                    >
                        <InfoCircleOutlined
                            className={styles.iconBoxIcon}
                            title="图片详细信息"
                        />
                    </Tooltip>
                    {iconRender || <></>}
                </div>
            )}
        </div>
    );
};

export default FileBox;
