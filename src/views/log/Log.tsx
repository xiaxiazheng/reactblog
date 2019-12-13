import React, { useEffect, useState, useContext } from 'react';
import styles from './Log.module.scss';
import { Tabs, Icon, Modal, Input, message } from 'antd';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { IsLoginContext } from '@/context/IsLoginContext';
import { getLogAllClass, getHomeLogAllClass, editClassName } from '@/client/LogHelper';
import LogList from './log-list/LogList';
import Loading from '@/components/loading/Loading';
import classnames from 'classnames';

interface PropsType {
  history: History;
  location: Location;
  match: match<{log_class: string}>;
};

const Log: React.FC<PropsType> = ({ history, match }) => {
  const { isLogin } = useContext(IsLoginContext);  // 通过 context 获取是否登录

  const [loading, setLoading] = useState(true);

  const { TabPane } = Tabs;

  const [logClass, setLogClass] = useState('所有日志');
  // 根据路由变化，选择对应的日志分类
  useEffect(() => {
    setLogClass(match.params.log_class);
  }, [match.params.log_class]);

  const [classList, setClassList] = useState<string[]>([]);
  // 页面初始化
  useEffect(() => {
    getAllLogClass();
  }, []);

  // 获取所有分类
  const getAllLogClass = async () => {
    setLoading(true);
    const res = await (isLogin ? getLogAllClass() : getHomeLogAllClass());
    if (res) {
      let list: string[] = [
        '所有日志',
        ...res
      ];
      setClassList(list);
      setLoading(false);
    } else {
      message.error("获取所有日志失败");
    }
  };

  // 切换日志分类的 tab，路由跳转(直接改路由即可，有在监听路由)
  const choiceClass = (key: string) => {
    history.push(`/${isLogin ? 'admin/log' : 'log'}/${key}`);
  };

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');

  // 修改类别名称
  const editLogClassName = async () => {
    let params = {
      newClassName: newName,
      oldClassName: logClass
    };
    let res = await editClassName(params);
    if (res) {
      message.success("修改成功");
      setShowModal(false);
      await getAllLogClass();  // 先获取新的日志分类
      choiceClass(newName);  // 再将路由改成新修改的分类名
    }
  };

  return (
    <div className={styles.Log}>
      {loading ? <div className={styles.logTab}><Loading /></div> :
        <Tabs className={styles.logTab} onChange={choiceClass} activeKey={logClass}>
          {
            classList.map((item) => {
              return (
                <TabPane
                  className={styles.logTabPane}
                  tab={
                    <span>
                      {item === '所有日志' && <Icon type="home" />}
                      {item}
                      {isLogin && (item === logClass) && logClass !== '所有日志' &&
                        <Icon className={styles.editIcon} type="edit" onClick={() => { setShowModal(true); setNewName(logClass); }} />
                      }
                    </span>
                  }
                  key={item}
                >
                  {/* 日志列表 */}
                  <LogList logclass={item} getAllLogClass={getAllLogClass}></LogList>
                </TabPane>
              )
            })
          }
        </Tabs>
      }
      {/* 修改日志名称的弹框 */}
      <Modal
        title={`修改当前日志分类名称：${logClass}`}
        visible={showModal}
        centered
        onOk={editLogClassName}
        onCancel={() => setShowModal(false)}
      >
        <Input value={newName} onChange={(e) => {setNewName(e.target.value)}} />
      </Modal>
    </div>
  );
}

export default withRouter(Log);