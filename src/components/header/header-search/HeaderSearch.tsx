import React, {useState, useContext, useEffect} from 'react';
import styles from './HeaderSearch.module.scss';
import { Icon, Input, Popover } from 'antd';
import { searchTree } from '@/client/TreeHelper';
import { withRouter, match } from 'react-router';
import { Location, History } from 'history';
import { IsLoginContext } from '@/context/IsLoginContext';
import Loading from '@/components/loading/Loading';

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
  const [isSearching, setIsSearching] = useState(false);  // 是否正在搜索
  const [showPopup, setShowPopup] = useState(false);  // 展开搜索结果弹框

  const [searchResult, setSearchResult] = useState<TreeNodeType[]>([]);  // 搜索结果
  useEffect(() => {
    if (keyword !== '') {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        handleSearch();
        setShowPopup(true);
      }, 1000)
    } else {
      setShowPopup(false);
    }
  }, [keyword]);

  /** 发搜索请求 */
  const handleSearch = async () => {
    setIsSearching(true);
    const res: TreeNodeType[] = await searchTree(keyword || '');
    if (res) {
      setSearchResult(res);
    } else {
      setSearchResult([]);
    }
    // setIsSearching(false);
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

  /** 无搜索结果 */
  const NoResult = () => {
    return (
      <div className={styles.noResult}>没有搜索结果</div>
    )
  }

  /** loading */
  const MyLoading = () => {
    return (
      <div className={styles.myloading}>
        <Loading />
      </div>
    )
  }

  /** 处理聚焦 */
  const handleFocus = () => {
    if (keyword !== '') {
      setShowPopup(true);
      handleSearch();
    }
  }

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
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => {
          setTimeout(() => {
            // setShowPopup(false)
          }, 200)
        }}
        placeholder="搜索知识树节点"
        allowClear
      />
    </Popover>
  )
}

export default withRouter(Header);