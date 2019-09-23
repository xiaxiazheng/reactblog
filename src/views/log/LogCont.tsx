import React, { useState, useEffect, useContext } from 'react';
import './LogCont.scss';
import { getLogCont } from '../../client/LogHelper';
import { Button, Icon, Switch } from 'antd';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { IsLoginContext } from '../../common/IsLoginContext';
// import LogContEditByHooks from './LogContEditByHooks';
import LogContEditByClass from './LogContEditByClass';
import LogContShow from './LogContShow';
import { OneLogType } from './LogType';

interface PropsType {
  match: match<{log_class: string;log_id: string}>;
  history: History;
  location: Location;
};

const LogCont: React.FC<PropsType> = ({ match, history }) => {
  const { isLogin } = useContext(IsLoginContext);

  const [isEdit, setIsEdit] = useState(false);

  // 获取当前日志的数据
  const [logdata, setLogdata] = useState<OneLogType>();
  useEffect(() => {
    const getData = async () => {
      let id = decodeURIComponent(atob(match.params.log_id));
      const res: OneLogType = await getLogCont(id);
      setLogdata(res);
    };
    getData();
  }, [match.params.log_id, isEdit]);

  // 回到日志列表
  const backToLogList = () => {
    history.push(`/log/${match.params.log_class}`);
  };

  return (
    <div className="LogCont ScrollBar">
      <Button className="back-button" type="primary" onClick={backToLogList}>
        <Icon type="left" />
        返回
      </Button>
      {// 编辑与查看的切换按钮
        isLogin &&
        <Switch className="log-edit-switch" checkedChildren="编辑" unCheckedChildren="查看" defaultChecked={isEdit} onChange={() => setIsEdit(!isEdit)} />
      }
      {/* 展示 */}
      {!isEdit &&
        <LogContShow log_id={match.params.log_id} />
      }
      {/* 编辑 */}
      {isLogin && isEdit && logdata &&
        // <LogContEdit logdata={logdata} />
        <LogContEditByClass logdata={logdata}/>
      }
    </div>
  )
}

export default withRouter(LogCont);

