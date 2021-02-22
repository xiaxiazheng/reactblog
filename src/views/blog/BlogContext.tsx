import React, { createContext, useState } from 'react';

export const BlogContext = createContext({} as any);

interface TabsStateType {
  /** 设为 null 因为那边在监听 keyword === '' 时会初始化，但是刚载入的时候不需要触发，所以设置为 null */
  keyword: string | null
  pageNo: number
  pageSize: number
  /** 按什么排序，后两个是按照首字母升序降序 */
  orderBy: 'create' | 'modify' | 'letter' | 'letterDesc'
  /** 可见 */
  showVisible: boolean
  /** 不可见 */
  showInvisible: boolean
  /** 未设置 tag */
  showNotTag: boolean
}

export const BlogProvider: React.FC = props => {
  // tabsState 是所有的 tab 的页面状态
  const [tabsState, setTabsState] = useState<TabsStateType>({
    keyword: null,
    pageNo: 1,
    pageSize: 20,
    orderBy: 'modify',
    showVisible: true,
    showInvisible: true,
    showNotTag: false
  });

  const [activeTag, setActiveTag] = useState<string>()
  const [isTagChange, setIsTagChange] = useState<boolean>(false)
  const [tagList, setTagList] = useState([])
  // 记录 loglist 那边是否更新了 tag（修改log的tag或者删除log都要改变状态）
  const [isUpdateTag, setIsUpdateTag] = useState(false)
  
  return (
    <BlogContext.Provider
      value={
        {
          tabsState, setTabsState,
          isTagChange, setIsTagChange,
          activeTag, setActiveTag,
          tagList, setTagList,
          isUpdateTag, setIsUpdateTag
        }
      }>
      {props.children}
    </BlogContext.Provider>
  )
}

export interface BlogContextType {
  tabsState: TabsStateType
  setTabsState: React.Dispatch<React.SetStateAction<TabsStateType>>
  activeTag: string
  setActiveTag: React.Dispatch<React.SetStateAction<TabsStateType>>
  isTagChange: boolean
  setIsTagChange: React.Dispatch<React.SetStateAction<boolean>>
  tagList: { tag_name: string; tag_id: string }[]
  setTagList: React.Dispatch<React.SetStateAction<{ tag_name: string; tag_id: string }[]>>
  isUpdateTag: boolean
  setIsUpdateTag: React.Dispatch<React.SetStateAction<boolean>>
}
export const BlogConsumer = BlogContext.Consumer;