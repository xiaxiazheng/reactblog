import React, { useState, useEffect, useContext } from 'react';
import styles from './WallShower.module.scss';
import { getImgList } from '../../client/ImgHelper';
import { baseImgUrl } from '../../env_config';
import PreviewImage from '../../components/preview-image/PreviewImage';

interface ImgType {
  cTime: string;
  filename: string;
  img_id: string;
  imgname: string;
  other_id: string;
  type: string;
  imgUrl: string;
};

const WallShower: React.FC = () => {
  const [wallList, setWallList] = useState<ImgType[]>([]);
  const [previewImg, setPreviewImg] = useState('');
  const [previewImgName, setPreviewImgName] = useState('');

  useEffect(() => {
    getWallImgList();
  }, []);
  
  const getWallImgList = async () => {
    let imgList: any = [];
    const res: ImgType[] = await getImgList('wall');
    for (let item of res) {
      // 拼好 img 的 url
      imgList.push({
        ...item,
        imgUrl: `${baseImgUrl}/wall/${item.filename}`
      });
    }
    setWallList(imgList);
  };

  return (
    <div className={styles.wallShower}>
      {/* 展示 */}
      <div className={styles.imgWrapper}>
        {wallList.map((item: ImgType) => {
          return (
            <img
              key={item.img_id}
              src={item.imgUrl}
              alt={item.imgname}
              onClick={() => {
                setPreviewImg(item.imgUrl);
                setPreviewImgName(item.imgname);
              }}
            />
          )
        })}
      </div>
      {/* 图片预览 */}
      <PreviewImage
        isPreview={previewImg !== ''}
        imageName={previewImgName}
        imageUrl={previewImg}
        closePreview={() => {
          setPreviewImg('');
          setPreviewImgName('');
        }}
      />
    </div>
  );
}

export default WallShower;
