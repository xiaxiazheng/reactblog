import React, { useContext } from 'react';
import './Wall.scss';
import { IsLoginContext } from '../../common/IsLoginContext';
import WallShower from './WallShower';
import WallControl from './WallControl';

const Wall: React.FC = () => {
  const { isLogin } = useContext(IsLoginContext);

  return (
    <div className="Wall">
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
