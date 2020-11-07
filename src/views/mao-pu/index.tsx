import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { IsLoginContext } from "@/context/IsLoginContext";
// import WallShower from './wall-shower';
import MaoControl, { Mao } from "./mao-control";
import { getMaoPuList, addMaoPu } from "@/client/MaoPuHelper";
import { Button, Icon, message } from "antd";

const MaoPu: React.FC = () => {
  // const { isLogin } = useContext(IsLoginContext);

  useEffect(() => {
    getMaoList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [maoList, setMaoList] = useState<Mao[]>([]);
  const [levelList, setLevelList] = useState<any[]>([]);
  const [activeMao, setActiveMao] = useState<any>();

  const [hoverMao, setHoverMao] = useState<Mao | null>(null);

  const handleParent = (list: Mao[]) => {
    const map: any = {};
    list.forEach((item) => {
      map[item.mao_id] = item;
    });
    list
      .sort(
        (a: any, b: any) =>
          new Date(a.birthday).getTime() - new Date(b.birthday).getTime()
      )
      .forEach((item) => {
        if (item.father_id) {
          if (map[item.father_id].children) {
            map[item.father_id].children.push(map[item.mao_id]);
          } else {
            map[item.father_id].children = [map[item.mao_id]];
          }
        }
        if (item.mother_id) {
          if (map[item.mother_id].children) {
            map[item.mother_id].children.push(map[item.mao_id]);
          } else {
            map[item.mother_id].children = [map[item.mao_id]];
          }
        }
      });

    return list;
  };

  const getMaoList = async () => {
    const res = await getMaoPuList();
    if (res) {
      const list: any = res.sort(
        (a: any, b: any) =>
          new Date(a.birthday).getTime() - new Date(b.birthday).getTime()
      );
      setMaoList(list);
      setLevelList(handleParent(list));
    }
  };

  const newACat = async () => {
    const res = await addMaoPu({});
    res && getMaoList();
    message.success("新增猫猫成功");
  };

  const [showType, setShowType] = useState<"所有猫猫" | "分层猫猫">("分层猫猫");

  // 展示猫的层级
  const renderLevelMao = (list: any[]) => {
    if (typeof list === "undefined") return null;

    return list.map((item) => {
      return (
        <div className={item.children ? styles.box : ""}>
          <div
            className={`${styles.parent} ${
              hoverMao && hoverMao.mao_id === item.mao_id ? styles.hover : ""
            } ${
              hoverMao &&
              hoverMao.mao_id !== item.mao_id &&
              hoverMao.birthday === item.birthday
                ? styles.hoverBroSis
                : ""
            }
            ${
              hoverMao &&
              item.children &&
              item.children.some((jtem: any) => jtem.mao_id === hoverMao.mao_id)
                ? styles.hoverParent
                : ""
            }
            `}
            onMouseEnter={(e) => {
              e.stopPropagation();
              (!hoverMao || hoverMao.mao_id !== item.mao_id) &&
                setHoverMao(item);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              hoverMao && hoverMao === item.mao_id && setHoverMao(null);
            }}
            onClick={() => setActiveMao(item)}
          >
            {item.name}
          </div>
          {item.children && (
            <div className={styles.children}>
              {renderLevelMao(item.children)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={styles.MaoPu}>
      {!activeMao && (
        <div className={`${styles.maopuWrapper} ScrollBar`}>
          {/* 新增按钮 */}
          <Button className={styles.addButton} type="primary" onClick={newACat}>
            <Icon type="plus" />
            新增猫猫
          </Button>
          <div className={styles.switchShowType}>
            {(["分层猫猫", "所有猫猫"] as ("所有猫猫" | "分层猫猫")[]).map(
              (item) => {
                return (
                  <span
                    className={showType === item ? styles.active : ""}
                    onClick={() => setShowType(item)}
                  >
                    {item}
                  </span>
                );
              }
            )}
          </div>
          {/* 层级猫咪展示 */}
          {showType === "分层猫猫" && (
            <div className={`${styles.levelMao}`}>
              {renderLevelMao(
                levelList.filter(
                  (item) => item.father_id === "" && item.mother_id === ""
                )
              )}
            </div>
          )}
          {/* 所有猫咪展示 */}
          {showType === "所有猫猫" && (
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
          )}
        </div>
      )}

      {activeMao && (
        <MaoControl
          maoList={maoList}
          mao={maoList.filter((item) => item.mao_id === activeMao.mao_id)[0]}
          back={() => setActiveMao(undefined)}
          initFn={() => getMaoList()}
        />
      )}
    </div>
  );
};

export default MaoPu;
