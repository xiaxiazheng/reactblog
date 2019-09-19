import React, {useState, useEffect} from 'react';
import './TreeContEdit.scss';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { getChildName } from '../../client/TreeHelper';
import { getNodeCont, modifyNodeCont } from '../../client/TreeContHelper';
import { baseImgUrl } from '../../env_config';
import { Input, Button, message } from 'antd';

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
  c_id: string;
  cont: string;
  cont_id: string;
  createtime: string;
  imgList: ImageType[];
  motifytime: string;
  sort: number;
  title: string;
}

const TreeContEdit: React.FC<PropsType> = ({ match }) => {
  const { TextArea } = Input;

  useEffect(() => {
    getTreeCont();
  }, [match.params.third_id])

  const [title, setTitle] = useState('');
  const [contList, setContList] = useState<TreeContType[]>([]);

  const getTreeCont = async () => {
    const res = await getChildName(match.params.third_id);
    setTitle(res.length !== 0 ? res[0].c_label : '');
    const res2 = await getNodeCont(match.params.third_id);
    res2 && setContList(res2);
  };

  const [isChange, setIsChange] = useState(false);  // 页面是否编辑过
  const handleChange = (cont_id: string, type: string, newValue: string) => {
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

  // 保存内容
  const saveTreeCont = async () => {
    const params: any = {
      id: match.params.third_id,
      list: contList
    };
    const res: any = await modifyNodeCont(params);
    if (res) {
      message.success('修改成功');
      setIsChange(true);
    } else {
      message.error('修改失败');
    }
  };

  return (
    <>
      <div className="treecontedit">
        <h2>{title}</h2>
        {
          contList.map(item => {
            return (
              <div key={item.cont_id} className="contitem-edit">
                <Input placeholder="请输入小标题" value={item.title} onChange={(e) => handleChange(item.cont_id, 'title', e.target.value)}/>
                <TextArea
                  placeholder="请输入内容"
                  autosize={{ minRows: 2, maxRows: 6 }}
                  value={item.cont}
                  onChange={(e) => handleChange(item.cont_id, 'content', e.target.value)}
                />
              </div>
            )
          })
        }
      </div>
      <Button type={isChange ? "danger" : "primary"} shape="circle" icon="save" size="large" onClick={saveTreeCont}/>
    </>
  );
}

export default withRouter(TreeContEdit);
