import React, {useState, useContext, useEffect} from 'react';
import styles from './HeaderSearch.module.scss';
import { Icon, Input, Popover } from 'antd';
import { searchTree } from '@/client/TreeHelper';
import { withRouter, match } from 'react-router';
import { Location, History } from 'history';
import { IsLoginContext } from '@/context/IsLoginContext';

interface PropsType {
  match: match;
  location: Location;
  history: History;
};

interface TreeNodeType {
  c_id: number;
  c_label: string;
  c_sort: number;
  category: string;
  category_id: string;
  f_id: number;
  f_label: string;
  f_sort: number;
};

let timer: any = 0;

const Header: React.FC<PropsType> = ({ history }) => {
  const { isLogin } = useContext(IsLoginContext);  // 获取登录状态

  const [keyword, setKeyword] = useState('');  // 搜索关键字
  const [isSearching, setIsSearching] = useState(true);  // 是否正在搜索
  const [showPopup, setShowPopup] = useState(false);  // 展开搜索结果弹框

  const [searchResult, setSearchResult] = useState<TreeNodeType[]>([]);  // 搜索结果
  useEffect(() => {
    if (keyword !== '') {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        handleSearch();
      }, 1000)
    }
  }, [keyword]);

  /** 发搜索请求 */
  const handleSearch = async () => {
    const res: TreeNodeType[] = await searchTree(keyword || '');
    if (res) {
      setSearchResult(res);
    } else {
      setSearchResult([]);
    }
    setIsSearching(false);
  }

  /** 弹出层内容 */
  const Content = () => {
    // 按照 keyword 高亮搜索结果
    const highlight = (word: string) => {
      const reg = new RegExp(keyword, "gi");
      let list = word.match(reg) || [];
      return word.split(reg).reduce((jsx: any, item: string, index: number): any => {
        return (
          <>
            {jsx}
            <span className={styles.active}>{list[index - 1]}</span>
            {item}
          </>
        )
      });
    }

    // 选中搜索结果
    const choiceResult = (item: TreeNodeType) => {
      history.push(`${isLogin ? '/admin' : ''}/tree/${item.category_id}/${item.f_id}/${item.c_id}`);
      setShowPopup(false);
    }

    return (
      <div className={`${styles.treeSearchList} ScrollBar`}>
        {searchResult.map((item) => {
          return (
            <div
              key={item.c_id}
              onClick={choiceResult.bind(null, item)}
            >
              <span>{highlight(item.c_label)}</span>
              <span>{highlight(item.f_label)} => {highlight(item.category)}</span>
            </div>
          )
        })}
      </div>
    )
  }

  /** 输入 keyword */
  const handleInput = (e: any) => {
    const input = e.target.value;
    if (input === '') {
      setShowPopup(false);
      setIsSearching(false);
    } else {
      setShowPopup(true);
      setIsSearching(true);
    }
    setKeyword(input);
  }

  /** 处理聚焦 */
  const handleFocus = () => {
    if (keyword !== '') {
      setShowPopup(true);
      setIsSearching(true);
      setSearchResult([]);
      handleSearch();
    }
  }

  /** 处理离开焦点 */
  const handleOnBlur = () => {
    setTimeout(() => {
      setShowPopup(false)
    }, 200)
  }

  const MyLoading = () => (
    <div className={styles.myloading}>正在搜索中...</div>
  )

  /** 无搜索结果 */
  const NoResult = () => (
    <div className={styles.noResult}>没有搜索结果</div>
  )

  return (
    <Popover
      trigger="click"
      content={
        isSearching
        ? <MyLoading />
        : (
          // 有搜索结果的情况
          searchResult.length !== 0
          ? <Content />
          : <NoResult />
        )
      }
      getPopupContainer={(trigger: any) => trigger.parentNode }
      visible={showPopup && keyword !== ''}
    >
      <Input
        className={styles.searchTree}
        prefix={<Icon type="search" />}
        value={keyword}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleOnBlur}
        placeholder="搜索知识树节点"
        allowClear
      />
    </Popover>
  )
}

export default withRouter(Header);