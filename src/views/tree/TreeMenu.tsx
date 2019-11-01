import React, {useState, useEffect, useContext, ChangeEvent} from 'react';
import './TreeMenu.scss';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { IsLoginContext } from '../../context/IsLoginContext';
import { getTree, addTreeNode, modifyTreeNode, deleteTreeNode, changeSort } from '../../client/TreeHelper';
import { Menu, Icon, message, Modal, Input } from 'antd';

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

  // 初始化页面
  useEffect(() => {
    getTreeData();
  }, []);

  // 初始化数据
  const [originTreeList, setOriginTreeList] = useState<any[]>([]);
  const [treeList, setTreeList] = useState<any[]>([]);
  const getTreeData = async () => {
    const res = await getTree(isLogin ? 'admin' : 'home');
    if (res) {
      setOriginTreeList(res);
      setTreeList(res);
      console.log(match.params)
      if (JSON.stringify(match.params) === '{}' && openKeys.length === 0) {
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

  // 点击第一级的树
  const clickFirstLevel = (id: string) => {
    if (openKeys.indexOf(id) === -1) {
      setOpenKeys([id]);
    } else {
      setOpenKeys([]);
    }
  };

  // 点击第二级的树
  const clickSecondLevel = (id: string, id2: string) => {
    if (openKeys.indexOf(`${id2}`) === -1) {
      setOpenKeys([id, `${id2}`]);
    } else {
      setOpenKeys([id]);
    }
  };

  // 点击第三级的树
  const clickThirdLevel = (first_id: string, second_id: string, third_id: string) => {
    history.push(`${isLogin ? '/admin' : ''}/tree/${first_id}/${second_id}/${third_id}`);
  };

  // 记录展开节点操作框的项的 id
  const [editting_id, setEditting_id] = useState<string>('');

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

  // 单个树节点
  const TreeNodeItem = (props: {
    isFirst: boolean;  // 是否第一个节点
    isLast: boolean;  // 是否最后一个节点
    level: string;  // 节点级别
    label: string;  // 节点名称
    id: string;  // 节点 id
    sort: number;  // 节点顺序号
    index: number;  // 节点顺序

    previousSort: number;
    previousId: string;
    nextSort: number;
    nextId: string;
  }) => {
    const { confirm } = Modal;

    // 上移下移
    const changeNodeSort = async (type: 'up' | 'down') => {
      let otherId: any = '';
      let otherSort: any = '';
      if (type === 'up') {
        otherId = props.previousId;
        otherSort = props.previousSort;
      } else if (type === 'down') {
        otherId = props.nextId;
        otherSort = props.nextSort;
      } else {
        message.error('上下移动出错');
        return;
      }
  
      const params = {
        otherId,
        otherSort,
        level: Number(props.level.split('').pop()),
        thisId: props.id,
        thisSort: props.sort,
      };
      
      let res: any = await changeSort(params);
      if (res) {
        message.success(`${ type === 'up' ? '上移' : '下移' }成功`);
        getTreeData();
      } else {
        message.success(`${ type === 'up' ? '上移' : '下移' }失败`);
      }
    }

    // 编辑树节点
    const editTreeNode = async () => {
      const name = prompt(`请输入将${props.label}修改成的名称`, `${props.label}`);
      if (name !== '' && name !== null) {
        let params = {
          id: props.id,
          label: name,
          level: Number(props.level.split('').pop()),
        };
        const res: any = await modifyTreeNode(params);
        if (res) {
          message.success("修改节点名称成功");
          getTreeData();
        } else {
          message.error("修改节点名称成功");
        }
      }
    };

    // 删除节点
    const removeTreeNode = async () => {
      confirm({
        title: `你将删除"${props.label}"`,
        content: 'Are you sure？',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: async () => {
          const level = Number(props.level.split('').pop());
          const params = {
            id: props.id,
            level: level
          };
          const res = await deleteTreeNode(params);
          if (res) {
            message.success(`删除${level}级节点成功`, 1);
            getTreeData();
          } else {
            message.error(`删除${level}级节点失败`, 1);
          }
        },
        onCancel() {
          message.info("已取消删除", 1);
        },
      });
    };

    // 更换父节点
    const changeFather = async () => {
      console.log("还没做");
      // if (this.choiceFathId === this.originFathId) {
      //   this.$message.warning('当前所选与原来的相同');
      //   return;
      // }
      // let params: any = {};
      // if (this.shuttleLevel === 2) {
      //   for (let item of this.tree) {  // 二级节点穿梭，就要到一级节点找穿梭到的节点
      //     if (item.id === this.choiceFathId) {
      //       params = {
      //         shuttleLevel: this.shuttleLevel,
      //         category_id: item.id,
      //         f_sort:  item.children[item.children.length - 1].sort + 1,
      //         f_id: this.shuttleChildId
      //       };
      //       break;
      //     }
      //   }
      // }
      // if (this.shuttleLevel === 3) {  // 三级节点穿梭，就要到二级节点找穿梭到的节点
      //   for (let item of this.tree) {
      //     let isfind = false;
      //     for (let jtem of item.children) {
      //       if (jtem.id === this.choiceFathId) {
      //         params = {
      //           shuttleLevel: this.shuttleLevel,
      //           fatherid: jtem.id,
      //           fatherlabel: jtem.label,
      //           fathersort: jtem.sort,
      //           newchildsort: jtem.children[jtem.children.length - 1].sort + 1,
      //           childid: this.shuttleChildId
      //         };
      //         isfind = true;
      //         break;
      //       }
      //     }
      //     if (isfind) {
      //       break;
      //     }
      //   }
      // }
      // let res: any = await TreeHelper.changeFather(params);
      // if (res) {
      //   this.saveTreeExpend();
      //   await this.init();
      //   this.$message.success('穿梭成功');
      //   this.showShuttleDialog = false;
      // } else {
      //   this.$message.error('穿梭失败');
      // }
    };

    // 设置 label 中的关键字高亮
    const highlight = (label: any) => {
      // 先把匹配的项都找回出来（一个字符串会被多次匹配）
      let reg = new RegExp(keyword, 'gi');
      let matchlist = label.match(reg);
      // 然后把匹配的位置给找出来（通过 split 打断点），然后再用 reduce 把匹配的项和断点组装起来（主要是为了实现大小写都保持原来的串）
      let list = label.split(reg);
      return list.reduce((sum: any, item: any, index: number) => {
        return (
          <>
            {sum}
            {/* 这里用 index - 1 是因为 reduce 第一次运行只是初始化，sum 为空，这时候这里不需要插值，第一次插值的位置在0和1之间而不是在0之前 */}
            <span className="active-keyword">{matchlist[index - 1]}</span>
            {item}
          </>
        );
      });
    };

    return (
      <span className="menu-title"
        onMouseLeave={(e) => {
          e.stopPropagation();
          editting_id === props.id && setEditting_id('');
        }}
      >
        {/* 每层节点显示的 label */}
        <span className="title-name">
          {
            keyword === '' || (new RegExp(keyword, 'gi')).test(props.label) === false
            ? props.label
            : highlight(props.label)
          }
        </span>
        {/* 工具们 */}
        {isLogin && 
          <div className="allIcon-box"
            onMouseEnter={(e) => {
              e.stopPropagation();
              editting_id !== props.id && setEditting_id(props.id);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              editting_id === props.id && setEditting_id('');
            }}
            >
            <Icon
              type="edit"
              title="操作该节点"
              className={`${editting_id === props.id ? 'editting' : ''} more-operate-icon`}
            />
            {editting_id !== '' && editting_id === props.id &&
              // 树节点操作的操作 icons
              <div className="icons-box" onClick={e => e.stopPropagation()}>
                {!props.isFirst && 
                  <Icon className="treenode-icon" title="向上移动" type="arrow-up" onClick={changeNodeSort.bind(null, 'up')}/>
                }
                {!props.isLast &&
                  <Icon className="treenode-icon" title="向下移动" type="arrow-down" onClick={changeNodeSort.bind(null, 'down')}/>
                }
                <Icon className="treenode-icon" title="编辑名称" type="edit" onClick={editTreeNode}/>
                {props.level !== 'level1' &&
                  <Icon className="treenode-icon" title="更换父节点" type="home" onClick={changeFather}/>
                }
                <Icon className="treenode-icon" title="删除节点" type="delete" onClick={removeTreeNode}/>
              </div>
            }
          </div>
        }
      </span>
    )
  };

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
      <div className="tree-filter">
        <Input className="tree-filter-input" value={keyword} onChange={handleKeyword} allowClear prefix={<Icon type="search"/>} />  
      </div>
      <Menu
        className="tree-menu"
        mode="inline"
        theme="dark"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
      >
        {/** 在上方添加一级节点 */
          isLogin && 
          <Menu.Item>
            <Icon
              className="add-root-treenode"
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
                key={item.id}
                onTitleClick={clickFirstLevel.bind(null, item.id)}
                title={
                  <TreeNodeItem
                    isFirst={index === 0}
                    isLast={index === treeList.length - 1}
                    level="level1"
                    label={item.label}
                    index={index}
                    id={item.id}
                    sort={item.sort}
                    previousSort={index !== 0 ? treeList[index - 1].sort : -1}
                    previousId={index !== 0 ? treeList[index - 1].id : ''}
                    nextSort={index !== treeList.length - 1 ? treeList[index + 1].sort : -1}
                    nextId={index !== treeList.length - 1 ? treeList[index + 1].id : ''}
                  />
                }>
                {/** 在上方添加二级节点 */
                  isLogin && 
                  <Menu.Item>
                    <Icon
                      className="add-root-treenode"
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
                        onTitleClick={clickSecondLevel.bind(null, item.id, jtem.id)}
                        title={
                          <TreeNodeItem
                            isFirst={jndex === 0}
                            isLast={jndex === item.children.length - 1}
                            level="level2"
                            label={jtem.label}
                            index={jndex}
                            id={jtem.id}
                            sort={jtem.sort}

                            previousSort={jndex !== 0 ? item.children[jndex - 1].sort : -1}
                            previousId={jndex !== 0 ? item.children[jndex - 1].id : ''}
                            nextSort={jndex !== item.children.length - 1 ? item.children[jndex + 1].sort : -1}
                            nextId={jndex !== item.children.length - 1 ? item.children[jndex + 1].id : ''}
                          />
                        }>
                        {/** 在上方添加三级节点 */
                          isLogin && 
                          <Menu.Item>
                            <Icon
                              className="add-root-treenode"
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
                                onClick={clickThirdLevel.bind(null, item.id, jtem.id, ktem.id)}
                                title={ktem.label}>
                                <TreeNodeItem
                                  isFirst={kndex === 0}
                                  isLast={kndex === jtem.children.length - 1}
                                  level="level3"
                                  label={ktem.label}
                                  index={kndex}
                                  id={ktem.id}
                                  sort={ktem.sort}

                                  previousSort={kndex !== 0 ? jtem.children[kndex - 1].sort : -1}
                                  previousId={kndex !== 0 ? jtem.children[kndex - 1].id : ''}
                                  nextSort={kndex !== jtem.children.length - 1 ? jtem.children[kndex + 1].sort : -1}
                                  nextId={kndex !== jtem.children.length - 1 ? jtem.children[kndex + 1].id : ''}
                                />
                              </Menu.Item>
                            )
                          })
                        }
                        {/** 在下方添加三级节点 */
                          isLogin && 
                          <Menu.Item>
                            <Icon
                              className="add-root-treenode"
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
                      className="add-root-treenode"
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
          isLogin && 
          <Menu.Item>
            <Icon
              className="add-root-treenode"
              type="plus-square"
              title="新增末位根节点"
              onClick={addNewTreeNode.bind(null, 'behind', '一级')}
            />
          </Menu.Item>
        }
      </Menu>
    </>
  );
}

export default withRouter(TreeMenu);
