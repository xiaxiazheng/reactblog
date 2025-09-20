import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import MaoDetail from "./mao-detail";
import { getMaoList, addMaoPu } from "@xiaxiazheng/blog-libs";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { Button, message, Switch, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CompareMao from "./compare-mao";
import { IMao } from "./types";
import ParentMao from "./parent-mao";
import ImgManage from "./mao-detail/mao-img-manage";

type ShowMaoType = "所有猫猫" | "分层猫猫" | "对比猫猫" | "关联猫猫";
const TypeList: ShowMaoType[] = [
    "所有猫猫",
    "关联猫猫",
    "分层猫猫",
    "对比猫猫",
];
const statusList = [
    "当前猫咪",
    "父母",
    "兄弟姐妹",
    "孩子",
    "持有",
    "已送走",
    "死亡",
];

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
        getMaoPuList();
    }, []);

    useDocumentTitle("猫谱");

    const [maoList, setMaoList] = useState<IMao[]>([]);
    const [activeMao, setActiveMao] = useState<IMao>();

    const [hoverMao, setHoverMao] = useState<IMao | null>(null);

    // 处理猫咪的父母层级
    const handleParent = (list: IMao[]) => {
        const map: any = {};
        list.forEach((item) => {
            map[item.mao_id] = item;
        });
        // 给孩子带上父母，给父母带上孩子
        list.forEach((item) => {
            if (item.father_id) {
                if (map[item.father_id].children) {
                    map[item.father_id].children.push(map[item.mao_id]);
                } else {
                    map[item.father_id].children = [map[item.mao_id]];
                }
                item.fatherObject = map[item.father_id];
            }
            if (item.mother_id) {
                if (map[item.mother_id].children) {
                    map[item.mother_id].children.push(map[item.mao_id]);
                } else {
                    map[item.mother_id].children = [map[item.mao_id]];
                }
                item.motherObject = map[item.mother_id];
            }
        });

        return list;
    };

    const getMaoPuList = async () => {
        const res = await getMaoList();
        if (res) {
            const list = res.map((item: IMao) => {
                return {
                    ...item,
                    key: item.mao_id,
                    title: item.name,
                };
            });
            setMaoList(handleParent(list));
        }
    };

    // 新增一只猫咪
    const newACat = async () => {
        const res = await addMaoPu({});
        if (res) {
            message.success("新增猫猫成功");
            // 打开新增的猫的编辑
            setActiveMao(res);
            getMaoPuList();
        }
    };

    const [showType, setShowType] = useState<ShowMaoType>("所有猫猫");

    // 展示猫的层级
    const renderLevelMao = (list: IMao[]) => {
        if (typeof list === "undefined") return null;

        return list.map((item) => {
            return (
                <div
                    key={item.mao_id}
                    className={item.children ? styles.box : ""}
                >
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

    const [keyword, setKeyword] = useState<string>();

    // 渲染单个猫咪的状态
    const renderSingleMao = (item: IMao) => {
        return (
            <div
                key={item.mao_id}
                className={`${styles.parent} ${
                    hoverMao && hoverMao.mao_id === item.mao_id
                        ? styles.hover
                        : ""
                } ${
                    hoverMao &&
                    hoverMao.mao_id !== item.mao_id &&
                    hoverMao.birthday.length === 10 &&
                    hoverMao.birthday === item.birthday
                        ? styles.hoverBroSis
                        : ""
                } ${
                    hoverMao &&
                    item.children &&
                    item.children.some(
                        (jtem) => jtem.mao_id === hoverMao.mao_id
                    )
                        ? styles.hoverChildren
                        : ""
                } ${
                    hoverMao &&
                    (item.mother_id === hoverMao.mao_id ||
                        item.father_id === hoverMao.mao_id)
                        ? styles.hoverParent
                        : ""
                } ${isShowStatus ? statusColor[item.status] : ""}
              `}
                onMouseEnter={(e) => {
                    e.stopPropagation();
                    !isShowStatus &&
                        (!hoverMao || hoverMao.mao_id !== item.mao_id) &&
                        setHoverMao(item);
                }}
                onClick={() => setActiveMao(item)}
            >
                <span>{item.name}</span>
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
                    <Button
                        className={styles.addButton}
                        type="primary"
                        onClick={newACat}
                    >
                        <PlusOutlined />
                        新增猫猫
                    </Button>
                    {/* 切换猫谱显示方式 */}
                    <div className={styles.switchShowType}>
                        {TypeList.map((item) => {
                            return (
                                <span
                                    key={item}
                                    className={
                                        showType === item ? styles.active : ""
                                    }
                                    onClick={() => setShowType(item)}
                                >
                                    {item}
                                </span>
                            );
                        })}
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
                                {maoList
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
                                maoList.filter(
                                    (item) =>
                                        item.father_id === "" &&
                                        item.mother_id === "" &&
                                        item.children
                                )
                            )}
                        </div>
                    )}
                    {/* 当前页面使用的颜色含义 */}
                    <div className={styles.colorCloud}>
                        {statusList.map((item) => (
                            <div key={item}>
                                <span className={styles.status} /> {item}
                            </div>
                        ))}
                    </div>
                    {/* 猫咪关联展示 */}
                    {showType === "关联猫猫" && (
                        <>
                            <Input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                style={{ width: 300 }}
                                allowClear
                            />
                            <div className={styles.maoList}>
                                {(keyword
                                    ? maoList.filter(
                                          (item) =>
                                              item.name.indexOf(keyword) !== -1
                                      )
                                    : maoList
                                )?.map((item) => {
                                    return renderSingleMao(item);
                                })}
                            </div>
                            {hoverMao && <ParentMao mao={hoverMao} />}
                        </>
                    )}
                    {/* 所有猫咪展示 */}
                    {showType === "所有猫猫" && (
                        <>
                            <Input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                style={{ width: 300 }}
                                allowClear
                            />
                            <div className={styles.maoList}>
                                {(keyword
                                    ? maoList.filter(
                                          (item) =>
                                              item.name.indexOf(keyword) !== -1
                                      )
                                    : maoList
                                )?.map((item) => (
                                    <span
                                        key={item.mao_id}
                                        className={styles.allMao}
                                        onMouseEnter={(e) => {
                                            e.stopPropagation();
                                            !isShowStatus &&
                                                (!hoverMao ||
                                                    hoverMao.mao_id !==
                                                        item.mao_id) &&
                                                setHoverMao(item);
                                        }}
                                        onClick={() => setActiveMao(item)}
                                    >
                                        {item.headImgList.length !== 0 && (
                                            <ImgManage
                                                type={"mao"}
                                                other_id={item.head_img_id}
                                                imageList={item.headImgList}
                                                initImgList={() => {}}
                                                isShowUpload={false}
                                                width={"100px"}
                                                margin={"5px"}
                                                style={{
                                                    margin: 0,
                                                    padding: 0,
                                                }}
                                            />
                                        )}
                                        <div>{item.name}</div>
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                    {/* 对比猫猫展示 */}
                    {showType === "对比猫猫" && (
                        <CompareMao
                            maoList={maoList}
                            setActiveMao={setActiveMao}
                        />
                    )}
                </div>
            )}
            {/* 单个猫猫信息的具体操作 */}
            {activeMao && (
                <MaoDetail
                    maoList={maoList}
                    mao={activeMao}
                    back={() => {
                        setActiveMao(undefined);
                        getMaoPuList();
                    }}
                    initFn={() => getMaoPuList()}
                />
            )}
        </div>
    );
};

export default MaoPu;
