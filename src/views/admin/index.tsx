import React, { useState, useEffect, useContext } from "react";
import { IImageType, ImgType, getImgList } from "@/client/ImgHelper";
import { staticUrl } from "@/env_config";
import ImageBox from "@/components/image-box";
import styles from "./index.module.scss";
import { UserContext } from "@/context/UserContext";

const Admin: React.FC = () => {
  const [AdminImgList, setAdminImgList] = useState<ImgType[]>([]);
  const { username } = useContext(UserContext);

  useEffect(() => {
    getImageList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getImageList = async () => {
    let imgList: any = [];
    const res: IImageType[] = await getImgList("main", username);
    for (let item of res) {
      // 拼好 img 的 url
      imgList.push({
        ...item,
        imageUrl: `${staticUrl}/img/main/${item.filename}`, // 图片地址
        imageMinUrl:
          item.has_min === "1" ? `${staticUrl}/min-img/${item.filename}` : "", // 缩略图地址
      });
    }
    // console.log('imgList', imgList);

    setAdminImgList(imgList);
  };

  return (
    <div className={styles.Admin}>
      <ImageBox
        type="main"
        imageUrl=""
        imageMinUrl=""
        initImgList={getImageList}
        imageData={{}}
      />
      {AdminImgList.map((item: ImgType) => {
        return (
          <ImageBox
            key={item.img_id}
            type="main"
            imageId={item.img_id}
            imageName={item.imgname}
            imageFileName={item.filename}
            imageUrl={item.imageUrl}
            imageMinUrl={item.imageMinUrl}
            initImgList={getImageList}
            imageData={item}
          />
        );
      })}
    </div>
  );
};

const AdminBox: React.FC = () => {
  return (
    <div>
      <Admin />
    </div>
  );
};

export default AdminBox;
