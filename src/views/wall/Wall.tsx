import React, { useContext } from 'react';
import styles from './Wall.module.scss';
import { IsLoginContext } from '../../context/IsLoginContext';
import WallShower from './WallShower';
import WallControl from './WallControl';
import classnames from 'classnames';

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
