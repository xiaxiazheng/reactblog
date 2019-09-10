import React, { useEffect, useState } from 'react';
import './Log.scss';
import { Tabs, Icon } from 'antd';
import { getHomeLogAllClass, getLogListIsVisible } from '../../client/LogHelper'; 
import { string } from 'prop-types';

const Log: React.FC = () => {
  const { TabPane } = Tabs;
  const [data, setData] = useState({ classList: [] });

  useEffect(() => {
    let list: any = [];
    const getData = async () => {
      const res = await getHomeLogAllClass();
      list = [
        '所有日志',
        ...res
      ];
      setData({ classList: list });
    };

    getData();
  }, []);

  const callback = (key: string) => {
    console.log(key);
  };

  return (
    <div className="Log">
      <Tabs className="log-tab" onChange={callback} >
        {
          data.classList.map((item) => {
            return (
              <TabPane
                tab={
                  <span>
                    { item === '所有日志' && <Icon type="apple" /> }
                    {item}
                  </span>
                }
                key={item}
              >
                <LogList type={item}></LogList>
              </TabPane>
            )
          })
        }
      </Tabs>
    </div>
  );
}

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

const LogList = ({ type }: { type: string }) => {
  const [data, setData] = useState({
    pageNo: 1,
    pageSize: 10,
    totalNumber: 0,
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
      // 若是所有日志不用传该字段
      type !== '所有日志' && (params.classification = type);
      const res = await getLogListIsVisible(params);
      console.log(res);
      setLogList({
        logList: res.list,
        totalNumber: res.totalNumber
      });
    }

    getData();
  }, [type]);

  return (
    <ul>
      {
        logList.logList.map((item: LogListType) => {
          return (
            <li key={item.log_id}>{item.title}</li>
          )
        })
      }
    </ul>
  )
}

export default Log;