import React, { useContext } from 'react';
import styles from './Wall.module.scss';
import { IsLoginContext } from '../../context/IsLoginContext';
import WallShower from './WallShower';
import WallControl from './WallControl';
import { ThemeContext } from '../../context/ThemeContext';
import classnames from 'classnames';

const Wall: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { isLogin } = useContext(IsLoginContext);

  const className = classnames({
    [styles.Wall]: true,
    [styles.lightWall]: theme === 'light'
  })

  return (
    <div className={className}>
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
