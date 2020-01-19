import React, { useState, useEffect, useContext } from "react";
import styles from "./LogList.module.scss";
import {
  Input,
  Pagination,
  Icon,
  Radio,
  Checkbox,
  Button,
  message
} from "antd";
import { withRouter, match } from "react-router";
import { History, Location } from "history";
import {
  getLogListIsVisible,
  getLogListAll,
  addLogCont
} from "@/client/LogHelper";
import { IsLoginContext } from "@/context/IsLoginContext";
import { LogListType } from "../LogType";
import LogListItem from "./LogListItem";
import { LogContext, LogContextType } from "../LogContext";
import Loading from "@/components/loading/Loading";
import classnames from "classnames";

interface PropsType {
  history: History;
  location: Location;
  match: match<{ log_class: string }>;
  logclass: string;  // 这个是当前分类的日志类别名称
  getAllLogClass: Function;
}

const LogList: React.FC<PropsType> = ({
  logclass,
  history,
  match,
  getAllLogClass
}) => {
  const { isLogin } = useContext(IsLoginContext); // 获取是否登录

  const [loading, setLoading] = useState(true);

  const { tabsState, setTabsState } = useContext<LogContextType>(LogContext);
  // 当前 tab 的状态
  const [myState, setMyState] = useState<LogContextType["tabsState"][string]>({
    keyword: null,
    pageNo: 1,
    pageSize: 15,
    orderBy: "modify",
    showVisible: true,
    showInvisible: true,
    showNotClassify: false
  });
  // 展开方便用
  const {
    keyword,
    pageNo,
    pageSize,
    orderBy,
    showVisible,
    showInvisible,
    showNotClassify
  } = myState;

  // 每次操作都是变动 tabsState，然后再赋值给 myState
  const [isUpdate, setIsUpdate] = useState(false);
  useEffect(() => {
    // 不存在就初始化
    if (!tabsState[logclass]) {
      setTabsState({
        ...tabsState,
        [logclass]: myState
      });
      return
    }
    
    setMyState(tabsState[logclass]);
    setIsUpdate(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabsState[logclass]])

  // 有变动才更新
  useEffect(() => {
    if (isUpdate) {
      getLogList();
      setIsUpdate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate]);

  const [logListData, setLogListData] = useState({
    logList: [], // 日志列表
    totalNumber: 0 // 日志总数
  });

  // 初始化日志列表
  const getLogList = async () => {
    setLoading(true);
    
    let params: any = {
      pageNo: pageNo,
      pageSize: pageSize,
      orderBy: orderBy,
      keyword: keyword || ""
    };
    logclass !== "所有日志" && (params.classification = logclass); // 若是所有日志不用传该字段
    logclass === "所有日志" && showNotClassify && (params.classification = ""); // 所有日志下，才可选仅显示未分类
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
    setLogListData({
      logList: res.list,
      totalNumber: res.totalNumber
    });
    setLoading(false);
  };

  // 点击日志，路由跳转
  const choiceOneLog = (item: LogListType) => {
    const path = `${isLogin ? "/admin" : ""}/log/${
      match.params.log_class
    }/${btoa(decodeURIComponent(item.log_id))}`;
    history.push({
      pathname: path,
      state: {
        editType: item.edittype // 要带上日志类型
      }
    });
  };

  // 添加日志
  const addNewLog = async (type: "richtext" | "markdown") => {
    const params = {
      edittype: type,
      classification: logclass === "所有日志" ? "" : logclass
    };
    const res: any = await addLogCont(params);
    if (res) {
      message.success("新建成功");
      /** 新建成功直接跳转到新日志 */
      const newId = res.newid;
      const path = `/admin/log/${match.params.log_class}/${btoa(
        decodeURIComponent(newId)
      )}`;
      history.push({
        pathname: path,
        state: {
          editType: type // 要带上日志类型
        }
      });
    } else {
      message.error("新建失败");
    }
  };

  // 输入搜索关键字
  const [myKeyword, setMyKeyword] = useState<any>()
  useEffect(() => {
    setMyKeyword(keyword)
  }, [keyword])
  const handleKeyword = (e: any) => {
    setMyKeyword(e.target.value)
  };

  // myKeyword 删除到空就发请求
  useEffect(() => {
    // 这样限制就不会在初始化的时候又跑多一次了
    if (keyword !== '' && myKeyword === "") {
      setTabsState({
        ...tabsState,
        [logclass]: {
          ...tabsState[logclass],
          keyword: '',
          pageNo: 1
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myKeyword]);

  // 回车搜索，是通过修改 tabsState 的 keyword 实现搜索的
  const handleSearch = (e: any) => {
    if (e.keyCode === 13) {
      setTabsState({
        ...tabsState,
        [logclass]: {
          ...tabsState[logclass],
          keyword: myKeyword,
          pageNo: 1
        }
      });
    }
  };

  const logListClass = classnames({
    [styles.logList]: true,
    ScrollBar: true
  });

  // 处理可见
  const handleVisible = () => {
    setTabsState({
      ...tabsState,
      [logclass]: {
        ...tabsState[logclass],
        showVisible: !showVisible,
        pageNo: 1
      }
    });
  };

  // 处理不可见
  const handleInvisible = () => {
    setTabsState({
      ...tabsState,
      [logclass]: {
        ...tabsState[logclass],
        showInvisible: !showInvisible,
        pageNo: 1
      }
    });
  };

  // 处理未分类
  const handleNotClassify = () => {
    setTabsState({
      ...tabsState,
      [logclass]: {
        ...tabsState[logclass],
        showNotClassify: !showNotClassify,
        pageNo: 1
      }
    });
  };

  // 处理按什么排序
  const handleOrderBy = (e: any) => {
    setTabsState({
      ...tabsState,
      [logclass]: {
        ...tabsState[logclass],
        orderBy: e.target.value,
        pageNo: 1
      }
    });
  };

  // 切换页
  const handlePageNo = (page: number) => {
    setTabsState({
      ...tabsState,
      [logclass]: {
        ...tabsState[logclass],
        pageNo: page
      }
    });
  };

  // 切换页面容量
  const handlePageSize = (current: number, size: number) => {
    setTabsState({
      ...tabsState,
      [logclass]: {
        ...tabsState[logclass],
        pageSize: size,
        pageNo: 1
      }
    });
  };

  return (
    <>
      <div className={styles.operateBox}>
        {/* 新建日志 */}
        {isLogin && (
          <>
            <Button
              className={styles.addLogButton}
              title="新建富文本日志"
              type="primary"
              icon="file-text"
              onClick={addNewLog.bind(null, "richtext")}
            />
            <Button
              className={styles.addLogButton}
              title="新建 MarkDown 日志"
              type="primary"
              icon="file-markdown"
              onClick={addNewLog.bind(null, "markdown")}
            />
          </>
        )}
        {/* 排序条件 */}
        <Radio.Group
          className={styles.orderbyBox}
          value={orderBy}
          onChange={handleOrderBy}
        >
          <Radio.Button value="create">按创建</Radio.Button>
          <Radio.Button value="modify">按修改</Radio.Button>
        </Radio.Group>
        {/* 显示条件 */}
        {isLogin && (
          <Checkbox
            className={styles.checkBox}
            checked={showVisible}
            onChange={handleVisible}
          >
            可见
          </Checkbox>
        )}
        {isLogin && (
          <Checkbox
            className={styles.checkBox}
            checked={showInvisible}
            onChange={handleInvisible}
          >
            不可见
          </Checkbox>
        )}
        {logclass === "所有日志" && (
          <Checkbox
            className={styles.checkBox}
            checked={showNotClassify}
            onChange={handleNotClassify}
          >
            未分类
          </Checkbox>
        )}
        {/* 搜索框 */}
        <Input
          className={styles.searchBox}
          value={myKeyword || ""}
          onChange={handleKeyword}
          onKeyDownCapture={handleSearch}
          placeholder="回车搜当前分类日志"
          prefix={<Icon type="search"></Icon>}
          allowClear
        ></Input>
        {/* 分页 */}
        {logListData.logList && logListData.logList.length !== 0 && (
          <Pagination
            className={styles.pagination}
            pageSize={pageSize}
            current={pageNo}
            total={logListData.totalNumber}
            showTotal={total => `共${total}篇`}
            onChange={handlePageNo}
            onShowSizeChange={handlePageSize}
            showSizeChanger
            pageSizeOptions={["5", "10", "15", "20"]}
          />
        )}
      </div>
      {/* 日志列表 */}
      <ul className={logListClass}>
        {loading ? (
          <Loading width={300} />
        ) : logListData.logList && logListData.logList.length === 0 ? (
          <div className={styles.emptyList}>
            当前列表为空(之后再弄个好看的提示)
          </div>
        ) : (
          logListData.logList.map((item: LogListType) => {
            return (
              <li
                className={`${
                  item.isStick === "true" ? styles.activeStick : ""
                } ${styles.logListLi}`}
                key={item.log_id}
                onClick={choiceOneLog.bind(null, item)}
              >
                <LogListItem
                  logClass={logclass}
                  logItemData={item}
                  orderBy={orderBy}
                  getNewList={getLogList}
                  getAllLogClass={getAllLogClass}
                />
              </li>
            );
          })
        )}
      </ul>
    </>
  );
};

export default withRouter(LogList);
