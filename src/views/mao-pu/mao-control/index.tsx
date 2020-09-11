import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import ImgManage from "./mao-img-manage";
import { getImgListByOtherId } from "@/client/ImgHelper";
import { UserContext } from "@/context/UserContext";
import { staticUrl } from "@/env_config";

interface ImgType {
  cTime: string;
  filename: string;
  img_id: string;
  imgname: string;
  other_id: string;
  type: string;
  imageUrl: string;
  has_min: "0" | "1";
  imageMinUrl: string;
}

interface Mao {
  appearance: string;
  birthday: string;
  description: string;
  father: string;
  feature: string;
  head_img_id: string;
  mao_id: string;
  mother: string;
  name: string;
}

interface IMaoControlProps {
  mao: Mao;
}

// 图片墙
const MaoControl: React.FC<IMaoControlProps> = (props) => {
  const { mao } = props;
  const { username } = useContext(UserContext);

  useEffect(() => {
    console.log(mao);
    getHeadImgList();
    getOtherImgList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [headList, setHeadList] = useState<ImgType[]>([]);
  const [imgList, setImgList] = useState<ImgType[]>([]);

  const getHeadImgList = async () => {
    let imgList: any = [];
    const res: ImgType[] = await getImgListByOtherId(mao.head_img_id, username);
    for (let item of res) {
      // 拼好 img 的 url
      imgList.push({
        ...item,
        imageUrl: `${staticUrl}/img/mao/${item.filename}`, // 图片地址
        imageMinUrl:
          item.has_min === "1" ? `${staticUrl}/min-img/${item.filename}` : "", // 缩略图地址
      });
    }
    setHeadList(imgList);
  };

  const getOtherImgList = async () => {
    let imgList: any = [];
    const res: ImgType[] = await getImgListByOtherId(mao.mao_id, username);
    for (let item of res) {
      // 拼好 img 的 url
      imgList.push({
        ...item,
        imageUrl: `${staticUrl}/img/mao/${item.filename}`, // 图片地址
        imageMinUrl:
          item.has_min === "1" ? `${staticUrl}/min-img/${item.filename}` : "", // 缩略图地址
      });
    }
    setImgList(imgList);
  };

  return (
    <div className={`${styles.maoControl} ScrollBar`}>
      <div className={styles.maoData}>
        <div>{mao.birthday}</div>
        <div>{mao.description}</div>
        <div>{mao.father}</div>
        <div>{mao.appearance}</div>
        <div>{mao.feature}</div>
        <div>{mao.head_img_id}</div>
        <div>{mao.mao_id}</div>
        <div>{mao.mother}</div>
        <div>{mao.name}</div>
      </div>
      <div className={styles.maoContent}>
        {/* 头像管理 */}
        <div>头像图片</div>
        <ImgManage 
          type={'mao'}
          other_id={mao.head_img_id}
          imgList={headList}
          initImgList={getHeadImgList}
        />
        {/* 其他图片管理 */}
        <div>其他图片</div>
        <ImgManage
          type={'mao'}
          other_id={mao.mao_id}
          imgList={imgList}
          initImgList={getOtherImgList}
        />
      </div>
    </div>
  );
};

export default MaoControl;
