import React, { useState, useEffect, useContext } from 'react';
import './LogListItem.scss';
import { Icon } from 'antd';
// import { getLogListIsVisible, getLogListAll } from '../../client/LogHelper';
import { IsLoginContext } from '../../common/IsLoginContext';
import { LogListType } from './LogListType';

interface PropsType {
  logClass: string;
  logItemData: LogListType;
  orderBy: 'create' | 'modify';
}

// 单条日志记录
const LogListItem: React.FC<PropsType> = ({ logClass, logItemData, orderBy }) => {
  const { isLogin } = useContext(IsLoginContext);

  const handleClassifyLog = (e: any) => {
    e.stopPropagation();
  };
  
  const handleStickLog = (e: any) => {
    e.stopPropagation();
  };

  const handleShowLog = (e: any) => {
    e.stopPropagation();
  };

  const handleDeleteLog = (e: any) => {
    e.stopPropagation();
  };

  return (
    <>
      <span className="title">
        {logItemData.title}
        {
          logClass === '所有日志' && logItemData.classification !== '' &&
          <span className="classification">[ {logItemData.classification} ]</span>
        }
      </span>
      <span className="author">{logItemData.author}</span>
      {isLogin && 
        <span className="edit-type">({logItemData.edittype === 'richtext' ? '富文本文档' : 'markdown'})</span>
      }
      <span className="orderby-time">{orderBy === 'create' ? '创建' : '修改'}时间：{logItemData.cTime}</span>
      {isLogin &&
        <div className="log-operate-box">
          <Icon
            onClick={handleClassifyLog}
            className={logItemData.classification !== '' ? "active log-classify-icon" : "log-classify-icon"}
            title={logItemData.classification !== '' ? '点击切换日志分类' : '点击为该日志分类'}
            type="book" />
          <Icon
            onClick={handleStickLog}
            className={logItemData.isStick === 'true' ? "active log-sticky-icon" : "log-sticky-icon"}
            title={logItemData.isStick === 'true' ? '点击取消置顶' : '点击置顶该日志'}
            type="vertical-align-top" />
          <Icon
            onClick={handleShowLog}
            className={logItemData.isShow === 'true' ? "active log-show-icon" : "log-show-icon"}
            title={logItemData.isShow === 'true' ? '当前日志可见' : '当前日志不可见'}
            type="eye" />
          <Icon
            onClick={handleDeleteLog}
            className="log-delete-icon"
            title="点击删除该日志"
            type="delete" />
        </div>
      }
    </>
  );
};

export default LogListItem;