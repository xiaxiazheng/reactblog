import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import ImgManage from "./mao-img-manage";
import { ImageType, getImgListByOtherId } from "@/client/ImgHelper";
import { UserContext } from "@/context/UserContext";
import { Input, Button, message, Select } from "antd";
import { LeftOutlined, SaveOutlined } from "@ant-design/icons";
import { updateMaoPu } from "@/client/MaoPuHelper";
import { IMao } from "../types";
import { useCtrlSHooks } from "@/hooks/useCtrlSHook";

const { Option } = Select;

const statusList = [
    { label: "持有", value: "hold" },
    { label: "已送走", value: "gone" },
    { label: "死亡", value: "dead" },
];

interface IMaoDetailProps {
    mao: IMao;
    back: Function;
    initFn: Function;
    maoList: IMao[];
}

const MaoDetail: React.FC<IMaoDetailProps> = (props) => {
    const { mao, back, initFn, maoList } = props;
    const { username } = useContext(UserContext);

    const { TextArea } = Input;

    const [isChange, setIsChange] = useState<boolean>(false);

    const [name, setName] = useState<string>(mao.name);
    const [birthday, setBirthday] = useState<string>(mao.birthday);
    const [status, setstatus] = useState<string>(mao.status);
    const [father, setFather] = useState<string>(mao.father);
    const [fatherId, setFatherId] = useState<string>(mao.father_id);
    const [mother, setMother] = useState<string>(mao.mother);
    const [motherId, setMotherId] = useState<string>(mao.mother_id);
    const [appearance, setAppearance] = useState<string>(mao.appearance);
    const [feature, setFeature] = useState<string>(mao.feature);
    const [description, setDescription] = useState<string>(mao.description);
    const [remarks, setRemarks] = useState<string>(mao.remarks);

    useEffect(() => {
        getHeadImgList();
        getOtherImgList();
    }, []);

    useCtrlSHooks(() => {
        saveMaoPu();
    });

    // 监听是否有修改
    useEffect(() => {
        let isChange = false;
        if (
            name !== mao.name ||
            birthday !== mao.birthday ||
            father !== mao.father ||
            mother !== mao.mother ||
            appearance !== mao.appearance ||
            feature !== mao.feature ||
            description !== mao.description ||
            fatherId !== mao.father_id ||
            motherId !== mao.mother_id ||
            status !== mao.status ||
            remarks !== mao.remarks
        ) {
            isChange = true;
        }
        setIsChange(isChange);
    }, [
        name,
        birthday,
        father,
        mother,
        appearance,
        feature,
        description,
        fatherId,
        motherId,
        status,
        remarks,
    ]);

    const [headList, setHeadList] = useState<ImageType[]>([]);
    const [imgList, setImgList] = useState<ImageType[]>([]);

    // 获取猫咪头像照片
    const getHeadImgList = async () => {
        const res: ImageType[] = await getImgListByOtherId(
            mao.head_img_id,
            username
        );
        setHeadList(res);
    };

    // 获取猫咪所有照片
    const getOtherImgList = async () => {
        let imgList: any = [];
        const res: ImageType[] = await getImgListByOtherId(
            mao.mao_id,
            username
        );
        setImgList(res);
    };

    // 保存当前猫猫的数据
    const saveMaoPu = async () => {
        const params = {
            mao_id: mao.mao_id,
            name,
            birthday,
            father,
            mother,
            appearance,
            feature,
            description,
            father_id: fatherId,
            mother_id: motherId,
            status,
            remarks,
        };
        const res = await updateMaoPu(params);
        if (res) {
            message.success("更新成功");
            setIsChange(false);
            initFn();
        } else {
            message.error("更新失败");
        }
    };

    return (
        <div className={`${styles.MaoDetail} ScrollBar`}>
            {/* 返回按钮 */}
            <Button
                className={styles.backButton}
                type="primary"
                onClick={() => back()}
            >
                <LeftOutlined type="left" />
                返回
            </Button>
            {/* 保存按钮 */}
            <Button
                className={styles.saveButton}
                type={"primary"}
                danger={isChange}
                onClick={saveMaoPu}
            >
                <SaveOutlined />
                保存
            </Button>
            {/* 猫咪基本信息 */}
            <div className={styles.maoData}>
                <h2>{mao.name}</h2>
                <div className={styles.boxWrapper}>
                    <div className={styles.box}>
                        <span>姓名：</span>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.box}>
                        <span>生日：</span>
                        <Input
                            value={birthday}
                            placeholder={
                                "尽量写10位日期如：2020-01-01，用于找兄弟姐妹"
                            }
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles.boxWrapper}>
                    <div className={styles.box}>
                        <span>父亲姓名：</span>
                        <Input
                            value={father}
                            onChange={(e) => setFather(e.target.value)}
                        />
                    </div>
                    <div className={styles.box}>
                        <span>父亲 ID：</span>
                        <Select
                            value={fatherId}
                            onChange={(id: any) => {
                                setFatherId(id || "");
                            }}
                            style={{ flex: 1 }}
                        >
                            <Option key={"无记录"} value={""}>
                                无记录
                            </Option>
                            {maoList
                                .filter((item) => item.mao_id !== mao.mao_id)
                                .map((item) => {
                                    return (
                                        <Option
                                            key={item.mao_id}
                                            value={item.mao_id}
                                        >
                                            {item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </div>
                </div>
                <div className={styles.boxWrapper}>
                    <div className={styles.box}>
                        <span>母亲姓名：</span>
                        <Input
                            value={mother}
                            onChange={(e) => setMother(e.target.value)}
                        />
                    </div>
                    <div className={styles.box}>
                        <span>母亲 ID：</span>
                        <Select
                            value={motherId}
                            onChange={(id: any) => {
                                setMotherId(id || "");
                            }}
                            style={{ flex: 1 }}
                        >
                            <Option key={"无记录"} value={""}>
                                无记录
                            </Option>
                            {maoList
                                .filter((item) => item.mao_id !== mao.mao_id)
                                .map((item) => {
                                    return (
                                        <Option
                                            key={item.mao_id}
                                            value={item.mao_id}
                                        >
                                            {item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </div>
                </div>
                <div className={styles.box}>
                    <span>状态：</span>
                    <Select
                        value={status}
                        onChange={(val: string) => setstatus(val)}
                        style={{ flex: 1 }}
                    >
                        {statusList.map((item) => {
                            return (
                                <Option key={item.value} value={item.value}>
                                    {item.label}
                                </Option>
                            );
                        })}
                    </Select>
                </div>
                <div className={styles.box}>
                    <span>外貌：</span>
                    <Input
                        value={appearance}
                        onChange={(e) => setAppearance(e.target.value)}
                    />
                </div>
                <div className={styles.box}>
                    <span>特点：</span>
                    <Input
                        value={feature}
                        onChange={(e) => setFeature(e.target.value)}
                    />
                </div>
                <div className={styles.box}>
                    <span>描述：</span>
                    <TextArea
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className={styles.box}>
                    <span>备注：</span>
                    {/* <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} /> */}
                    <TextArea
                        rows={2}
                        placeholder={"这个字段不会显示在小程序"}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.maoContent}>
                {/* 头像管理 */}
                <div>头像图片</div>
                <ImgManage
                    type={"mao"}
                    other_id={mao.head_img_id}
                    imageList={headList}
                    initImgList={getHeadImgList}
                    isShowUpload={headList.length === 0}
                />
                {/* 其他图片管理 */}
                <div>其他图片</div>
                <ImgManage
                    type={"mao"}
                    other_id={mao.mao_id}
                    imageList={imgList}
                    initImgList={getOtherImgList}
                />
            </div>
        </div>
    );
};

export default MaoDetail;
