import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { ImageType, getImgList, getImgTypeList } from "@/client/ImgHelper";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import Loading from "@/components/loading";
import { UserContext } from "@/context/UserContext";
import { Tabs } from "antd";

// 图片管理
const ImgManage: React.FC = () => {
    const { TabPane } = Tabs;

    // 图片类型数组
    const [typeList, setTypeList] = useState<string[]>([]);
    // 当前选择类型
    const [activeType, setActiveType] = useState<string>("");

    // 图片数组
    const [cloudList, setCloudList] = useState<ImageType[]>([]);
    const { username } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getImageTypeList();
    }, []);

    // 获取所有图片类型
    const getImageTypeList = async () => {
        const res = await getImgTypeList(username);
        if (res) {
            setTypeList(["所有", ...res]);
            res.length !== 0 && setActiveType("所有");
        }
    };

    useEffect(() => {
        if (activeType !== "") {
            getImageListByType(activeType);
        }
    }, [activeType]);

    // 获取单个图片类型下的所有图片
    const getImageListByType = async (type: string) => {
        setLoading(true);
        const res: ImageType[] = await getImgList(type, username);
        setCloudList(res);
        setLoading(false);
    };

    return (
        <>
            <div className={styles.imgLength}>
                {!loading && <>共 {cloudList.length} 张</>}
            </div>
            <Tabs
                className={styles.tabs}
                activeKey={activeType}
                onChange={(key) => setActiveType(key)}
            >
                {typeList.map((item) => {
                    return (
                        <TabPane tab={<span>{item}</span>} key={item}>
                            {loading && <Loading />}
                            <div className={styles.ImgManage}>
                                <ImageListBox
                                    type={item}
                                    imageList={cloudList}
                                    refresh={getImageListByType.bind(
                                        null,
                                        activeType
                                    )}
                                />
                            </div>
                        </TabPane>
                    );
                })}
            </Tabs>
        </>
    );
};

export default ImgManage;
