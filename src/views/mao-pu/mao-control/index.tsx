import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import ImgManage from "./mao-img-manage";
import { getImgListByOtherId } from "@/client/ImgHelper";
import { UserContext } from "@/context/UserContext";
import { staticUrl } from "@/env_config";
import { Input, Button, Icon, message, Select } from "antd";
import { updateMaoPu } from "@/client/MaoPuHelper";

const { Option } = Select;

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

export interface Mao {
  appearance: string
  birthday:  string
  description: string
  father: string
  feature: string
  head_img_id: string
  mao_id: string
  mother: string
  name: string
  mother_id: string
  father_id: string
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
  const [father, setFather] = useState<string>(mao.father);
  const [fatherId, setFatherId] = useState<string>(mao.father_id)
  const [mother, setMother] = useState<string>(mao.mother);
  const [motherId, setMotherId] = useState<string>(mao.mother_id)
  const [appearance, setAppearance] = useState<string>(mao.appearance);
  const [feature, setFeature] = useState<string>(mao.feature);
  const [description, setDescription] = useState<string>(mao.description);

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
      motherId !== mao.mother_id
    ) {
      isChange = true;
    }
    setIsChange(isChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, birthday, father, mother, appearance, feature, description, fatherId, motherId]);

  const [headList, setHeadList] = useState<ImgType[]>([]);
  const [imgList, setImgList] = useState<ImgType[]>([]);

  const getHeadImgList = async () => {
    let imgList: any = [];
    const res: ImgType[] = await getImgListByOtherId(mao.head_img_id, username);
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

  const getOtherImgList = async () => {
    let imgList: any = [];
    const res: ImgType[] = await getImgListByOtherId(mao.mao_id, username);
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
      father_id: fatherId || '',
      mother_id: motherId || ''
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

  const handleFather = (id: any) => {
    setFatherId(id || '')
  }

  const handleMother = (id: any) => {
    setMotherId(id || '')
  }

  return (
    <div className={`${styles.maoControl} ScrollBar`}>
      {/* 返回按钮 */}
      <Button
        className={styles.backButton}
        type="primary"
        onClick={() => back()}
      >
        <Icon type="left" />
        返回
      </Button>
      {/* 保存按钮 */}
      <Button
        className={styles.saveButton}
        type={isChange ? "danger" : "primary"}
        onClick={saveMaoPu}
      >
        <Icon type="save" />
        保存
      </Button>
      {/* 猫咪基本信息 */}
      <div className={styles.maoData}>
        <h2>{mao.name}</h2>
        <div>
          <span>姓名：</span>
          <Input
            size="large"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <span>生日：</span>
          <Input
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <div>
          <span>父亲：</span>
          <Input value={father} onChange={(e) => setFather(e.target.value)} />
        </div>
        <div>
          <span>父亲：</span>
          <Select value={fatherId} onChange={handleFather} style={{ flex: 1 }} allowClear>
            {
              maoList.filter(item => item.mao_id !== mao.mao_id).map(item => {
                return (
                  <Option key={item.mao_id} value={item.mao_id}>{item.name}</Option>
                )
              })
            }
          </Select>
        </div>
        <div>
          <span>母亲：</span>
          <Input value={mother} onChange={(e) => setMother(e.target.value)} />
        </div>
        <div>
          <span>母亲：</span>
          <Select value={motherId} onChange={handleMother} style={{ flex: 1 }} allowClear>
            {
              maoList.filter(item => item.mao_id !== mao.mao_id).map(item => {
                return (
                  <Option key={item.mao_id} value={item.mao_id}>{item.name}</Option>
                )
              })
            }
          </Select>
        </div>
        <div>
          <span>外貌：</span>
          <Input
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
          />
        </div>
        <div>
          <span>特点：</span>
          <Input value={feature} onChange={(e) => setFeature(e.target.value)} />
        </div>
        <div>
          <span>描述：</span>
          <TextArea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
