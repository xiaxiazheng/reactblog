import React, { useContext } from 'react';
import styles from './Wall.module.scss';
import { IsLoginContext } from '@/context/IsLoginContext';
import WallShower from './wall-shower/WallShower';
import WallControl from './wall-control/WallControl';

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
