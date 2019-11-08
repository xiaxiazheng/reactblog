import React, { useState, useEffect, useContext } from 'react';
import styles from './LogCont.module.scss';
import { getLogCont } from '../../../client/LogHelper';
import { Button, Icon, Switch } from 'antd';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { IsLoginContext } from '../../../context/IsLoginContext';
import LogContEditByClass from './LogContEditByClass';
import LogContShow from './LogContShow';
import { OneLogType } from '../LogType';
import { ThemeContext } from '../../../context/ThemeContext';
import classnames from 'classnames';

interface PropsType {
  match: match<{log_class: string;log_id: string}>;
  history: History;
  location: Location;
};

const LogCont: React.FC<PropsType> = ({ match, history }) => {
  const { theme } = useContext(ThemeContext);
  const { isLogin } = useContext(IsLoginContext);

  const [isEdit, setIsEdit] = useState(false);

  // 获取当前日志的数据
  const [logdata, setLogdata] = useState<OneLogType>();
  const getData = async () => {
    let id = decodeURIComponent(atob(match.params.log_id));
    const res: OneLogType = await getLogCont(id);
    setLogdata(res);
  };

  // 获取当前日志图片数组数据
  const getImageList = async () => {
    let id = decodeURIComponent(atob(match.params.log_id));
    const res: OneLogType = await getLogCont(id);
    const imgList = res.imgList;
    setLogdata({
      ...(logdata as OneLogType),
      imgList
    });
  };

  useEffect(() => {
    isEdit && getData();
  }, [match.params.log_id, isEdit]);

  // 回到日志列表
  const backToLogList = () => {
    history.push(`${isLogin ? '/admin' : ''}/log/${match.params.log_class}`);
  };

  const className = classnames({
    [styles.LogCont]: true,
    [styles.lightLogCont]: theme === 'light',
    'ScrollBar': theme === 'dark',
    'light_ScrollBar': theme === 'light'
  })

  return (
    <div className={className}>
      <Button className={styles.backButton} type="primary" onClick={backToLogList}>
        <Icon type="left" />
        返回
      </Button>
      {// 编辑与查看的切换按钮
        isLogin &&
        <Switch className={styles.logEditSwitch} checkedChildren="编辑" unCheckedChildren="查看" defaultChecked={isEdit} onChange={() => setIsEdit(!isEdit)} />
      }
      {/* 展示 */}
      {!isEdit &&
        <LogContShow log_id={match.params.log_id} />
      }
      {/* 编辑 */}
      {isLogin && isEdit && logdata &&
        // <LogContEdit logdata={logdata} />
        <LogContEditByClass logdata={logdata} getLogContData={getData} getImageList={getImageList}/>
      }
    </div>
  )
}

export default withRouter(LogCont);

