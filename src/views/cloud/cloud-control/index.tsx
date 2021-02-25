import React, { useState } from "react";
import styles from "./index.module.scss";
import ImgManage from "./img-manage";
import CloudStorage from "./cloud-storage";

// 云盘
const CloudControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("云盘");

  const handleChoiceTab = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className={`${styles.cloudControl} ScrollBar`}>
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
      <div className={styles.cloudContent}>
        {activeTab === "云盘" && <CloudStorage />}
        {activeTab === "图片管理" && <ImgManage />}
      </div>
    </div>
  );
};

export default CloudControl;
