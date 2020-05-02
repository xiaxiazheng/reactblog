import React, { useState, useEffect } from 'react';
import { getImgList } from '@/client/ImgHelper';
import { baseUrl } from '@/env_config';
import ImageBox from '@/components/image-box';
import styles from './index.module.scss';

interface ImgType {
  cTime: string;
  filename: string;
  img_id: string;
  imgname: string;
  other_id: string;
  type: string;
  has_min: '0' | '1';
  imageMinUrl: string;
  imageUrl: string;
};

const Admin: React.FC = () => {

  const [AdminImgList, setAdminImgList] = useState<ImgType[]>([])

  useEffect(() => {
    getImageList();
  }, []);

  const getImageList = async () => {
    let imgList: any = [];
    const res: ImgType[] = await getImgList('main');
    for (let item of res) {
      // 拼好 img 的 url
      imgList.push({
        ...item,
        imageUrl: `${baseUrl}/img/main/${item.filename}`, // 图片地址
        imageMinUrl: item.has_min === '1' ? `${baseUrl}/min-img/${item.filename}` : '' // 缩略图地址
      });
    }
    console.log('imgList', imgList);
    
    setAdminImgList(imgList);
  };
  
  return (
    <div className={styles.Admin}>
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
          />
        )
      })}
      <ImageBox type="main" imageUrl="" imageMinUrl="" initImgList={getImageList}/>
    </div>
  );
};

export default Admin;