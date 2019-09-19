import React, {useState, useEffect} from 'react';
import './TreeContShow.scss';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { getChildName } from '../../client/TreeHelper';
import { getNodeCont } from '../../client/TreeContHelper';
import { baseImgUrl } from '../../env_config';

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

const TreeContShow: React.FC<PropsType> = ({ match }) => {

  useEffect(() => {
    getTreeCont();
  }, [match.params.third_id]);

  const [title, setTitle] = useState('');
  const [contList, setContList] = useState<TreeContType[]>([]);

  const getTreeCont = async () => {
    const res = await getChildName(match.params.third_id);
    setTitle(res.length !== 0 ? res[0].c_label : '');
    const res2 = await getNodeCont(match.params.third_id);
    res2 && setContList(res2);
  };

  return (
    <div className="treecontshow">
      <h2 className="treecont-title">{title}</h2>
      {
        contList.map(item => {
          return (
            <div key={item.cont_id} className="contitem">
              <h3 className="contitem-title">{item.title}</h3>
              <div className="contitem-cont" dangerouslySetInnerHTML={{ __html: item.cont }}></div>
              {item.imgList.length !== 0 &&
                item.imgList.map(imgItem => {
                  return (
                    <div key={imgItem.img_id} className="contitem-img">
                      <img src={baseImgUrl + '/treecont/' + imgItem.imgfilename} />
                      <span className="img-name">{imgItem.imgname}</span>
                    </div>
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  );
}

export default withRouter(TreeContShow);
