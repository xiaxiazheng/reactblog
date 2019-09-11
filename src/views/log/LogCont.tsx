import React, { useState, useEffect } from 'react';
import './LogCont.scss';
import { getLogCont } from '../../client/LogHelper';
import { Button, Icon } from 'antd';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';

interface PropsType {
  match: match<{log_class: string;log_id: string}>;
  history: History;
  location: Location;
};

interface OneLogType {
  author: string;
  cTime: string;
  classification: string;
  edittype: string;
  imgList: []
  isShow: string;
  isStick: string;
  log_id: string;
  logcont: string;
  mTime: string;
  title: string;
};

const LogCont: React.FC<PropsType> = ({ match, history }) => {
  const [data, setData] = useState({
    title: '',
    author: '',
    cTime: '',
    mTime: '',
    editType: '',
    logCont: ''
  });
  useEffect(() => {
    const getData = async () => {
      let id = decodeURIComponent(atob(match.params.log_id));
      const res: OneLogType = await getLogCont(id);
      setData({
        title: res.title,
        author: res.author,
        cTime: res.cTime,
        mTime: res.mTime,
        editType: res.edittype,
        logCont: res.logcont
      });
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
      <h2 className="title">{data.title}</h2>
      <h3 className="author">{data.author}</h3>
      <div className="time">
        <span>创建时间: {data.cTime}</span>
        <span>修改时间: {data.mTime}</span>
      </div>
      <div className="logcont" dangerouslySetInnerHTML={{__html: data.logCont }}></div>
    </div>
  );
}

export default withRouter(LogCont);

