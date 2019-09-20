import React, { useState, useEffect, useContext } from 'react';
import './LogCont.scss';
import { getLogCont } from '../../client/LogHelper';
import { Button, Icon, Switch } from 'antd';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { IsLoginContext } from '../../common/IsLoginContext';
import LogContEdit from './LogContEdit';
import { OneLogType } from './LogType';

interface PropsType {
  match: match<{log_class: string;log_id: string}>;
  history: History;
  location: Location;
};

const LogCont: React.FC<PropsType> = ({ match, history }) => {
  const { isLogin } = useContext(IsLoginContext);

  const [isEdit, setIsEdit] = useState(true);

  const [data, setData] = useState<OneLogType>();
  useEffect(() => {
    const getData = async () => {
      let id = decodeURIComponent(atob(match.params.log_id));
      const res: OneLogType = await getLogCont(id);
      setData(res);
    };
    getData();
  }, [match.params.log_id]);

  // 回到日志列表
  const backToLogList = () => {
    history.push(`/log/${match.params.log_class}`);
  }

  return (
    <div className="LogCont">
      <Button className="back-button" type="primary" onClick={backToLogList}>
        <Icon type="left" />
        返回
      </Button>
      {// 编辑与查看的切换按钮
        isLogin &&
        <Switch className="log-edit-switch" checkedChildren="编辑" unCheckedChildren="查看" defaultChecked={isEdit} onChange={() => setIsEdit(!isEdit)} />
      }
      {// 保存按钮
        isLogin &&
        <Button className="save-button" type="primary"></Button>
      }
      {!isEdit && data &&
        <>
          <h2 className="title">{data.title}</h2>
          <h3 className="author">{data.author}</h3>
          <div className="time">
            <span>创建时间: {data.cTime}</span>
            <span>修改时间: {data.mTime}</span>
          </div>
          <div className="logcont" dangerouslySetInnerHTML={{__html: data.logcont }}></div>
        </>
      }
      {isEdit && data &&
        <LogContEdit logdata={data} />
      }
    </div>
  )
}

export default withRouter(LogCont);

