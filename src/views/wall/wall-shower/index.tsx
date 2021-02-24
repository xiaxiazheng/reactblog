import React, { useState, useEffect, useContext } from 'react';
import styles from './index.module.scss';
import { IImageType, ImgType, getImgList } from '@/client/ImgHelper';
import { staticUrl } from '@/env_config';
import PreviewImage from '@/components/preview-image';
import MaskloadImage from '@/components/mask-load-image';
import Loading from '@/components/loading';
import { UserContext } from '@/context/UserContext';

const WallShower: React.FC = () => {
  const [wallList, setWallList] = useState<ImgType[]>([]);
  const [previewImg, setPreviewImg] = useState('');
  const [previewImgName, setPreviewImgName] = useState('');
  const [loading, setLoading] = useState(true);
  const { username } = useContext(UserContext)

  useEffect(() => {
    getWallImgList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);
  
  const getWallImgList = async () => {
    let imgList: any = [];
    setLoading(true);
    const res: IImageType[] = await getImgList('wall', username);
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
    <div className={styles.wallShower}>
      {/* 展示 */}
      <div className={styles.imgWrapper}>
        {wallList.map((item: ImgType) => {
          return (
            <div
              key={item.img_id}
              onClick={() => {
                setPreviewImg(item.imageUrl);
                setPreviewImgName(item.imgname);
              }}
            >
              <MaskloadImage
                imageName={item.imgname}
                imageUrl={item.imageMinUrl}
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
