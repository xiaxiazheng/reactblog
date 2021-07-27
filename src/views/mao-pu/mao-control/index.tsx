import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import ImgManage from "./mao-img-manage";
import { IImageType, ImgType, getImgListByOtherId } from "@/client/ImgHelper";
import { UserContext } from "@/context/UserContext";
import { staticUrl } from "@/env_config";
import { Input, Button, message, Select } from "antd";
import { LeftOutlined, SaveOutlined } from "@ant-design/icons";
import { updateMaoPu } from "@/client/MaoPuHelper";

const { Option } = Select;

const statusList = [
  { label: "持有", value: "hold" },
  { label: "已送走", value: "gone" },
  { label: "死亡", value: "dead" },
];

export interface Mao {
  appearance: string;
  birthday: string;
  description: string;
  father: string;
  feature: string;
  head_img_id: string;
  mao_id: string;
  mother: string;
  name: string;
  mother_id: string;
  father_id: string;
  status: string;
  remarks: string
  children?: Mao[];
}

interface IMaoControlProps {
  mao: Mao;
  back: Function;
  initFn: Function;
  maoList: Mao[];
}

// 图片墙
const MaoControl: React.FC<IMaoControlProps> = (props) => {
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
  const [remarks, setRemarks] = useState<string>(mao.remarks)

  useEffect(() => {
    getHeadImgList();
    getOtherImgList();

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 判断是否用 ctrl + s 保存修改，直接在 onKeyDown 运行 saveEditLog() 的话只会用初始值去发请求（addEventListener）绑的太死 */
  const [isKeyDown, setIsKeyDown] = useState(false);
  useEffect(() => {
    if (isKeyDown) {
      saveMaoPu();
      setIsKeyDown(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeyDown]);

  // 键盘事件
  const onKeyDown = (e: any) => {
    if (e.keyCode === 83 && e.ctrlKey) {
      e.preventDefault();
      setIsKeyDown(true);
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    remarks
  ]);

  const [headList, setHeadList] = useState<ImgType[]>([]);
  const [imgList, setImgList] = useState<ImgType[]>([]);

  // 获取猫咪头像照片
  const getHeadImgList = async () => {
    let imgList: any = [];
    const res: IImageType[] = await getImgListByOtherId(mao.head_img_id, username);
    for (let item of res) {
      // 拼好 img 的 url
      imgList.push({
        ...item,
        imageUrl: `${staticUrl}/img/mao/${item.filename}`, // 图片地址
        imageMinUrl:
          item.has_min === "1" ? `${staticUrl}/min-img/${item.filename}` : "", // 缩略图地址
      });
    }
    setHeadList(imgList);
  };

  // 获取猫咪所有照片
  const getOtherImgList = async () => {
    let imgList: any = [];
    const res: IImageType[] = await getImgListByOtherId(mao.mao_id, username);
    for (let item of res) {
      // 拼好 img 的 url
      imgList.push({
        ...item,
        imageUrl: `${staticUrl}/img/mao/${item.filename}`, // 图片地址
        imageMinUrl:
          item.has_min === "1" ? `${staticUrl}/min-img/${item.filename}` : "", // 缩略图地址
      });
    }
    setImgList(imgList);
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
      remarks
    };
    const res = await updateMaoPu(params);
    if (res) {
      message.success("更新成功");
      setIsChange(false);
      initFn();
    } else {
      message.error("更新成功");
    }
  };

  return (
    <div className={`${styles.maoControl} ScrollBar`}>
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
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className={styles.box}>
            <span>生日：</span>
            <Input
              value={birthday}
              placeholder={"尽量写10位日期如：2020-01-01，用于找兄弟姐妹"}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.boxWrapper}>
          <div className={styles.box}>
            <span>父亲姓名：</span>
            <Input value={father} onChange={(e) => setFather(e.target.value)} />
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
                    <Option key={item.mao_id} value={item.mao_id}>
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
            <Input value={mother} onChange={(e) => setMother(e.target.value)} />
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
                    <Option key={item.mao_id} value={item.mao_id}>
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
          <Input value={feature} onChange={(e) => setFeature(e.target.value)} />
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
            placeholder={'这个字段不会显示在小程序'} 
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
          imgList={headList}
          initImgList={getHeadImgList}
        />
        {/* 其他图片管理 */}
        <div>其他图片</div>
        <ImgManage
          type={"mao"}
          other_id={mao.mao_id}
          imgList={imgList}
          initImgList={getOtherImgList}
        />
      </div>
    </div>
  );
};

export default MaoControl;
