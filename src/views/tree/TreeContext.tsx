import React, { createContext, useState } from 'react';

export const TreeContext = createContext({} as any);

export const TreeProvider: React.FC = props => {
  // 使用 context 在顶层路由引入它们，可以在该 Tree 组件内保存状态
  const [treeContTitle, setTreeContTitle] = useState('');
  
  return (
    <TreeContext.Provider
      value={
        {
          treeContTitle, setTreeContTitle
        }
      }>
      {props.children}
    </TreeContext.Provider>
  )
}

export const TreeConsumer = TreeContext.Consumer;