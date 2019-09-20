import React, {useState, useEffect, useContext} from 'react';
import './Tree.scss';
import { IsLoginContext } from '../../common/IsLoginContext';
import TreeMenu from './TreeMenu';
import TreeContShow from './TreeContShow';
import TreeContEdit from './TreeContEdit';
import { Switch } from 'antd';

const Tree: React.FC = () => {
  const { isLogin } = useContext(IsLoginContext);

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="Tree">
      {/* 左边的树 */}
      <div className="tree-left ScrollBar">
        <TreeMenu />
      </div>
      {/* 右边的展示 & 编辑 */}
      <div className="tree-right ScrollBar">
        {// 编辑与查看的切换按钮
          isLogin &&
          <Switch className="tree-edit-switch" checkedChildren="编辑" unCheckedChildren="查看" defaultChecked={isEdit} onChange={() => setIsEdit(!isEdit)} />
        }
        {!isEdit &&
          <TreeContShow></TreeContShow>
        }
        {isEdit &&
          <TreeContEdit></TreeContEdit>
        }
      </div>
    </div>
  );
}

export default Tree;
