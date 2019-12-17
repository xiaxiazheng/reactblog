import React, { useState, useEffect, useContext } from 'react';
import styles from './WallShower.module.scss';
import { getImgList } from '@/client/ImgHelper';
import { baseUrl } from '@/env_config';
import PreviewImage from '@/components/preview-image/PreviewImage';
import LazyloadImage from '@/components/lazyload-image/LazyloadImage';

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
        imgUrl: `${baseUrl}/wall/${item.filename}`
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
            <div
              key={item.img_id}
              onClick={() => {
                setPreviewImg(item.imgUrl);
                setPreviewImgName(item.imgname);
              }}
            >
              <LazyloadImage
                imageName={item.imgname}
                imageUrl={item.imgUrl}
              />              
            </div>
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
