import React, { useState, useEffect } from 'react';
import './Home.scss';
import { Carousel } from 'antd';
import { getImgList } from '../../client/ImgHelper';
import { baseImgUrl } from '../../config';

const Home: React.FC = () => {
  const [homeData, setHomeData] = useState({ list: [] });
  
  useEffect(() => {
    let list: any = [];
    const getData = async () => {
      const res = await getImgList('main');
      for (let item of res) {
        list.push(`${baseImgUrl}/main/${item.filename}`);
      }
      setHomeData({ list });
    };

    getData();
  }, []);

  return (
    <div className="Home">
      <Carousel autoplay>
        {homeData.list.map((item) => {
          return (
            <img key={item} src={item} alt={item}/>
          )
        })}
      </Carousel>
    </div>
  );
}

export default Home;
