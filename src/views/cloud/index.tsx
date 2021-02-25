import React, { useContext } from 'react';
import styles from './index.module.scss';
import { IsLoginContext } from '@/context/IsLoginContext';
import CloudShower from './cloud-shower';
import CloudControl from './cloud-control';

const Cloud: React.FC = () => {
  const { isLogin } = useContext(IsLoginContext);

  return (
    <div className={styles.cloud}>
      {!isLogin &&
        <CloudShower />
      }
      {isLogin &&
        <CloudControl />
      }
    </div>
  );
}

export default Cloud;
