import React, { useState } from "react";
import styles from "./index.module.scss";
import ImgManage from "./img-manage";
import ImgGallery from "./img-gallery";

// 图片墙
const WallControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("云盘");

  const handleChoiceTab = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className={`${styles.wallControl} ScrollBar`}>
      <div className={styles.tabs}>
        {["云盘", "图片管理"].map((item) => (
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
        {activeTab === "云盘" && <ImgGallery />}
        {activeTab === "图片管理" && <ImgManage />}
      </div>
    </div>
  );
};

export default WallControl;
