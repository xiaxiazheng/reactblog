import React, { useState, useEffect, useContext } from 'react';
import styles from './index.module.scss';
import { IImageType, ImgType, getImgList } from '@/client/ImgHelper';
import { staticUrl } from '@/env_config';
import PreviewImage from '@/components/preview-image';
import MaskloadImage from '@/components/mask-load-image';
import Loading from '@/components/loading';
import { UserContext } from '@/context/UserContext';

// 暂时弃用，云盘不对游客开放，而且这里目前只展示了图片，没有文件
const CloudShower: React.FC = () => {
  const [imgList, setImgList] = useState<ImgType[]>([]);
  const [previewImg, setPreviewImg] = useState('');
  const [previewImgName, setPreviewImgName] = useState('');
  const [loading, setLoading] = useState(true);
  const { username } = useContext(UserContext)

  useEffect(() => {
    getCloudImgList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);
  
  const getCloudImgList = async () => {
    let imgList: any = [];
    setLoading(true);
    const res: IImageType[] = await getImgList('cloud', username);
    for (let item of res) {
      // 拼好 img 的 url
      imgList.push({
        ...item,
        imageUrl: `${staticUrl}/img/cloud/${item.filename}`,
        imageMinUrl: item.has_min === '1' ? `${staticUrl}/min-img/${item.filename}` : ''
      });
    }
    setImgList(imgList);
    setLoading(false);
  };

  return loading ? <Loading width={300} /> : (
    <div className={styles.cloudShower}>
      {/* 展示 */}
      <div className={styles.imgWrapper}>
        {imgList.map((item: ImgType) => {
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

export default CloudShower;
