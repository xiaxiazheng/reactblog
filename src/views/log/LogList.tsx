import React, { useState, useEffect } from 'react';
import { getLogListIsVisible } from '../../client/LogHelper';
import './LogList.scss';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';

interface LogListType {
  author: string;
  cTime: string;
  classification: string;
  edittype: string;
  isShow: string;
  isStick: string;
  log_id: string;
  mTime: string;
  title: string;
};

interface PropsType {
  history: History;
  location: Location;
  match: match<{log_class: string}>;
  type: string;
};

const LogList: React.FC<PropsType> = ({ type, history, match }) => {
  const [data, setData] = useState({
    pageNo: 1,
    pageSize: 10,
  });

  const [logList, setLogList] = useState({
    logList: [],
    totalNumber: 0
  });
  useEffect(() => {
    const getData = async () => {
      let params: any = {
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        isVisible: true,
        orderBy: 'create'
      };
      type !== '所有日志' && (params.classification = type);  // 若是所有日志不用传该字段
      const res = await getLogListIsVisible(params);
      setLogList({
        logList: res.list,
        totalNumber: res.totalNumber
      });
    }

    getData();
  }, [type]);

  // 点击日志，路由跳转
  const choiceOneLog = (item: LogListType) => {
    history.push(`/log/${match.params.log_class}/${btoa(decodeURIComponent(item.log_id))}`);
  };

  return (
    <ul className="log-list">
      {
        logList.logList.map((item: LogListType) => {
          return (
            <li className="log-list-item" key={item.log_id} onClick={choiceOneLog.bind(null, item)}>
              <LogListItem logType={type} logItem={item}></LogListItem>
            </li>
          )
        })
      }
    </ul>
  );
}

const LogListItem = ({ logType, logItem }: {logType: string; logItem: LogListType}) => {
  return (
    <>
      <span className="title">
        {logItem.title}
        {
          logType === '所有日志' && logItem.classification !== '' &&
          <span className="classification">[ {logItem.classification} ]</span>
        }
      </span>
      <span className="author">{logItem.author}</span>
      <span className="create-time">创建时间：{logItem.cTime}</span>
    </>
  );
};

export default withRouter(LogList);