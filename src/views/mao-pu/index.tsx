import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { IsLoginContext } from "@/context/IsLoginContext";
// import WallShower from './wall-shower';
import MaoControl from "./mao-control";
import { getMaoPuList, addMaoPu } from "@/client/MaoPuHelper";
import { Button, Icon } from "antd";

const MaoPu: React.FC = () => {
  // const { isLogin } = useContext(IsLoginContext);

  useEffect(() => {
    getMaoList();
  }, []);

  const [maoList, setMaoList] = useState<any[]>([]);
  const [activeMao, setActiveMao] = useState<any>();

  const getMaoList = async () => {
    const res = await getMaoPuList();
    res && setMaoList(res);
  };

  const newACat = async () => {
    const res = await addMaoPu({});
    res && getMaoList();
  };

  return (
    <div className={styles.MaoPu}>
      {!activeMao && (
        <>
          {/* 新增按钮 */}
          <Button className={styles.addButton} type="primary" onClick={newACat}>
            <Icon type="plus" />
            新增猫猫
          </Button>
          <div className={styles.maoList}>
            {maoList.map((item) => {
              return (
                <div
                  className={styles.maoItem}
                  onClick={() => setActiveMao(item)}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeMao && (
        <MaoControl
          mao={maoList.filter((item) => item.mao_id === activeMao.mao_id)[0]}
          back={() => setActiveMao(undefined)}
          initFn={() => getMaoList()}
        />
      )}
    </div>
  );
};

export default MaoPu;
