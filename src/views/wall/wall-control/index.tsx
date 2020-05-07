import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { getImgList } from '@/client/ImgHelper';
import { staticUrl } from '@/env_config';
import ImageBox from '@/components/image-box';
import Loading from '@/components/loading';

interface ImgType {
  cTime: string;
  filename: string;
  img_id: string;
  imgname: string;
  other_id: string;
  type: string;
  imageUrl: string;
  has_min: '0' | '1';
  imageMinUrl: string;
};

const WallControl: React.FC = () => {
  const [wallList, setWallList] = useState<ImgType[]>([])

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWallImageList();
  }, []);

  const getWallImageList = async () => {
    let imgList: any = [];
    setLoading(true);
    const res: ImgType[] = await getImgList('wall');
    for (let item of res) {
      // 拼好 img 的 url
      imgList.push({
        ...item,
        imageUrl: `${staticUrl}/img/wall/${item.filename}`,
        imageMinUrl: item.has_min === '1' ? `${staticUrl}/min-img/${item.filename}` : ''
      });
    }
    setWallList(imgList);
    setLoading(false);
  };
  
  return loading ? <Loading width={300} /> : (
    <div className={styles.wallControl}>
      {wallList.map((item: ImgType) => {
        return (
          <ImageBox
            key={item.img_id}
            type="wall"
            imageId={item.img_id}
            imageName={item.imgname}
            imageFileName={item.filename}
            imageUrl={item.imageUrl}
            imageMinUrl={item.imageMinUrl}
            initImgList={getWallImageList}
          />
        )
      })}
      <ImageBox type="wall" imageUrl="" imageMinUrl="" initImgList={getWallImageList}/>
    </div>
  );
}

export default WallControl;
