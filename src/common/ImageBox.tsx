import React, { useState } from 'react';
import { Icon, message, Upload, Modal } from 'antd';
import './ImageBox.scss';
import { baseUrl } from '../env_config';
import { deleteImg } from '../client/ImgHelper';

interface PropsType {
  otherId?: string;  // 跟这个图片要插入的地方有关联的记录 id
  type: string;  // 图片在该系统中的类型的类型
  imageId?: string;  // 若有图片则有 id
  imageName?: string;
  imageFileName?: string;
  imageUrl: string;  // 完整的 url 的路径，若为 '' 则该组件需提供上传，不为 '' 则提供大图或删除图片
  initImgList: Function;  // 用于上传成功或删除后的图片列表初始化
  width?: string;  // 可以传递宽高给组件
};

const ImageBox: React.FC<PropsType> = ({ type, imageId, imageName="一张图片", imageFileName, imageUrl, otherId, initImgList, width='170px' }) => {
  const { confirm } = Modal;

  const [loading, setLoading] = useState(true);
  const [isHover, setIsHover] = useState(false);

  const handleChange = (info: any) => {
    // 上传成功触发
    if (info.file.status === 'done') {
      message.success("上传图片成功");
      initImgList();
    }
    if (info.file.status === 'error') {
      message.error("上传图片失败");
    }
  };

  const [isPreview, setIsPreview] = useState(false);
  const deleteImage = async () => {
    confirm({
      title: `你将删除"${imageName}"`,
      content: 'Are you sure？',
      centered: true,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const params = {
          type: type,
          img_id: imageId,
          filename: imageFileName
        };
        const res = await deleteImg(params);
        if (res) {
          message.success('删除成功');
          await initImgList();
        } else {
          message.error('删除失败');
        }
      },
      onCancel() {
        message.info("已取消删除", 1);
      },
    });
  };

  // 复制图片的 url
  const copyImgUrl = () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', imageUrl);
    input.select();
    document.execCommand('copy');
    message.success("复制图片路径成功", 1);
    document.body.removeChild(input);
  };

  return (
    <div className="Imagebox" style={{width: `${width}`, height: `${width}`}}  onMouseLeave={(e) => { e.stopPropagation(); setIsHover(false);}}>
      {/* 没有图片的情况，展示添加 */}
      {imageUrl === '' &&
        <Upload
          className="imagebox-upload"
          name={type}
          showUploadList={false}
          action={`${baseUrl}/${type}_upload`}
          data={{
            other_id: otherId || undefined
          }}
          listType="picture-card"
          onChange={handleChange}
        >
          <Icon type='plus' />
        </Upload>
      }
      {/* 加载中。。。 */}
      {imageUrl !== '' && loading &&
        <div className="imagebox-loading">
          <Icon type="loading" />
        </div>
      }
      {/* 有图片的情况，展示图片 */}
      {imageUrl !== '' &&
        <img className="imagebox-shower"
          onMouseEnter={(e) => { e.stopPropagation(); setIsHover(true);}}
          onLoad={() => setLoading(false)}
          src={imageUrl}
          alt={imageName}
        />
      }
      {/* 有图片的情况，显示操作 */}
      {imageUrl !== '' && isHover &&
        <div className="imagebox-icons">
          <Icon className="icon-box-icon" title="复制图片链接" type="copy" onClick={copyImgUrl}/>
          <Icon className="icon-box-icon" title="预览图片" type="eye" onClick={() => setIsPreview(true)}/>
          <Icon className="icon-box-icon" title="删除图片" type="delete" onClick={deleteImage}/>
        </div>
      }
      {/* 图片预览 */}
      <Modal
        wrapClassName="previewImgBox-wrapper ScrollBar"
        className="previewImgBox"
        visible={isPreview}
        footer={null}
        centered
        onCancel={() => setIsPreview(false)}>
        <img src={imageUrl} />
      </Modal>
    </div>
  );
}

export default ImageBox;