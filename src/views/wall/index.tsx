import React, { useContext } from 'react';
import styles from './index.module.scss';
import { IsLoginContext } from '@/context/IsLoginContext';
import WallShower from './wall-shower';
import WallControl from './wall-control';

const Wall: React.FC = () => {
  const { isLogin } = useContext(IsLoginContext);

  return (
    <div className={styles.Wall}>
      {!isLogin &&
        <WallShower />
      }
      {isLogin &&
        <WallControl />
      }
    </div>
  );
}

export default Wall;
