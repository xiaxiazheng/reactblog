import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import MaoControl, { Mao } from "./mao-control";
import { getMaoPuList, addMaoPu } from "@/client/MaoPuHelper";
import { Button, Icon, message, Switch } from "antd";

const statusColor: any = {
  // 持有
  hold: styles.hold,
  // 已送走
  gone: styles.gone,
  // 死亡
  dead: styles.dead,
};

const MaoPu: React.FC = () => {
  useEffect(() => {
    getMaoList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [maoList, setMaoList] = useState<Mao[]>([]);
  const [levelList, setLevelList] = useState<any[]>([]);
  const [activeMao, setActiveMao] = useState<any>();

  const [hoverMao, setHoverMao] = useState<Mao | null>(null);

  // 处理猫咪的父母层级
  const handleParent = (list: Mao[]) => {
    const map: any = {};
    list.forEach((item) => {
      map[item.mao_id] = item;
    });
    list.forEach((item) => {
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

  // 新增一只猫咪
  const newACat = async () => {
    const res = await addMaoPu({});
    if (res) {
      message.success("新增猫猫成功");
      // 打开新增的猫的编辑
      setActiveMao(res)
      getMaoList()
    }
  };

  const [showType, setShowType] = useState<"所有猫猫" | "分层猫猫">("分层猫猫");

  // 展示猫的层级
  const renderLevelMao = (list: Mao[]) => {
    if (typeof list === "undefined") return null;

    return list.map((item) => {
      return (
        <div key={item.mao_id} className={item.children ? styles.box : ""}>
          {renderSingleMao(item)}
          {item.children && (
            <div className={styles.children}>
              {renderLevelMao(item.children)}
            </div>
          )}
        </div>
      );
    });
  };

  // 渲染单个猫咪的状态
  const renderSingleMao = (item: Mao) => {
    return (
      <div
        className={`${styles.parent} ${
          hoverMao && hoverMao.mao_id === item.mao_id ? styles.hover : ""
        } ${
          hoverMao &&
          hoverMao.mao_id !== item.mao_id &&
          hoverMao.birthday.length === 10 &&
          hoverMao.birthday === item.birthday
            ? styles.hoverBroSis
            : ""
        }
        ${
          hoverMao &&
          item.children &&
          item.children.some((jtem) => jtem.mao_id === hoverMao.mao_id)
            ? styles.hoverChildren
            : ""
        }
        ${
          hoverMao &&
          (item.mother_id === hoverMao.mao_id ||
            item.father_id === hoverMao.mao_id)
            ? styles.hoverParent
            : ""
        }
        ${isShowStatus ? statusColor[item.status] : ""}
        `}
        onMouseEnter={(e) => {
          e.stopPropagation();
          !isShowStatus &&
            (!hoverMao || hoverMao.mao_id !== item.mao_id) &&
            setHoverMao(item);
        }}
        // 发现不移除hover也挺好的哈哈哈
        // onMouseLeave={(e) => {
        //   e.stopPropagation();
        //   !isShowStatus &&
        //     hoverMao &&
        //     hoverMao.mao_id === item.mao_id &&
        //     setHoverMao(null);
        // }}
        onClick={() => setActiveMao(item)}
      >
        {item.name}
      </div>
    );
  };

  // 显示猫咪当前状态
  const [isShowStatus, setIsShowStatus] = useState<boolean>(false);
  const showMaoStatus = (bool: boolean) => {
    setIsShowStatus(bool);
    setHoverMao(null);
  };

  return (
    <div className={styles.MaoPu}>
      {/* 展示所有猫猫及之间的联系 */}
      {!activeMao && (
        <div className={`${styles.maopuWrapper} ScrollBar`}>
          {/* 新增按钮 */}
          <Button className={styles.addButton} type="primary" onClick={newACat}>
            <Icon type="plus" />
            新增猫猫
          </Button>
          {/* 切换猫谱显示方式 */}
          <div className={styles.switchShowType}>
            {(["分层猫猫", "所有猫猫"] as ("所有猫猫" | "分层猫猫")[]).map(
              (item) => {
                return (
                  <span
                    key={item}
                    className={showType === item ? styles.active : ""}
                    onClick={() => setShowType(item)}
                  >
                    {item}
                  </span>
                );
              }
            )}
          </div>
          {/* 是否显示猫猫状态 */}
          <div className={styles.showMaoStatus}>
            <Switch
              checkedChildren="显示猫咪状态"
              unCheckedChildren="显示猫咪状态"
              defaultChecked
              checked={isShowStatus}
              onChange={(bool) => showMaoStatus(bool)}
            />
          </div>
          {/* 层级猫咪展示 */}
          {showType === "分层猫猫" && (
            <div className={`${styles.levelMao}`}>
              {/* 双亲未知且没有孩子的单独渲染一列 */}
              <div className={styles.singleMao}>
                {levelList
                  .filter(
                    (item) =>
                      item.father_id === "" &&
                      item.mother_id === "" &&
                      !item.children
                  )
                  .map((item) => {
                    return renderSingleMao(item);
                  })}
              </div>
              {/* 双亲未知但有孩子的渲染成层级结构 */}
              {renderLevelMao(
                levelList.filter(
                  (item) =>
                    item.father_id === "" &&
                    item.mother_id === "" &&
                    item.children
                )
              )}
            </div>
          )}
          {/* 当前页面使用的颜色含义 */}
          <div className={styles.colorWall}>
            {[
              "当前猫咪",
              "父母",
              "兄弟姐妹",
              "孩子",
              "持有",
              "已送走",
              "死亡",
            ].map((item) => (
              <div>
                <span className={styles.dot} /> {item}
              </div>
            ))}
          </div>
          {/* 所有猫咪展示 */}
          {showType === "所有猫猫" && (
            <div className={styles.maoList}>
              {levelList.map((item) => {
                return renderSingleMao(item);
              })}
            </div>
          )}
        </div>
      )}
      {/* 单个猫猫信息的具体操作 */}
      {activeMao && (
        <MaoControl
          maoList={maoList}
          mao={activeMao}
          back={() => setActiveMao(undefined)}
          initFn={() => getMaoList()}
        />
      )}
    </div>
  );
};

export default MaoPu;
