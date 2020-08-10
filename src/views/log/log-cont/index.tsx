import React, { useState, useEffect, useContext } from 'react';
import styles from './index.module.scss';
import { getLogCont } from '@/client/LogHelper';
import { LeftOutlined } from '@ant-design/icons';
import { Icon } from '@ant-design/compatible'
import { Button, Switch } from 'antd';
import { withRouter, RouteComponentProps, match } from 'react-router-dom';
import { IsLoginContext } from '@/context/IsLoginContext';
import LogContEditByClass from './log-cont-edit';
import LogContEditByMD from './log-cont-edit-md';
import LogContShow from './log-cont-show';
import { OneLogType } from '../LogType';

interface PropsType extends RouteComponentProps {
  match: match<{
    log_class: string;
    log_id: string;
  }>;
}

const LogCont: React.FC<PropsType> = (props) => {
  const { match, history } = props
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.log_id, isEdit]);

  // 回到日志列表
  const backToLogList = () => {
    history.push(`${isLogin ? '/admin' : ''}/log`);
  };

  return (
    <div className={styles.LogCont}>
      <Button className={styles.backButton} type="primary" onClick={backToLogList}>
        <Icon type="left" />
        返回
      </Button>
      {// 编辑与查看的切换按钮
        isLogin &&
        <Switch className={styles.logEditSwitch} checkedChildren="编辑" unCheckedChildren="查看" defaultChecked={isEdit} onChange={() => setIsEdit(!isEdit)} />
      }
      {/* 展示 */}
      {!isEdit && <LogContShow log_id={match.params.log_id} />}
      {/* 编辑 */}
      {isLogin && isEdit && logdata && (
        logdata.edittype === 'markdown'
          ? <LogContEditByMD logdata={logdata} getLogContData={getData} />
          : <LogContEditByClass logdata={logdata} getLogContData={getData} getImageList={getImageList}/>
      )}
    </div>
  );
}

export default withRouter(LogCont);

