import React, { createContext, useState } from 'react';

export const LogContext = createContext({} as any);

interface TabsStateType {
  /** 设为 null 因为那边在监听 keyword === '' 时会初始化，但是刚载入的时候不需要触发，所以设置为 null */
  keyword: string | null
  pageNo: number
  pageSize: number
  /** 按什么排序 */
  orderBy: 'create' | 'modify'
  /** 可见 */
  showVisible: boolean
  /** 不可见 */
  showInvisible: boolean
  /** 未分类 */
  showNotClassify: boolean
}

export const LogProvider: React.FC = props => {
  // tabsState 是所有的 tab 的页面状态
  const [tabsState, setTabsState] = useState<TabsStateType>({
    keyword: null,
    pageNo: 1,
    pageSize: 15,
    orderBy: 'modify',
    showVisible: true,
    showInvisible: true,
    showNotClassify: false
  });

  const [activeTag, setActiveTag] = useState('')
  const [tagList, setTagList] = useState([])
  
  return (
    <LogContext.Provider
      value={
        {
          tabsState, setTabsState,
          activeTag, setActiveTag,
          tagList, setTagList
        }
      }>
      {props.children}
    </LogContext.Provider>
  )
}

export interface LogContextType {
  tabsState: TabsStateType
  setTabsState: React.Dispatch<React.SetStateAction<TabsStateType>>
  activeTag: string
  setActiveTag: React.Dispatch<React.SetStateAction<TabsStateType>>
  tagList: { tag_name: string; tag_id: string }[]
  setTagList: React.Dispatch<React.SetStateAction<{ tag_name: string; tag_id: string }[]>>
}
export const LogConsumer = LogContext.Consumer;