import React from 'react';
import { Modal } from 'antd';
import styles from './PreviewImage.module.scss';

interface PropsType {
  isPreview: boolean;
  imageName: string;
  imageUrl: string;
  closePreview: Function;
};

const ImageBox: React.FC<PropsType> = (props) => {

  const {
    isPreview,
    imageName,
    imageUrl,
    closePreview
  } = props;

  return (
    <div>
      {/* 图片预览 */}
      <Modal
        wrapClassName={`${styles.previewImgBoxWrapper} ScrollBar`}
        className={styles.previewImgBox}
        visible={isPreview}
        footer={null}
        centered
        title={imageName}
        onCancel={() => closePreview()}>
        <img src={imageUrl} alt={imageName} title={imageName} />
      </Modal>
    </div>
  );
}

export default ImageBox;