import React, { useState, useEffect, useContext } from 'react';
import './LogList.scss';
import { Input, Pagination, Icon, Radio, Checkbox } from 'antd';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { getLogListIsVisible, getLogListAll } from '../../client/LogHelper';
import { IsLoginContext } from '../../common/IsLoginContext';
import { LogListType } from './LogListType';
import LogListItem from './LogListItem';

interface PropsType {
  history: History;
  location: Location;
  match: match<{log_class: string}>;
  logclass: string;
};

const LogList: React.FC<PropsType> = ({ logclass, history, match }) => {
  const { isLogin } = useContext(IsLoginContext);  // 获取是否登录

  const [pageNo, setPageNo] = useState(1);  // 当前页面
  const [pageSize, setPageSize] = useState(15);  // 当前页面容量
  const [orderBy, setOrderBy] = useState<'create' | 'modify'>('create');  // 按创建时间或修改时间排序
  const [showVisible, setShowVidible] = useState(true);  // 显示可见
  const [showInvisible, setShowInvisible] = useState(true);  // 显示不可见
  const [showNotClassify, setShowNotClassify] = useState(false);  // 仅显示未分类

  const [logList, setLogList] = useState({
    logList: [],  // 日志列表
    totalNumber: 0  // 日志总数
  });

  // 初始化日志列表
  const getLogList = async () => {
    let params: any = {
      pageNo: pageNo,
      pageSize: pageSize,
      orderBy: orderBy
    };
    logclass !== '所有日志' && (params.classification = logclass);  // 若是所有日志不用传该字段
    logclass === '所有日志' && showNotClassify && (params.classification = '');  // 所有日志下，才可选仅显示未分类
    let res = {
      list: [],
      totalNumber: 0
    };
    if (isLogin) {
      if (showVisible && showInvisible) {
        // 显示所有日志
        res = await getLogListAll(params);
      } else if (showVisible) {
        // 仅显示可见
        params.isVisible = true;
        res = await getLogListIsVisible(params);
      } else if (showInvisible) {
        // 仅显示不可见
        params.isVisible = false;
        res = await getLogListIsVisible(params);
      }
    } else {
      // 没登录只能显示可见
      params.isVisible = true;
      res = await getLogListIsVisible(params);
    }
    console.log("list", res.list);
    setLogList({
      logList: res.list,
      totalNumber: res.totalNumber
    });
  }

  useEffect(() => {
    getLogList();
  }, [logclass, orderBy, pageNo, pageSize, showVisible, showInvisible, showNotClassify]);

  // 点击日志，路由跳转
  const choiceOneLog = (item: LogListType) => {
    history.push(`/log/${match.params.log_class}/${btoa(decodeURIComponent(item.log_id))}`);
  };

  return (
    <>
      <div className="operate-box">
        {/* 排序条件 */}
        <Radio.Group value={orderBy} onChange={e => setOrderBy(e.target.value)}>
          <Radio.Button value="create">按创建</Radio.Button>
          <Radio.Button value="modify">按修改</Radio.Button>
        </Radio.Group>
        {/* 显示条件 */}
        {isLogin &&
          <Checkbox
            className="check-box"
            checked={showVisible}
            onChange={() => {setShowVidible(!showVisible); setPageNo(1);}}>
              可见
          </Checkbox>
        }
        {isLogin &&
          <Checkbox
            className="check-box"
            checked={showInvisible}
            onChange={() => {setShowInvisible(!showInvisible); setPageNo(1);}}>
              不可见
          </Checkbox>
        }
        {logclass === '所有日志' &&
          <Checkbox
            className="check-box"
            checked={showNotClassify}
            onChange={() => {setShowNotClassify(!showNotClassify); setPageNo(1);}}>
              未分类
          </Checkbox>
        }
        {/* 搜索框 */}
        <Input
          className="search-box"
          placeholder="搜索当前分类下的日志"
          prefix={<Icon type="search"></Icon>}
          allowClear>
        </Input>
        {/* 分页 */}
        <Pagination
          className="pagination"
          pageSize={pageSize}
          current={pageNo}
          total={logList.totalNumber}
          showTotal={total => `共${total}篇`}
          onChange={(page) => {
            setPageNo(page);
          }}
          onShowSizeChange={(current, size) => {
            setPageSize(size);
          }}
          showSizeChanger
          pageSizeOptions={['5', '10', '15', '20']}/>
      </div>
      <ul className="log-list ScrollBar">
        {
          logList.logList.map((item: LogListType) => {
            return (
              <li className="log-list-item" key={item.log_id} onClick={choiceOneLog.bind(null, item)}>
                <LogListItem logClass={logclass} logItemData={item} orderBy={orderBy}></LogListItem>
              </li>
            )
          })
        }
      </ul>
    </>
  );
}

export default withRouter(LogList);