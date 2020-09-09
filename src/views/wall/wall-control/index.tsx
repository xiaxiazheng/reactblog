import React, { useState } from "react";
import styles from "./index.module.scss";
import ImgManage from "./img-manage";
import ImgGallery from "./img-gallery";

interface ImgType {
  cTime: string;
  filename: string;
  img_id: string;
  imgname: string;
  other_id: string;
  type: string;
  imageUrl: string;
  has_min: "0" | "1";
  imageMinUrl: string;
}

// 图片墙
const WallControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("图库");

  const handleChoiceTab = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className={`${styles.wallControl} ScrollBar`}>
      <div className={styles.tabs}>
        {["图库", "图片管理"].map((item) => (
          <span
            key={item}
            className={item === activeTab ? styles.active : ""}
            onClick={() => handleChoiceTab(item)}
          >
            {item}
          </span>
        ))}
      </div>
      <div className={styles.wallContent}>
        {activeTab === "图库" && <ImgGallery />}
        {activeTab === "图片管理" && <ImgManage />}
      </div>
    </div>
  );
};

export default WallControl;
