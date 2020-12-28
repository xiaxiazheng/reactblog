import React, { useState, useEffect, useContext } from "react";
import { Icon } from '@ant-design/compatible'
import { message, Upload, Modal } from "antd";
import styles from "./index.module.scss";
import { staticUrl } from "@/env_config";
import { deleteImg } from "@/client/ImgHelper";
import Loading from "@/components/loading";
import PreviewImage from "@/components/preview-image";
import UploadImage from "./upload-image";
import { UserContext } from '@/context/UserContext'

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
}

const ImageBox: React.FC<PropsType> = (props) => {
  const { username } = useContext(UserContext)

  const {
    type,
    imageId,
    imageName = "一张图片",
    imageFileName,
    imageUrl,
    otherId = '',
    imageMinUrl,
    initImgList,
    width = "170px",
  } = props;

  const { confirm } = Modal;

  // 图片的 ref，用于交叉观察
  const imgRef: any = React.createRef()
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
    imgRef.current !== null && observer.observe(imgRef.current)
  }, [imgRef]);

  // const [loading, setLoading] = useState(true);
  const [isHover, setIsHover] = useState(false);

  const handleChange = (info: any) => {
    // 上传成功触发
    if (info.file.status === "done") {
      message.success("上传图片成功");
      initImgList();
    }
    if (info.file.status === "error") {
      message.error("上传图片失败");
    }
  };

  // 上传图片
  const handleUpload = () => {
    // axios.put(this.uploadUrl, this.files[0], {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   },
    //   transformRequest: [function (data) {
    //     return data
    //   }],
    //   onUploadProgress: progressEvent => {
    //     let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
    //     self.uploadMessage = '上传 ' + complete
    //   }
    // })
    // .then((response) => {
    //   if (response.status === 200) {
    //     self.uploadMessage = '上传成功！'
    //   }
    // })
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
      {
        imageUrl === "" && (
          <Upload
            className={styles.Upload}
            name={type}
            showUploadList={false}
            action={`${staticUrl}/api/${type}_upload`}
            data={{
              other_id: otherId || '',
              username
            }}
            listType="picture-card"
            onChange={handleChange}
          >
            <Icon className={styles.addIcon} type="plus" />
            点击上传图片
          </Upload>
        )
        // <UploadImage />
      }
      {/* 加载中。。。 */}
      {/* {imageUrl !== '' && loading &&
        <div className={styles.imageLoading}>
          <Loading />
        </div>
      } */}
      {/* 有图片的情况，展示缩略图或图片名称 */}
      {
        imageUrl !== "" && (
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
        )
      }
      {/* 有图片的情况，显示操作 */}
      {imageUrl !== "" && isHover && (
        <div className={styles.Icons}>
          <Icon
            className={styles.iconBoxIcon}
            title="复制图片链接"
            type="copy"
            onClick={copyImgUrl}
          />
          <Icon
            className={styles.iconBoxIcon}
            title="预览图片"
            type="eye"
            onClick={() => setIsPreview(true)}
          />
          <Icon
            className={styles.iconBoxIcon}
            title="删除图片"
            type="delete"
            onClick={deleteImage}
          />
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
