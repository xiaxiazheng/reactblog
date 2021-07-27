import React, { useState, useEffect, useContext } from "react";
import { Progress, message, Upload, Modal } from "antd";
import { CopyOutlined, EyeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styles from "./index.module.scss";
import { staticUrl } from "@/env_config";
import { IImageType, ImgType, deleteImg } from "@/client/ImgHelper";
import Loading from "@/components/loading";
import PreviewImage from "@/components/preview-image";
import { UserContext } from "@/context/UserContext";

interface PropsType {
  otherId?: string; // 跟这个图片要插入的地方有关联的记录 id
  type: string; // 图片在该系统中的类型的类型
  imageId?: string; // 若有图片则有 id
  imageName?: string;
  imageFileName?: string;
  imageMinUrl: string; // 缩略图地址，没有的话是''
  imageUrl: string; // 完整的 url 的路径，若为 '' 则该组件需提供上传，不为 '' 则提供大图或删除图片
  initImgList: Function; // 用于上传成功或删除后的图片列表初始化
  width?: string; // 可以传递宽高给组件
  imageData: ImgType | {}; // 从接口拿的图片原始信息
  iconRender?: any; // 用于渲染在操作台上进行操作的 antd 的 icon
}

const ImageBox: React.FC<PropsType> = (props) => {
  const { username } = useContext(UserContext);

  const {
    type,
    imageId,
    imageName = "一张图片",
    imageFileName,
    imageUrl,
    otherId = "",
    imageMinUrl,
    initImgList,
    width = "170px",
    imageData,
    iconRender,
  } = props;

  const { confirm } = Modal;

  // 图片的 ref，用于交叉观察
  const imgRef: any = React.createRef();
  // 交叉观察器加载图片
  useEffect(() => {
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((item) => {
        if (item.isIntersecting) {
          const img: any = item.target;
          if (encodeURI(img["dataset"]["src"]) !== img["src"]) {
            img["src"] = img["dataset"]["src"];
          }
        }
      });
    });
    imgRef.current !== null && observer.observe(imgRef.current);
  }, [imgRef]);

  // const [loading, setLoading] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [name, setName] = useState<string>();
  const [percent, setPercent] = useState<number>();
  const [size, setSize] = useState<number>();

  const handleChange = (info: any) => {
    // 上传中
    if (info.file.status === "uploading") {
      setPercent(info.file.percent);
    }
    // 上传成功触发
    if (info.file.status === "done") {
      message.success("上传图片成功");
      setName(undefined);
      initImgList();
    }
    if (info.file.status === "error") {
      message.error("上传图片失败");
    }
  };

  const [isPreview, setIsPreview] = useState(false);
  const deleteImage = async () => {
    confirm({
      title: `你将删除"${imageName}"`,
      content: "Are you sure？",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const params = {
          type: type,
          img_id: imageId,
          filename: imageFileName,
        };
        const res = await deleteImg(params);
        if (res) {
          message.success("删除成功");
          await initImgList();
        } else {
          message.error("删除失败");
        }
      },
      onCancel() {
        message.info("已取消删除", 1);
      },
    });
  };

  // 复制图片的 url
  const copyImgUrl = () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.setAttribute("value", imageUrl);
    input.select();
    document.execCommand("copy");
    message.success("复制图片路径成功", 1);
    document.body.removeChild(input);
  };

  const beforeUpload = (info: any) => {
    setName(info.name);
    setPercent(0);
    setSize(info.size);

    return true; // 为 false 就不会上传
  };

  const handleSize = (size: number) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)}KB`;
    } else {
      return `${(size / 1024 / 1024).toFixed(2)}MB`;
    }
  };

  return (
    <div
      className={styles.Imagebox}
      style={{
        width: `${width}`,
        height: `${width}`,
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setIsHover(false);
      }}
    >
      {/* 没有图片的情况，展示添加 */}
      {imageUrl === "" && (
        <Upload
          className={styles.Upload}
          name={type}
          showUploadList={false}
          action={`${staticUrl}/api/${type}_upload`}
          data={{
            other_id: otherId || "",
            username,
          }}
          beforeUpload={beforeUpload}
          listType="picture-card"
          onChange={handleChange}
        >
          {name ? (
            <div className={styles.progress}>
              <div className={styles.name}>{name}</div>
              <div>{handleSize(size || 0)}</div>
              <div>进度：{(percent || 0).toFixed(1)}%</div>
              <Progress
                strokeColor={{
                  from: "#108ee9",
                  to: "#87d068",
                }}
                percent={percent}
                status="active"
              />
            </div>
          ) : (
            <>
              <PlusOutlined className={styles.addIcon} />
              点击上传图片
            </>
          )}
        </Upload>
      )}
      {/* 加载中。。。 */}
      {/* {imageUrl !== '' && loading &&
        <div className={styles.imageLoading}>
          <Loading />
        </div>
      } */}
      {/* 有图片的情况，展示缩略图或图片名称 */}
      {imageUrl !== "" && (
        <>
          {imageMinUrl && imageMinUrl !== "" ? (
            <img
              ref={imgRef}
              className={styles.shower}
              onMouseEnter={(e) => {
                e.stopPropagation();
                setIsHover(true);
              }}
              data-src={imageMinUrl}
              alt={imageName}
            />
          ) : (
            <div
              className={styles.shower}
              onMouseEnter={(e) => {
                e.stopPropagation();
                setIsHover(true);
              }}
            >
              {imageName}
            </div>
          )}
        </>
      )}
      {/* 有图片的情况，显示操作 */}
      {imageUrl !== "" && isHover && (
        <div
          className={styles.Icons}
          title={`${(imageData as ImgType).imgname}\n${handleSize(
            Number((imageData as ImgType).size || 0)
          )}\n${(imageData as ImgType).cTime}`}
        >
          <div>
            <CopyOutlined
              className={styles.iconBoxIcon}
              title="复制图片链接"
              onClick={copyImgUrl}
            />
            <EyeOutlined
              className={styles.iconBoxIcon}
              title="预览图片"
              onClick={() => setIsPreview(true)}
            />
            <DeleteOutlined
              className={styles.iconBoxIcon}
              title="删除图片"
              onClick={deleteImage}
            />
            {iconRender || <></>}
          </div>
          <div className={styles.name}>{(imageData as ImgType).imgname}</div>
          <div className={styles.size}>
            {handleSize(Number((imageData as ImgType).size || 0))}
          </div>
          <div className={styles.time}>{(imageData as ImgType).cTime}</div>
        </div>
      )}
      {/* 图片预览 */}
      <PreviewImage
        isPreview={isPreview}
        imageName={imageName}
        imageUrl={imageUrl}
        closePreview={() => setIsPreview(false)}
      />
    </div>
  );
};

export default ImageBox;
