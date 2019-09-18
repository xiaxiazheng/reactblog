import React, {useState, useEffect, useContext} from 'react';
import './TreeMenu.scss';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { IsLoginContext } from '../../common/IsLoginContext';
import { getTree } from '../../client/TreeHelper';
import { Menu, Icon, message } from 'antd';

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
    const res = await getTree('admin');
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

  const IconsBox = () => {
    return (
      <div className="icons-box">
        <Icon type="edit" onClick={mymsg}/>
      </div>
    )
  };

  const mymsg = () => {
    message.success("yes i do");
  };

  // 记录展开节点操作框的项的 id
  const [editting_id, setEditting_id] = useState<string>('');

  return (
    <>
      <Menu
        className="tree-menu"
        mode="inline"
        theme="dark"
        openKeys={openKeys}
        selectedKeys={selectedKeys}>
        {/** 第一层 */
          treeList.map((item) => {
            return (
              <SubMenu
                key={item.id}
                onTitleClick={clickFirstLevel.bind(null, item.id)}
                title={
                  <span className="menu-title">
                    <span className="title-name">{item.label}</span>
                    <Icon
                      type="edit"
                      className="more-operate-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditting_id(editting_id !== item.id ? item.id : '');
                      }}
                    />
                    {editting_id !== '' && editting_id === item.id &&
                      <IconsBox />
                    }
                  </span>
                }>
                {/** 第二层 */
                  item.children.map((jtem: any) => {
                    return (
                      <SubMenu title={jtem.label} key={jtem.id} onTitleClick={clickSecondLevel.bind(null, item.id, jtem.id)}>
                        {/** 第三层 */
                          jtem.children.map((ktem: any) => {
                            return (
                              <Menu.Item key={ktem.id} title={ktem.label} onClick={clickThirdLevel.bind(null, item.id, jtem.id, ktem.id)}>
                                {ktem.label}
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
      </Menu>
    </>
  );
}

export default withRouter(TreeMenu);
