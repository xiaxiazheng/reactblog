import React, {useState, useEffect, useContext} from 'react';
import './TreeMenu.scss';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { IsLoginContext } from '../../common/IsLoginContext';
import { getTree, addTreeNode, modifyTreeNode, deleteTreeNode, changeSort } from '../../client/TreeHelper';
import { Menu, Icon, message, Modal } from 'antd';

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

  // 刷新页面时匹配默认展开的树
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  useEffect(() => {
    if (match.params) {
      setOpenKeys([match.params.first_id, match.params.second_id]);
      setSelectedKeys([match.params.third_id]);
    }
  }, [match.params]);

  // 初始化页面
  useEffect(() => {
    getTreeData();
  }, []);

  // 初始化数据
  const [treeList, setTreeList] = useState<any[]>([]);
  const getTreeData = async () => {
    const res = await getTree(isLogin ? 'admin' : 'home');
    res && setTreeList(res);
  };

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

  // 单独新增第一级树节点
  const addFirstLevelTreeNode = async () => {
    const params = {
      level: 1,
      sort: treeList[treeList.length - 1].sort
    };
    const res = await addTreeNode(params);
    if (res) {
      message.success("新建一级节点成功");
      getTreeData();
      
    } else {
      message.error("新建一级节点失败");
    }
  }

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

    first_id?: string;  // 所属一级节点 id
    second_id?: string;  // 所属二级节点 id
    second_label?: string;
    second_sort?: number;
    lastChildrenSort?: number;  // 一二级的 children 最后一个节点的 sort
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

    // 新增第二级及第三级树节点
    const addNewTreeNode = async () => {
      let params = {};
      // 在该一级节点下新增一个二级节点
      if (props.level === 'level1') {
        params = {
          level: 2,
          category_id: props.first_id,
          sort: props.lastChildrenSort
        };
      }
      // 在该二级节点下新增一个三级节点
      if (props.level === 'level2') {
        params = {
          level: 3,
          category_id: props.first_id,
          id: props.second_id,
          label: props.second_label,
          f_sort: props.second_sort,
          c_sort: props.lastChildrenSort
        };
      }
      const res = await addTreeNode(params);
      if (res) {
        message.success(`新建${props.level === 'level1' ? '二级' : '三级'}节点成功`);
        getTreeData();
      } else {
        message.error(`新建${props.level === 'level1' ? '二级' : '三级'}节点失败`);
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
    };

    return (
      <span className="menu-title"
        onMouseLeave={(e) => {
          e.stopPropagation();
          editting_id === props.id && setEditting_id('');
        }}
      >
        <span className="title-name">{props.label}</span>
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
                {props.level !== 'level3' &&
                  <Icon className="treenode-icon" title="新增子节点" type="plus-square" onClick={addNewTreeNode}/>
                }
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

  return (
    <>
      <Menu
        className="tree-menu"
        mode="inline"
        theme="dark"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
      >
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

                    first_id={item.id}
                    lastChildrenSort={item.children[item.children.length - 1].sort}
                  />
                }>
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

                            first_id={item.id}
                            second_id={jtem.id}
                            second_label={jtem.label}
                            second_sort={jtem.sort}
                            lastChildrenSort={jtem.children[jtem.children.length - 1].sort}
                          />
                        }>
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
                      </SubMenu>
                    )
                  })
                }
              </SubMenu>
            )
          })
        }
        {isLogin && 
          <Menu.Item>
            <Icon className="add-root-treenode" type="plus-square" title="新增根节点" onClick={addFirstLevelTreeNode}/>
          </Menu.Item>
        }
      </Menu>
    </>
  );
}

export default withRouter(TreeMenu);
