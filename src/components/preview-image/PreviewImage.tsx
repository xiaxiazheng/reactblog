import React, { useContext } from 'react';
import classnames from 'classnames';
import { Modal } from 'antd';
import styles from './PreviewImage.module.scss';
import { ThemeContext } from '../../context/ThemeContext';

interface PropsType {
  isPreview: boolean;
  imageName: string;
  imageUrl: string;
  closePreview: Function;
};

const ImageBox: React.FC<PropsType> = (props) => {
  const { theme } = useContext(ThemeContext);

  const {
    isPreview,
    imageName,
    imageUrl,
    closePreview
  } = props;

  // const className = classnames({
  //   [styles.Imagebox]: true,
  //   [styles.lightImagebox]: theme === 'light'
  // })

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