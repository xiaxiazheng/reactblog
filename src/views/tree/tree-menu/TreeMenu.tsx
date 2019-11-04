import React, { useState, useEffect, useContext } from 'react';
import styles from './TreeMenu.module.scss';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { IsLoginContext } from '../../../context/IsLoginContext';
import { getTree, addTreeNode } from '../../../client/TreeHelper';
import { Menu, Icon, message, Input } from 'antd';
import TreeMenuItem from './TreeMenuItem';
import { ShuttleBox, ShuttleMsgType } from './ShuttleBox';
import Loading from '../../../components/loading/Loading';
import { appUser } from '../../../env_config';

interface PropsType {
  history: History;
  match: match<{
    first_id: string;
    second_id: string;
    third_id: string;
  }>;
  location: Location;
};

const TreeMenu: React.FC<PropsType> = ({ history, match }) => {
  const { isLogin } = useContext(IsLoginContext);

  const { SubMenu } = Menu;

  const [loading, setLoading] = useState(true);

  // 初始化页面
  useEffect(() => {
    getTreeData();
  }, []);

  // 初始化数据
  const [originTreeList, setOriginTreeList] = useState<any[]>([]);
  const [treeList, setTreeList] = useState<any[]>([]);
  const getTreeData = async () => {
    setLoading(true);
    const res = await getTree(isLogin ? 'admin' : 'home');
    if (res) {
      setOriginTreeList(res);
      setTreeList(res);
      setLoading(false);
      /** 进入树首页时，默认展开第一个节点 */
      if (JSON.stringify(match.params) === '{}') {
        setOpenKeys([res[0].id])
      }
    }
  };

  // 刷新页面时匹配默认展开的树
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  useEffect(() => {
    if (match.params) {
      setOpenKeys([match.params.first_id, match.params.second_id]);
      setSelectedKeys([match.params.third_id]);
    }
  }, [match.params]);

  // 点击树节点
  const clickTreeNode = (level: string, first_id: string, second_id?: string, third_id?: string) => {
    if (level === 'level1') {
      if (openKeys.indexOf(first_id) === -1) {
        setOpenKeys([first_id]);
      } else {
        setOpenKeys([]);
      }
    }
    if (level === 'level2') {
      if (openKeys.indexOf(`${second_id}`) === -1) {
        setOpenKeys([first_id, `${second_id}`]);
      } else {
        setOpenKeys([first_id]);
      }
    }
    if (level === 'level3') {
      history.push(`${isLogin ? '/admin' : ''}/tree/${first_id}/${second_id}/${third_id}`);
    }
  };

  // 新增树节点
  const addNewTreeNode = async (
    addtype: 'front' | 'behind',
    level: '一级' | '二级' | '三级',
    first_id?: any,
    childrenSort?: number,
    second_id?: any,
    second_label?: string,
    second_sort?: number
  ) => {
    let params = {};
    // 新增一级节点
    if (level === '一级') {
      params = {
        level: 1,
        sort: addtype === 'front' ? treeList[0].sort : treeList[treeList.length - 1].sort,
        addtype: addtype
      };
    }
    // 新增二级节点
    if (level === '二级') {
      params = {
        level: 2,
        category_id: first_id,
        sort: childrenSort,
        addtype: addtype
      };
    }
    // 新增三级节点
    if (level === '三级') {
      params = {
        level: 3,
        category_id: first_id,
        id: second_id,
        label: second_label,
        f_sort: second_sort,
        c_sort: childrenSort,
        addtype: addtype
      };
    }
    const res = await addTreeNode(params);
    if (res) {
      message.success(`新建${level}节点成功`);
      getTreeData();
    } else {
      message.error(`新建${level}节点失败`);
    }
  };

  const [isShuttle, setIsShuttle] = useState(false);
  /** 保存更换父节点需要的信息 */
  const [shuttleMsg, setShuttleMsg] = useState<ShuttleMsgType>({
    title: '',
    level: '',
    id: '',
    defaultFatherId: '',
    shuttleFatherId: '',
    shuttleOptions: []
  })

  // 打开穿梭框，并保存相关信息
  const openShuttle = (
    level: string,
    id: string,
    label: string,
    fatherId: string,
    grandFather: {id: string, label: string}[]
  ) => {
    setShuttleMsg({
      title: `请选择将${level}级节点${label}移动到的父节点：`,
      level: level.split('').pop() || '',
      id: id,
      defaultFatherId: fatherId,
      shuttleFatherId: fatherId,
      shuttleOptions: grandFather.map(item => {
        return {
          id: item.id,
          label: item.label
        };
      })
    })
    setIsShuttle(true);
  }

  // 处理穿梭框选择项
  const handleShuttleChange = (value: string) => {
    setShuttleMsg({
      ...shuttleMsg,
      shuttleFatherId: value
    });
  }

  const [keyword, setKeyword] = useState('');
  // 搜索整棵树，如果上层匹配到就返回该层，如果没有匹配到就往下层找（用 new RegExp 是为了用 i 不区分大小写）
  const handleKeyword = (e: any) => {
    setKeyword(e.target.value);
    let keyword = e.target.value.toLowerCase();
    // 搜第一层
    let list = originTreeList.map((item: any) => {
      // 如果第一层包含关键字，返回该层
      if ((new RegExp(keyword, 'gi')).test(item.label)) {
        return item;
      } else {
        // 否则搜第二层
        let newItemChildren = item.children.map((jtem: any) => {
          // 如果第二层包含关键字，返回该层
          if ((new RegExp(keyword, 'gi')).test(jtem.label)) {
            return jtem;
          } else {
            // 否则搜第三层
            let newJtemChildren = jtem.children.map((ktem: any) => {
              // 如果第三层包含关键字，返回该层
              if ((new RegExp(keyword, 'gi')).test(ktem.label)) {
                return ktem;
              } else {
                // 否则返回 false
                return false;
              }
            });
            // 去掉第三层没搜到的项
            newJtemChildren = newJtemChildren.filter((ktem: any) => {
              return ktem !== false;
            });
            // 如果有搜索结果，则返回该层，而且替换掉第二层的 children
            if (newJtemChildren.length !== 0) {
              return {
                ...jtem,
                children: newJtemChildren
              };
            } else {
              // 三层没有搜索结果，返回 false
              return false;
            }
          }
        });
        // 去掉第二层没搜到的项
        newItemChildren = newItemChildren.filter((jtem: any) => {
          return jtem !== false;
        });
        // 如果有搜索结果，则返回该层，而且替换掉第一层的 children
        if (newItemChildren.length !== 0) {
          return {
            ...item,
            children: newItemChildren
          };
        } else {
          // 二层没有搜索结果，返回 false
          return false;
        }
      }
    });
    // 去掉第一层没有搜到的项
    list = list.filter((item: any) => {
      return item !== false;
    });
    // 输入第一层
    setTreeList(list);
  };

  return (
    <>
      {/* 筛选关键字输入框 */}
      <div className={styles.treeFilter}>
        <Input
          className={styles.treeFilterInput}
          value={keyword}
          onChange={handleKeyword}
          allowClear
          prefix={<Icon type="search"/>}
        />  
      </div>
      {/* 树 */}
      {loading ? <Loading fontSize={40} /> :
        <Menu
        className={styles.treeMenu}
        mode="inline"
        theme="dark"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
      >
        {/** 在上方添加一级节点 */
          isLogin && appUser !== 'hyp' &&
          <Menu.Item>
            <Icon
              className={styles.addRootTreenode}
              type="plus-circle"
              title="新增首位一级节点"
              onClick={addNewTreeNode.bind(null, 'front', '一级')}
            />
          </Menu.Item>
        }
        {/** 第一层 */
          treeList.map((item: any, index: number) => {
            return (
              <SubMenu
                className={appUser === 'hyp' ? styles.hiddenFirstLevel : ''}
                key={item.id}
                onTitleClick={() => clickTreeNode('level1', item.id)}
                title={
                  <TreeMenuItem
                    isFirst={index === 0}
                    isLast={index === treeList.length - 1}
                    level="level1"
                    label={item.label}
                    id={item.id}
                    sort={item.sort}
                    previousSort={index !== 0 ? treeList[index - 1].sort : -1}
                    previousId={index !== 0 ? treeList[index - 1].id : ''}
                    nextSort={index !== treeList.length - 1 ? treeList[index + 1].sort : -1}
                    nextId={index !== treeList.length - 1 ? treeList[index + 1].id : ''}

                    openShuttle={openShuttle}
                    getTreeData={getTreeData}
                    keyword={keyword}
                  />
                }>
                {/** 在上方添加二级节点 */
                  isLogin && 
                  <Menu.Item>
                    <Icon
                      className={styles.addRootTreenode}
                      type="plus-circle"
                      title="新增首位二级节点"
                      onClick={addNewTreeNode.bind(null, 'front', '二级', item.id, item.children[0].sort)}
                    />
                  </Menu.Item>
                }
                {/** 第二层 */
                  item.children.map((jtem: any, jndex: number) => {
                    return (
                      <SubMenu
                        key={jtem.id}
                        onTitleClick={() => clickTreeNode('level2', item.id, jtem.id)}
                        title={
                          <TreeMenuItem
                            grandFatherChildren={
                              treeList.map(i => {
                                return {
                                  id: i.id,
                                  label: i.label
                                }}
                              )
                            }
                            fatherId={item.id}

                            isFirst={jndex === 0}
                            isLast={jndex === item.children.length - 1}
                            level="level2"
                            label={jtem.label}
                            id={jtem.id}
                            sort={jtem.sort}

                            previousSort={jndex !== 0 ? item.children[jndex - 1].sort : -1}
                            previousId={jndex !== 0 ? item.children[jndex - 1].id : ''}
                            nextSort={jndex !== item.children.length - 1 ? item.children[jndex + 1].sort : -1}
                            nextId={jndex !== item.children.length - 1 ? item.children[jndex + 1].id : ''}

                            openShuttle={openShuttle}
                            getTreeData={getTreeData}
                            keyword={keyword}
                          />
                        }>
                        {/** 在上方添加三级节点 */
                          isLogin && 
                          <Menu.Item>
                            <Icon
                              className={styles.addRootTreenode}
                              type="plus-circle"
                              title="新增首位三级节点"
                              onClick={
                                addNewTreeNode.bind(
                                  null,
                                  'front',
                                  '三级',
                                  item.id,
                                  jtem.children[0].sort,
                                  jtem.id,
                                  jtem.label,
                                  jtem.sort  
                                )
                              }
                            />
                          </Menu.Item>
                        }
                        {/** 第三层 */
                          jtem.children.map((ktem: any, kndex: number) => {
                            return (
                              <Menu.Item
                                key={ktem.id}
                                onClick={() => clickTreeNode('level3', item.id, jtem.id, ktem.id)}
                                title={ktem.label}>
                                <TreeMenuItem
                                  grandFatherChildren={
                                    item.children.map((i: any) => {
                                      return {
                                        id: i.id,
                                        label: i.label
                                      }}
                                    )
                                  }
                                  fatherId={jtem.id}

                                  isFirst={kndex === 0}
                                  isLast={kndex === jtem.children.length - 1}
                                  level="level3"
                                  label={ktem.label}
                                  id={ktem.id}
                                  sort={ktem.sort}

                                  previousSort={kndex !== 0 ? jtem.children[kndex - 1].sort : -1}
                                  previousId={kndex !== 0 ? jtem.children[kndex - 1].id : ''}
                                  nextSort={kndex !== jtem.children.length - 1 ? jtem.children[kndex + 1].sort : -1}
                                  nextId={kndex !== jtem.children.length - 1 ? jtem.children[kndex + 1].id : ''}

                                  openShuttle={openShuttle}
                                  getTreeData={getTreeData}
                                  keyword={keyword}
                                />
                              </Menu.Item>
                            )
                          })
                        }
                        {/** 在下方添加三级节点 */
                          isLogin && 
                          <Menu.Item>
                            <Icon
                              className={styles.addRootTreenode}
                              type="plus-square"
                              title="新增末位三级节点"
                              onClick={
                                addNewTreeNode.bind(
                                  null,
                                  'behind',
                                  '三级',
                                  item.id,
                                  jtem.children[jtem.children.length - 1].sort,
                                  jtem.id,
                                  jtem.label,
                                  jtem.sort  
                                )
                              }
                            />
                          </Menu.Item>
                        }
                      </SubMenu>
                    )
                  })
                }
                {/** 在下方添加二级节点 */
                  isLogin && 
                  <Menu.Item>
                    <Icon
                      className={styles.addRootTreenode}
                      type="plus-square"
                      title="新增末位二级节点节点"
                      onClick={addNewTreeNode.bind(null, 'behind', '二级', item.id, item.children[item.children.length - 1].sort)}
                    />
                  </Menu.Item>
                }
              </SubMenu>
            )
          })
        }
        {/** 在下方添加一级节点 */
          isLogin && appUser !== 'hyp' &&
          <Menu.Item>
            <Icon
              className={styles.addRootTreenode}
              type="plus-square"
              title="新增末位根节点"
              onClick={addNewTreeNode.bind(null, 'behind', '一级')}
            />
          </Menu.Item>
        }
      </Menu>
      }
      {/* 穿梭提示框 */
        <ShuttleBox
          isShuttle={isShuttle}
          treeList={treeList}
          shuttleMsg={shuttleMsg}
          handleShuttleChange={handleShuttleChange}
          confirmShuttle={async () => {
            await getTreeData();
            setIsShuttle(false);
          }}
          closeShuttle={() => setIsShuttle(false)}
        />
      }
    </>
  );
}

export default withRouter(TreeMenu);
