import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { IImageType, ImgType, getImgList, getImgTypeList } from "@/client/ImgHelper";
import { staticUrl } from "@/env_config";
import ImageBox from "@/components/image-box";
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
  const [wallList, setWallList] = useState<ImgType[]>([]);
  const { username } = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImageTypeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType]);

  // 获取单个图片类型下的所有图片
  const getImageListByType = async (type: string) => {
    let imgList: any = [];
    setLoading(true);
    const res: IImageType[] = await getImgList(type, username);
    for (let item of res) {
      // 拼好 img 的 url
      imgList.push({
        ...item,
        imageUrl: `${staticUrl}/img/${item.type}/${item.filename}`,
        imageMinUrl:
          item.has_min === "1" ? `${staticUrl}/min-img/${item.filename}` : "",
      });
    }
    setWallList(imgList);
    setLoading(false);
  };

  return (
    <>
      <div className={styles.imgLength}>
        {!loading && <>共 {wallList.length} 张</>}
      </div>
      <Tabs className={styles.tabs} activeKey={activeType} onChange={(key) => setActiveType(key)}>
        {typeList.map((item) => {
          return (
            <TabPane tab={<span>{item}</span>} key={item}>
              {loading && <Loading />}
              <div className={styles.ImgManage}>
                {/* 图片管理中不允许添加图片，因为加了也没有关联，没用 */}
                {/* {activeType === "main" && (
                  <ImageBox
                    type={activeType}
                    imageUrl=""
                    imageMinUrl=""
                    initImgList={getImageListByType.bind(null, activeType)}
                  />
                )} */}
                {wallList.map((item: ImgType) => {
                  return (
                    <ImageBox
                      key={item.img_id}
                      type={item.type}
                      imageId={item.img_id}
                      imageName={`${item.imgname}${activeType === '所有' ? ' - ' + item.type : ''}`}
                      imageFileName={item.filename}
                      imageUrl={item.imageUrl}
                      imageMinUrl={item.imageMinUrl}
                      initImgList={getImageListByType.bind(null, activeType)}
                      imageData={item}
                    />
                  );
                })}
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
};

export default ImgManage;
