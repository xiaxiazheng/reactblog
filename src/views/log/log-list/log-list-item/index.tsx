import React, { useState, useContext } from 'react';
import styles from './index.module.scss';
import { Icon, message, Modal, Select } from 'antd';
import { isShowLog, isStickLog, deleteLogCont } from '@/client/LogHelper';
import { IsLoginContext } from '@/context/IsLoginContext';
import { LogListType } from '../../LogType';

interface PropsType {
  // logClass: string;
  logItemData: LogListType;
  orderBy: 'create' | 'modify';
  getNewList: Function;  // 完成操作后刷新数组
  // getAllLogClass: Function;
}

// 单条日志记录
const LogListItem: React.FC<PropsType> = (props) => {
  const { logItemData, orderBy, getNewList } = props;
  const { isLogin } = useContext(IsLoginContext);
  const { confirm } = Modal;
  const { Option } = Select;

  // const [selectedClassify, setSelectedClassify] = useState(logItemData.classification === '' ? '所有日志' : logItemData.classification);  // 被选中的分类
  // const [classifyList, setClassifyList] = useState<string[]>([]);  // 所有的分类
  const [isShowSwitch, setIsShowSwitch] = useState(false);  // 控制切换分类的弹框

  // 切换分类：获取所有分类，并打开切换分类的弹窗
  const handleClassifyLog = async (e: any) => {
    e.stopPropagation();
    // const res = await (isLogin ? getLogAllClass() : getHomeLogAllClass());
    // let classList: string[] = [
    //   '所有日志',
    //   ...res
    // ];
    // setClassifyList(classList);
    setIsShowSwitch(true);
  };

  // 切换分类：提交
  // const submitClassifyChange = async () => {
  //   const params = {
  //     id: logItemData.log_id,
  //     className: selectedClassify === '所有日志' ? '' : selectedClassify
  //   };
  //   const res = await switchLogClass(params);
  //   if (res) {
  //     message.success("切换分类成功", 1);
  //     getNewList();
  //     getAllLogClass();
  //     setIsShowSwitch(false);
  //   } else {
  //     message.error("切换分类失败", 1);
  //   }
  // }
  
  // 置顶
  const handleStickLog = async (e: any) => {
    e.stopPropagation();
    const params = {
      id: logItemData.log_id,
      isStick: logItemData.isStick === 'true' ? 'false' : 'true'
    };
    let res = await isStickLog(params);
    if (res) {
      message.success('修改置顶状态成功');
      getNewList();
    } else {
      message.error('修改置顶状态失败');
    }
  };

  // 可见
  const handleShowLog = async (e: any) => {
    e.stopPropagation();
    const params = {
      id: logItemData.log_id,
      isShow: logItemData.isShow === 'true' ? 'false' : 'true'
    };
    const res = await isShowLog(params);
    if (res) {
      message.success("修改可见状态成功");
      getNewList();
    } else {
      message.error("修改可见状态失败");
    }
  };

  // 删除
  const handleDeleteLog = (e: any) => {
    e.stopPropagation();
    confirm({
      title: `你将删除"${logItemData.title}"`,
      content: 'Are you sure？',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const params = {
          id: logItemData.log_id
        };
        const res = await deleteLogCont(params);
        if (res) {
          message.success("删除成功", 1);
          getNewList();
        } else {
          message.error("删除失败", 1);
        }
      },
      onCancel() {
        message.info("已取消删除", 1);
      },
    });
  };

  return (
    <div className={styles.logListItem}>
      <span className={styles.title}>
        {logItemData.title}
        {/* {
          logClass === '所有日志' && logItemData.classification !== '' &&
          <span className={styles.classification}>[ {logItemData.classification} ]</span>
        } */}
      </span>
      <span className={styles.author}>{logItemData.author}</span>
      {isLogin && 
        <span className={styles.editType}>({logItemData.edittype === 'richtext' ? '富文本文档' : 'markdown'})</span>
      }
      <span className={styles.orderbyTime}>{orderBy === 'create' ? '创建' : '修改'}时间：{orderBy === 'create' ? logItemData.cTime : logItemData.mTime}</span>
      {isLogin &&
        <div className={styles.logOperateBox}>
          {/* <Icon
            onClick={handleClassifyLog}
            className={`${logItemData.classification !== '' ? styles.active : ''} ${styles.logOperateIcon}`}
            title={logItemData.classification !== '' ? '点击切换日志分类' : '点击为该日志分类'}
            type="book" /> */}
          <Icon
            onClick={handleStickLog}
            className={`${logItemData.isStick === 'true' ? styles.active : ''} ${styles.logOperateIcon}`}
            title={logItemData.isStick === 'true' ? '点击取消置顶' : '点击置顶该日志'}
            type="vertical-align-top" />
          <Icon
            onClick={handleShowLog}
            className={`${logItemData.isShow === 'true' ? styles.active : ''} ${styles.logOperateIcon}`}
            title={logItemData.isShow === 'true' ? '当前日志可见' : '当前日志不可见'}
            type="eye" />
          <Icon
            onClick={handleDeleteLog}
            className={styles.logOperateIcon}
            title="点击删除该日志"
            type="delete" />
        </div>
      }
      {/* 切换分类的弹出框 */}
      {/* <div onClick={(e) => e.stopPropagation()}>
        <Modal
          title={`请选择要将《${logItemData.title}》切换到的分类：`}
          visible={isShowSwitch}
          centered
          onOk={submitClassifyChange}
          onCancel={() => setIsShowSwitch(false)}
        > */}
          {/* <Input value={customClass} onChange={(e) => setCustomClassify(e.target.value)}/> */}
          {/* <Select
            showSearch
            value={selectedClassify}
            style={{ width: 200 }}
            onChange={(val: string) => {setSelectedClassify(val)}}
            onBlur={(val: string) => {
              setSelectedClassify(val);
            }}
            onSearch={(val: string) => {
              setSelectedClassify(val);
            }}
            filterOption={(input, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {
              classifyList.map((item: string) => {
                return (
                  <Option key={item} value={item}>{item}</Option> 
                )
              })
            }
          </Select>
        </Modal>
      </div> */}
    </div>
  );
};

export default LogListItem;