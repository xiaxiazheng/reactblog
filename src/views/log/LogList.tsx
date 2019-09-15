import React, { useState, useEffect } from 'react';
import { getLogListIsVisible } from '../../client/LogHelper';
import './LogList.scss';
import { Input, Pagination } from 'antd';
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
  logclass: string;
};

const LogList: React.FC<PropsType> = ({ logclass, history, match }) => {
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
      logclass !== '所有日志' && (params.classification = logclass);  // 若是所有日志不用传该字段
      const res = await getLogListIsVisible(params);
      setLogList({
        logList: res.list,
        totalNumber: res.totalNumber
      });
    }

    getData();
  }, [logclass]);

  // const changePage = () => {
  //   this.setData({
  //     pageNo: 
  //   })
  // };

  // 点击日志，路由跳转
  const choiceOneLog = (item: LogListType) => {
    history.push(`/log/${match.params.log_class}/${btoa(decodeURIComponent(item.log_id))}`);
  };

  return (
    <>
      <div className="search-box">
        <Input placeholder="请输入搜索"></Input>
      </div>
      <div className="pagination">
        <Pagination defaultCurrent={1} total={50} />
      </div>
      <ul className="log-list">
        {
          logList.logList.map((item: LogListType) => {
            return (
              <li className="log-list-item" key={item.log_id} onClick={choiceOneLog.bind(null, item)}>
                <LogListItem logType={logclass} logItem={item}></LogListItem>
              </li>
            )
          })
        }
      </ul>
    </>
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