import React, { useEffect, useState } from 'react';
import './Log.scss';
import { Tabs, Icon } from 'antd';
import { getHomeLogAllClass } from '../../client/LogHelper';
import LogList from './LogList';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';

interface PropsType {
  history: History;
  location: Location;
  match: match<{log_class: string}>;
};

const Log: React.FC<PropsType> = ({ history, match }) => {
  const { TabPane } = Tabs;

  const [logclass, setLogClass] = useState('所有日志');
  useEffect(() => {
    setLogClass(match.params.log_class);
  }, [match.params.log_class]);

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

  // 选择日志分类，路由跳转
  const choiceClass = (key: string) => {
    setLogClass(key);
    history.push(`/log/${key}`);
  }

  

  return (
    <div className="Log">
      {/* 日志分类 */}
      <Tabs className='log-tab' onChange={choiceClass} activeKey={logclass}>
        {
          data.classList.map((logclass) => {
            return (
              <TabPane
                tab={
                  <span>
                    {logclass === '所有日志' && <Icon type="apple" />}
                    {logclass}
                  </span>
                }
                key={logclass}
              >
                {/* 日志列表 */}
                <LogList logclass={logclass}></LogList>
              </TabPane>
            )
          })
        }
      </Tabs>
    </div>
  );
}

export default withRouter(Log);