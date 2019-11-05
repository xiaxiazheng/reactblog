import React, { useState, useEffect, useContext } from 'react';
import styles from './Home.module.scss';
import { Carousel } from 'antd';
import { getImgList } from '../../client/ImgHelper';
import { baseImgUrl } from '../../env_config';
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

const Home: React.FC = () => {
  const { theme } = useContext(ThemeContext);

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

  const className = classnames({
    [styles.Home]: true,
    [styles.lightHome]: theme === 'light'
  })

  return (
    <div className={className}>
      <Carousel className="carousel" autoplay>
        {homeData.imgList.map((item: ImgType) => {
          return (
            <img key={item.img_id} src={item.imgUrl} alt={item.imgname}/>
          )
        })}
      </Carousel>
      <footer className={styles.footerBeian}>
        <div style={{width: '300px',margin: '0 auto'}}>
          <a
            target="_blank"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602005623"
            style={{ display: 'inline-block', textDecoration: 'none', height: '20px', lineHeight:'20px' }}>
            <img src={require("../../assets/beian.png")} alt="备案"/>
            <span>粤公网安备 44010602005623号</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
