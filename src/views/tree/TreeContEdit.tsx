import React, {useState, useEffect} from 'react';
import './TreeContEdit.scss';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { getChildName } from '../../client/TreeHelper';
import { getNodeCont, modifyNodeCont, deleteNodeCont, changeContSort, addNodeCont } from '../../client/TreeContHelper';
import { baseImgUrl } from '../../env_config';
import { Input, Button, message, Icon, Modal } from 'antd';
import ImageBox from '../../common/ImageBox';

interface PropsType {
  history: History;
  match: match<{
    first_id: string;
    second_id: string;
    third_id: string;
  }>;
  location: Location;
};

interface ImageType {
  img_id: string;
  imgcTime: string;
  imgfilename: string;
  imgname: string;
}

interface TreeContType {
  c_id: string;  // 第三级树节点 id
  cont: string;
  cont_id: string;  // 树内容每个节点的单独 id
  createtime: string;
  imgList: ImageType[];
  motifytime: string;
  sort: number;
  title: string;
}

const TreeContEdit: React.FC<PropsType> = ({ match }) => {
  const { TextArea } = Input;

  const [contList, setContList] = useState<TreeContType[]>([]);

  useEffect(() => {
    getTreeCont();
  }, [match.params.third_id])

  // 监听键盘事件，TODO，暂时无法解决
  // useEffect(() => {
  //   const onKeyDown = (e: any) => {
  //     console.log('contList =', contList);
  //     if (e.keyCode === 83 && e.ctrlKey) {
  //       e.preventDefault();
  //       // saveTreeCont();
  //       message.error("这里有问题，没法获取到 contList ！！！");
  //     }
  //   }

  //   document.addEventListener("keydown", onKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", onKeyDown);
  //   }
  // }, []);


  const [title, setTitle] = useState('');

  // 获取树详情所有信息
  const getTreeCont = async () => {
    const res = await getChildName(match.params.third_id);
    setTitle(res.length !== 0 ? res[0].c_label : '');
    const res2 = await getNodeCont(match.params.third_id);
    res2 && setContList(res2);
  };

  const [isChange, setIsChange] = useState(false);  // 判断页面是否编辑过
  const handleChange = (cont_id: string, type: 'title' | 'content', newValue: string) => {
    const newData = [...contList];
    const index = newData.findIndex(item => cont_id === item.cont_id);
    const item = newData[index];
    type === 'title' && (item.title = newValue);
    type === 'content' && (item.cont = newValue);
    newData.splice(index, 1, {
      ...item
    });
    setContList(newData);
    setIsChange(true);
  }

  // 新增内容节点
  const addTreeCont = async () => {
    const params = {
      id: match.params.third_id, // 子节点的id
      sort: contList[contList.length - 1].sort
    };
    let res: any = await addNodeCont(params);
    if (res) {
      message.success('新增成功');
      getTreeCont();
    } else {
      message.error('新增失败');
    }
  };

  // 保存内容
  const saveTreeCont = async () => {
    const params: any = {
      id: match.params.third_id,
      list: contList
    };
    console.log(contList);
    const res: any = await modifyNodeCont(params);
    if (res) {
      message.success('修改成功');
      setIsChange(false);
    } else {
      message.error('修改失败');
    }
  };

  // 内容详情的单个节点的 icons
  const ContItemIcons = (props: {
    itemData: TreeContType;
    isFirst: boolean;
    isLast: boolean;
    index: number;
  }) => {
    const { confirm } = Modal;

    // 上移内容节点
    const upTreeContNode = async () => {
      let params = {
        thiscTime: props.itemData.createtime,
        thisSort: props.itemData.sort,
        othercTime: contList[props.index - 1].createtime,
        otherSort: contList[props.index - 1].sort,
      };
      let res: any = await changeContSort(params);
      if (res) {
        message.success('上移成功');
        getTreeCont();
      } else {
        message.error('上移失败');
      }
    };

    // 下移内容节点
    const downTreeContNode = async () => {
      let params = {
        thiscTime: props.itemData.createtime,
        thisSort: props.itemData.sort,
        othercTime: contList[props.index + 1].createtime,
        otherSort: contList[props.index + 1].sort,
      };
      let res: any = await changeContSort(params);
      if (res) {
        message.success('上移成功');
        getTreeCont();
      } else {
        message.error('上移失败');
      }
    };

    // 删除内容节点
    const removeTreeContNode = () => {
      confirm({
        title: `你将删除"${props.itemData.title}"`,
        content: 'Are you sure？',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: async () => {
          const params = {
            id: props.itemData.c_id,
            sort: props.itemData.sort
          };
          const res = await deleteNodeCont(params);
          if (res) {
            message.success("删除成功", 1);
            getTreeCont();
          } else {
            message.error("删除失败", 1);
          }
        },
        onCancel() {
          message.info("已取消删除", 1);
        },
      });
    };

    return (
      <div className="contitem-icons">
        <div className="contitem-icons-box">
          {!props.isFirst && 
            <Icon className="contnode-icon" title="向上移动" type="arrow-up" onClick={upTreeContNode}/>
          }
          {!props.isLast &&
            <Icon className="contnode-icon" title="向下移动" type="arrow-down" onClick={downTreeContNode}/>
          }
          <Icon className="contnode-icon" title="删除节点" type="delete" onClick={removeTreeContNode}/>
        </div>
        <div className="contitem-time">
          <span>创建时间：{props.itemData.createtime}</span>
          <span>修改时间：{props.itemData.motifytime}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="treecontedit">
        <h2 className="treecont-title">{title}</h2>
        {
          contList.map((item, index) => {
            return (
              <div key={item.cont_id} className="contitem">
                <div className="contitem-edit">
                  <Input className="contitem-input" placeholder="请输入小标题" value={item.title} onChange={(e) => handleChange(item.cont_id, 'title', e.target.value)}/>
                  <TextArea
                    className="contitem-textarea ScrollBar"
                    placeholder="请输入内容"
                    autosize={{ minRows: 6, maxRows: 21 }}
                    value={item.cont}
                    onChange={(e) => handleChange(item.cont_id, 'content', e.target.value)}
                  />
                  <ContItemIcons
                    itemData={item}
                    isFirst={index === 0}
                    isLast={index === contList.length - 1}
                    index={index}
                  />
                </div>
                <div className="contitem-img">
                  {item.imgList.map(jtem => {
                    return (
                      <ImageBox
                        key={jtem.img_id}
                        type="treecont"
                        imageId={jtem.img_id}
                        imageFileName={jtem.imgfilename}
                        imageUrl={`${baseImgUrl}/treecont/${jtem.imgfilename}`}
                        initImgList={getTreeCont}
                        width="120px"
                      />
                    )
                  })}
                  <ImageBox otherId={item.cont_id} type="treecont" imageUrl="" initImgList={getTreeCont} width="120px"/>
                </div>
              </div>
            )
          })
        }
      </div>
      {/* 新增按钮 */}
      <Button className="treecont-addbutton" title="新增一个节点" type="primary" shape="circle" icon="file-add" size="large" onClick={addTreeCont}/>
      {/* 保存按钮 */}
      <Button className="treecont-savebutton" title="保存" type={isChange ? "danger" : "primary"} shape="circle" icon="save" size="large" onClick={saveTreeCont}/>
    </>
  );
}

export default withRouter(TreeContEdit);
