import React, { useState, useEffect, useContext } from 'react';
import { getImgList } from '../../client/ImgHelper';
import { baseImgUrl } from '../../env_config';
import ImageBox from '../../components/image-box/ImageBox';
import styles from './Admin.module.scss';
import { ThemeContext } from '../../context/ThemeContext';
import classnames from 'classnames';

interface ImgType {
  cTime: string;
  filename: string;
  img_id: string;
  imgname: string;
  other_id: string;
  type: string;
  imgUrl?: string;
};

const Admin: React.FC = () => {
  const { theme } = useContext(ThemeContext);

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
        imgUrl: `${baseImgUrl}/main/${item.filename}`
      });
    }
    setAdminImgList(imgList);
  };

  const className = classnames({
    [styles.Admin]: true,
    [styles.lightAdmin]: theme === 'light'
  })
  
  return (
    <div className={className}>
      {AdminImgList.map((item: ImgType) => {
        return (
          <ImageBox
            key={item.img_id}
            type="main"
            imageId={item.img_id}
            imageName={item.imgname}
            imageFileName={item.filename}
            imageUrl={`${baseImgUrl}/main/${item.filename}`}
            initImgList={getImageList}
          />
        )
      })}
      <ImageBox type="main" imageUrl="" initImgList={getImageList}/>
    </div>
  );
};

export default Admin;