import React, { useState, useEffect } from 'react';
import './Home.scss';
import { Carousel } from 'antd';
import { getImgList } from '../../client/ImgHelper';
import { baseImgUrl } from '../../env_config';

interface ImgType {
  cTime: string;
  filename: string;
  img_id: string;
  imgname: string;
  other_id: string;
  type: string;
  imgUrl?: string;
};

const Home: React.FC = () => {
  const [homeData, setHomeData] = useState({ imgList: [] });

  useEffect(() => {
    let imgList: any = [];
    const getData = async () => {
      const res: ImgType[] = await getImgList('main');
      for (let item of res) {
        // 拼好 img 的 url
        imgList.push({
          ...item,
          imgUrl: `${baseImgUrl}/main/${item.filename}`
        });
      }
      setHomeData({ imgList });
    };

    getData();
  }, []);

  return (
    <div className="Home">
      <Carousel autoplay>
        {homeData.imgList.map((item: ImgType) => {
          return (
            <img key={item.img_id} src={item.imgUrl} alt={item.imgname}/>
          )
        })}
      </Carousel>
    </div>
  );
}

export default Home;
