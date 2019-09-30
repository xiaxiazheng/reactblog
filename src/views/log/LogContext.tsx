import React, { createContext, useState } from 'react';

export const LogContext = createContext({} as any);

export const LogProvider: React.FC = props => {
  // 使用 context 在顶层路由引入它们，可以在切换列表和日志正文的时候保留页面的状态
  const [keyword, setKeyword] = useState(null);  // 设为 null 因为那边在监听 keyword === '' 时会初始化，但是刚载入的时候不需要触发，所以设置为 null
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [orderBy, setOrderBy] = useState<'create' | 'modify'>('modify');
  const [showVisible, setShowVidible] = useState(true);
  const [showInvisible, setShowInvisible] = useState(true);
  const [showNotClassify, setShowNotClassify] = useState(false);
  
  return (
    <LogContext.Provider
      value={
        {
          keyword, setKeyword,
          pageNo, setPageNo,
          pageSize, setPageSize,
          orderBy, setOrderBy,
          showVisible, setShowVidible,
          showInvisible, setShowInvisible,
          showNotClassify, setShowNotClassify
        }
      }>
      {props.children}
    </LogContext.Provider>
  )
}

export const LogConsumer = LogContext.Consumer;