import React, { useState, useContext } from "react";
import { Progress, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { staticUrl } from "@/env_config";
import { UserContext } from "@/context/UserContext";
import styles from "./index.module.scss";
import { handleSize } from "../utils";

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
            refresh();
        }
        if (info.file.status === "error") {
            message.error("上传图片失败");
        }
    };

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
                    <>
                        <PlusOutlined className={styles.addIcon} />
                        点击上传图片/文件
                    </>
                )}
            </Upload>
        </div>
    );
};

export default FileUpload;
