import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { IsLoginContext } from "@/context/IsLoginContext";
// import WallShower from './wall-shower';
import MaoControl from "./mao-control";
import { getMaoPuList } from "@/client/MaoPuHelper";

const MaoPu: React.FC = () => {
  const { isLogin } = useContext(IsLoginContext);

  useEffect(() => {
    getMaoList();
  }, []);

  const [maoList, setMaoList] = useState<any[]>([]);
  const [activeMao, setActiveMao] = useState<any>();

  const getMaoList = async () => {
    const res = await getMaoPuList();
    res && setMaoList(res);
  };

  return (
    <div className={styles.MaoPu}>
      {!activeMao &&
        maoList.map((item) => {
          return (
            <div className={styles.maoList} onClick={() => setActiveMao(item)}>
              {item.name}
            </div>
          );
        })}
      {activeMao && <MaoControl mao={activeMao} />}
    </div>
  );
};

export default MaoPu;
