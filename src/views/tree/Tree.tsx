import React, {useState, useContext, useEffect} from 'react';
import './Tree.scss';
import { IsLoginContext } from '../../common/IsLoginContext';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import TreeMenu from './TreeMenu';
import TreeContMain from './TreeContMain';
import TreeContShow from './TreeContShow';
import TreeContEdit from './TreeContEdit';
import { Switch } from 'antd';

interface PropsType {
  history: History;
  match: match;
  location: Location;
};

const Tree: React.FC<PropsType> = ({ match }) => {
  const { isLogin } = useContext(IsLoginContext);

  const [isEdit, setIsEdit] = useState(false);
  const [isMain, setIsMain] = useState(true);

  useEffect(() =>{
    setIsMain(JSON.stringify(match.params) === "{}");
  }, [match.params]);

  return (
    <div className="Tree">
      {/* 左边的树 */}
      <div className="tree-left">
        <TreeMenu />
      </div>
      {/* 右边的展示 & 编辑 */}
      <div className="tree-right ScrollBar">
        {// 编辑与查看的切换按钮
          isLogin &&
          <Switch className="tree-edit-switch" checkedChildren="编辑" unCheckedChildren="查看" defaultChecked={isEdit} onChange={() => setIsEdit(!isEdit)} />
        }
        {!isEdit && isMain &&
          <TreeContMain></TreeContMain>
        }
        {!isEdit && !isMain &&
          <TreeContShow></TreeContShow>
        }
        {isEdit &&
          <TreeContEdit></TreeContEdit>
        }
      </div>
    </div>
  );
}

export default withRouter(Tree);
