import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './TreeContShow.module.scss';
import { withRouter, match } from 'react-router';
import { History, Location } from 'history';
import { getChildName } from '@/client/TreeHelper';
import { getNodeCont } from '@/client/TreeContHelper';
import { baseUrl } from '@/env_config';
import Loading from '@/components/loading/Loading';
import PreviewImage from '@/components/preview-image/PreviewImage';
import { TreeContext } from '../../TreeContext';
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
  const { treeContTitle, setTreeContTitle } = useContext(TreeContext);

  const contShowRef = useRef(null);
  const contRef = useRef(null);

  const [previewImg, setPreviewImg] = useState('');
  const [previewImgName, setPreviewImgName] = useState('');

  const [loading, setLoading] = useState(true);

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

  const [contList, setContList] = useState<TreeContType[]>([]);

  // 获取树当前节点具体内容数据
  const getTreeCont = async () => {
    setLoading(true);

    // 获取标题，标题存到了 TreeContext
    const res = await getChildName(match.params.third_id);
    setTreeContTitle(res.length !== 0 ? res[0].c_label : '');

    // 获取数据
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
      setLoading(false);
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
    <div className={styles.treecontshow} ref={contShowRef}>
      {loading ? <Loading width={300} /> :
        <>
          <h2 className={styles.treecontTitle}>{treeContTitle}</h2>
          {
            contList.map(item => {
              return (
                <div ref={contRef} key={item.cont_id} className={styles.contitem}>
                  <h3 className={styles.contitemTitle}>
                    <a
                      href={`#${item.sort}`}
                      id={`${item.c_id}-${item.sort}`}
                      className={hashValue === `${item.sort}` ? 'active' : ''}
                    >
                      {item.title}
                    </a>
                    <span>修改时间：{item.motifytime}</span>
                  </h3>
                  <div className={styles.contitemCont} dangerouslySetInnerHTML={{ __html: item.cont }}></div>
                  {item.imgList.length !== 0 &&
                    item.imgList.map(imgItem => {
                      return (
                        <div key={imgItem.img_id} className={styles.contitemImg}>
                          <img
                            src={baseUrl + '/treecont/' + imgItem.imgfilename}
                            alt={imgItem.imgname}
                            title={imgItem.imgname}
                            onClick={() => {
                              setPreviewImg(baseUrl + '/treecont/' + imgItem.imgfilename);
                              setPreviewImgName(imgItem.imgname);
                            }}
                          />
                          <span className={styles.imgName}>{imgItem.imgname}</span>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </>
      }
      {/* 锚点们 */}
      <div className={styles.mao}>
        {loading ? <Loading width={80} /> :
          contList.map(item => {
            return (
              <a key={item.sort} href={`#${item.sort}`} className={hashValue === `${item.sort}` ? 'active' : ''}>{item.title}</a>
            )
          })
        }
      </div>
      {/* 图片预览 */}
      <PreviewImage
        isPreview={previewImg !== ''}
        imageName={previewImgName}
        imageUrl={previewImg}
        closePreview={() => {
          setPreviewImg('');
          setPreviewImgName('');
        }}
      />
    </div>
  );
}

export default withRouter(TreeContShow);
