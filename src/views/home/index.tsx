import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { getImgList } from "@/client/ImgHelper";
import { staticUrl } from "@/env_config";
import classnames from "classnames";
import { UserContext } from '@/context/UserContext';

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
}

const Home: React.FC = () => {
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const { username } = useContext(UserContext)

  useEffect(() => {
    let imgList: any = [];
    const getData = async () => {
      const res: ImgType[] = await getImgList("main", username);
      for (let item of res) {
        // 拼好 img 的 url
        imgList.push({
          ...item,
          imageUrl: `${staticUrl}/img/main/${item.filename}`,
          imageMinUrl: item.has_min === '1' ? `${staticUrl}/min-img/${item.filename}` : ''
        });
      }
      imgList[0] && setBackgroundUrl(imgList[0].imageUrl);
    };

    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const homgClass = classnames({
    [styles.Home]: true,
    ScrollBar: true
  });

  return (
    <div
      className={homgClass}
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <footer className={styles.footerBeian}>
        <div>
          <a
            target="_blank"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602005623"
            style={{
              display: "inline-block",
              textDecoration: "none",
              height: "20px",
              lineHeight: "20px"
            }}
          >
            <img src={require("@/assets/beian.png")} alt="备案" />
            <span>粤公网安备 44010602005623号</span>
          </a>
          <a
            href="http://www.beian.miit.gov.cn"
            target="_blank"
            style={{
              display: "inline-block",
              textDecoration: "none",
              height: "20px",
              lineHeight: "20px"
            }}
          >
            <span>粤ICP备18097682号</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
