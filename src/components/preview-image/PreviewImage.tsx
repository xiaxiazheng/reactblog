import React from 'react';
import { Modal } from 'antd';
import styles from './PreviewImage.module.scss';
import MaskloadImage from '@/components/mask-load-image';

interface PropsType {
  isPreview: boolean;
  imageName: string;
  imageUrl: string;
  closePreview: Function;
};

// 图片预览
const PreviewImage: React.FC<PropsType> = (props) => {
  const {
    isPreview,
    imageName,
    imageUrl,
    closePreview
  } = props;

  return (
    <div>
      <Modal
        wrapClassName={`${styles.previewImgBoxWrapper} ScrollBar`}
        className={styles.previewImgBox}
        visible={isPreview}
        footer={null}
        centered
        title={imageName}
        onCancel={() => closePreview()}
      >
        {isPreview && 
          <MaskloadImage imageUrl={imageUrl} imageName={imageName} />
        }
      </Modal>
    </div>
  );
}

export default PreviewImage;