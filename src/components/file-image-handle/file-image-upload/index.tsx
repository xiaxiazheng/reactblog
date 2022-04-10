import React, { useState, useContext, useEffect } from "react";
import { Progress, message, Upload, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { staticUrl } from "@/env_config";
import { UserContext } from "@/context/UserContext";
import styles from "./index.module.scss";
import { handleSize } from "../utils";
import dayjs from "dayjs";

interface IProps {
    type: string; // 图片在该系统中的类型的类型
    refresh: Function; // 上传成功后会执行的刷新的函数
    other_id?: string; // 跟这个图片要插入的地方有关联的记录 id
    width?: string; // 可以传递宽高给组件
}

const FileUpload: React.FC<IProps> = (props) => {
    const { type, refresh, other_id = "", width = "170px" } = props;

    const { username } = useContext(UserContext);

    const beforeUpload = (info: any) => {
        setName(info.name);
        setPercent(0);
        setSize(info.size);

        return true; // 为 false 就不会上传
    };

    const [name, setName] = useState<string>();
    const [percent, setPercent] = useState<number>();
    const [size, setSize] = useState<number>();

    const handleChange = (info: any) => {
        // 上传中
        if (info.file.status === "uploading") {
            setPercent(info.file.percent);
        }
        // 上传成功触发
        if (info.file.status === "done") {
            message.success("上传图片成功");
            setName(undefined);
            console.log(1111);

            refresh();
        }
        if (info.file.status === "error") {
            message.error("上传图片失败");
        }
    };

    const handleCopy = async () => {
        const clipboardItems = await navigator.clipboard.read();
        let find = false;
        for (const clipboardItem of clipboardItems) {
            for (const fileType of clipboardItem.types) {
                if (!find && fileType.indexOf("image") !== -1) {
                    console.log("clipboardItem", clipboardItem);
                    find = true;
                    const blob = await clipboardItem.getType(fileType);
                    const file = new File(
                        [blob],
                        dayjs().format("YYYY-MM-DD hh:mm:ss") +
                            "." +
                            fileType.split("/").pop(),
                        {
                            type: blob.type,
                        }
                    );
                    handleUpload(file);
                }
            }
        }
        if (!find) {
            message.warning("请先截图，再粘贴");
        }
    };

    const [isUploading, setIsUploading] = useState<boolean>(false);
    const handleUpload = (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("other_id", other_id);
        formData.append("username", username);
        formData.append(type, file);

        fetch(`${staticUrl}/api/${type}_upload`, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((res) => {
                message.success(res.message);
                refresh();
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setIsUploading(false);
            });
    };

    // useEffect(() => {
    //     document.addEventListener("keydown", onKeyDown);
    //     return () => {
    //         document.removeEventListener("keydown", onKeyDown);
    //     };
    // }, []);

    // 键盘事件
    // const onKeyDown = (e: any) => {
    //     // 加上了 mac 的 command 按键的 metaKey 的兼容
    //     if (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) {
    //         e.preventDefault();
    //         setIsKeyDown(true);
    //     }
    // };

    return (
        <div
            className={styles.uploadWrapper}
            style={{
                width: `${width}`,
                height: `${width}`,
            }}
        >
            <Upload
                className={styles.upload}
                style={{
                    width: `${width}`,
                    height: `${width}`,
                }}
                name={type}
                showUploadList={false}
                action={`${staticUrl}/api/${type}_upload`}
                data={{
                    other_id,
                    username,
                }}
                beforeUpload={beforeUpload}
                listType="picture-card"
                onChange={handleChange}
            >
                {name ? (
                    <div className={styles.progress}>
                        <div className={styles.name}>{name}</div>
                        <div>{handleSize(size || 0)}</div>
                        <div>进度：{(percent || 0).toFixed(1)}%</div>
                        <Progress
                            strokeColor={{
                                from: "#108ee9",
                                to: "#87d068",
                            }}
                            percent={percent}
                            status="active"
                        />
                    </div>
                ) : (
                    <div className={styles.beforeUpload}>
                        <PlusOutlined className={styles.addIcon} />
                        点击上传图片/文件
                        <Button
                            className={styles.parseButton}
                            onClick={(e) => {
                                handleCopy();
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            loading={isUploading}
                        >
                            粘贴图片
                        </Button>
                    </div>
                )}
            </Upload>
        </div>
    );
};

export default FileUpload;
