import React, {useState, useEffect, useRef} from 'react';
import './TreeContShow.scss';
import { Modal } from 'antd';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { getChildName } from '../../client/TreeHelper';
import { getNodeCont } from '../../client/TreeContHelper';
import { baseImgUrl } from '../../env_config';
// 代码高亮
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark-reasonable.css';

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
};

interface TreeContType {
  c_id: string;
  cont: string;
  cont_id: string;
  createtime: string;
  imgList: ImageType[];
  motifytime: string;
  sort: number;
  title: string;
};

const TreeContShow: React.FC<PropsType> = ({ match, location }) => {
  const contShowRef = useRef(null);
  const contRef = useRef(null);

  const [previewImg, setPreviewImg] = useState('');
  const [previewImgName, setPreviewImgName] = useState('');

  useEffect(() => {
    match.params.third_id && getTreeCont();
  }, [match.params.third_id]);

  const [hashValue, setHashValue] = useState('');

  useEffect(() => {
    if (location.hash !== '') {
      // 获取哈希值（用的是 sort）
      let list = location.hash.split('');
      list.shift();  // 去掉 #
      setHashValue(list.join(''));
      // 锚点跳转
      let dom: any = document.getElementById(`${match.params.third_id}-${list.join('')}`);
      dom && dom.scrollIntoView();
    } else {
      // 这里是为了切换该组件实例时回到头部
      let dom: any = contShowRef.current;
      dom && dom.scrollIntoView();
    }

    return () => {
      setHashValue('');  // 这个设置回来，不然切换之后指定顺序的依然高亮
    }
  }, [location]);

  const [title, setTitle] = useState('');
  const [contList, setContList] = useState<TreeContType[]>([]);

  // 获取树当前节点具体内容数据
  const getTreeCont = async () => {
    const res = await getChildName(match.params.third_id);
    setTitle(res.length !== 0 ? res[0].c_label : '');
    let res2 = await getNodeCont(match.params.third_id);
    if (res2) {
      res2.forEach((item: any) => {
        item.cont = item.cont.replace(/</g, "&lt;"); // html标签的<转成实体字符,让所有的html标签失效
        item.cont = item.cont.replace(/&lt;pre/g, "<pre"); // 把pre标签转回来
        item.cont = item.cont.replace(/pre>\n/g, "pre>"); // 把pre后面的空格去掉
        item.cont = item.cont.replace(/&lt;\/pre>/g, "</pre>"); // 把pre结束标签转回来
        item.cont = item.cont.replace(/  /g, "&nbsp;&nbsp;"); // 把空格转成实体字符，以防多空格被合并
        item.cont = item.cont.replace(/\n|\r\n/g, "<br/>"); // 把换行转成br标签
      })
      setContList(res2);
    }
  };

  // 添加代码高亮
  useEffect(() => {
    let dom: any = contRef.current;
    if (dom) {
      document.querySelectorAll('pre').forEach((block: any) => {
        hljs.highlightBlock(block);
      });
    }
  });

  return (
    <div className="treecontshow" ref={contShowRef}>
      <h2 className="treecont-title">{title}</h2>
      {
        contList.map(item => {
          return (
            <div ref={contRef} key={item.cont_id} className="contitem">
              <h3 className="contitem-title">
                <a
                  href={`#${item.sort}`}
                  id={`${item.c_id}-${item.sort}`}
                  className={hashValue === `${item.sort}` ? 'active' : ''}
                >
                  {item.title}
                </a>
                <span>修改时间：{item.motifytime}</span>
              </h3>
              <div className="contitem-cont" dangerouslySetInnerHTML={{ __html: item.cont }}></div>
              {item.imgList.length !== 0 &&
                item.imgList.map(imgItem => {
                  return (
                    <div key={imgItem.img_id} className="contitem-img">
                      <img
                        src={baseImgUrl + '/treecont/' + imgItem.imgfilename}
                        alt={imgItem.imgname}
                        title={imgItem.imgname}
                        onClick={() => {
                          setPreviewImg(baseImgUrl + '/treecont/' + imgItem.imgfilename);
                          setPreviewImgName(imgItem.imgname);
                        }}
                      />
                      <span className="img-name">{imgItem.imgname}</span>
                    </div>
                  )
                })
              }
            </div>
          )
        })
      }
      {/* 锚点们 */}
      <div className="mao">
        {
          contList.map(item => {
            return (
              <a key={item.sort} href={`#${item.sort}`} className={hashValue === `${item.sort}` ? 'active' : ''}>{item.title}</a>
            )
          })
        }
      </div>
      {/* 图片预览 */}
      <Modal
        wrapClassName="previewImgBox-wrapper ScrollBar"
        className="previewImgBox"
        visible={previewImg !== ''}
        footer={null}
        centered
        title={previewImgName}
        onCancel={() => {
          setPreviewImg('');
          setPreviewImgName('');
        }}>
        <img src={previewImg} alt={previewImgName} title={previewImgName} />
      </Modal>
    </div>
  );
}

export default withRouter(TreeContShow);
