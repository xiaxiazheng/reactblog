import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./index.module.scss";
// import { withRouter, match } from 'react-router';
// import { History, Location } from 'history';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getChildName } from "@/client/TreeHelper";
import { getNodeCont } from "@/client/TreeContHelper";
import { baseUrl } from "@/env_config";
import Loading from "@/components/loading";
import PreviewImage from "@/components/preview-image/PreviewImage";
import { TreeContext } from "../../TreeContext";
import { default as imgPlaceHolder } from "@/assets/loading.svg";
// 代码高亮
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark-reasonable.css";

interface PropsType extends RouteComponentProps {
  first_id: string;
  second_id: string;
}

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

const TreeContShow: React.FC<PropsType> = props => {
  const { match, location, first_id, second_id } = props;
  const { treeContTitle, setTreeContTitle } = useContext(TreeContext);

  const contShowRef = useRef(null);
  const contRef = useRef(null);

  const [previewImg, setPreviewImg] = useState("");
  const [previewImgName, setPreviewImgName] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('second_id', second_id);
    
    second_id && getTreeCont();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [second_id]);

  const [hashValue, setHashValue] = useState("");

  useEffect(() => {
    if (location.hash !== "") {
      // 获取哈希值（用的是 sort）
      let list = location.hash.split("");
      list.shift(); // 去掉 #
      setHashValue(list.join(""));
      // 锚点跳转
      let dom: any = document.getElementById(
        `${second_id}-${list.join("")}`
      );
      dom && dom.scrollIntoView();
    } else {
      // 这里是为了切换该组件实例时回到头部
      let dom: any = contShowRef.current;
      dom && dom.scrollIntoView();
    }

    return () => {
      setHashValue(""); // 这个设置回来，不然切换之后指定顺序的依然高亮
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const [contList, setContList] = useState<TreeContType[]>([]);

  // 获取树当前节点具体内容数据
  const getTreeCont = async () => {
    setLoading(true);

    // 获取标题，标题存到了 TreeContext
    const res = await getChildName(second_id);
    res && setTreeContTitle(res.length !== 0 ? res[0].c_label : "");

    // 获取数据
    let res2 = await getNodeCont(second_id);
    if (res2) {
      res2.forEach((item: any) => {
        item.cont = item.cont.replace(/</g, "&lt;"); // html标签的<转成实体字符,让所有的html标签失效
        item.cont = item.cont.replace(/&lt;pre/g, "<pre"); // 把pre标签转回来
        item.cont = item.cont.replace(/pre>\n/g, "pre>"); // 把pre后面的空格去掉
        item.cont = item.cont.replace(/&lt;\/pre>/g, "</pre>"); // 把pre结束标签转回来
        item.cont = item.cont.replace(/ {2}/g, "&nbsp;&nbsp;"); // 把空格转成实体字符，以防多空格被合并
        item.cont = item.cont.replace(/\n|\r\n/g, "<br/>"); // 把换行转成br标签
      });
      setContList(res2);
      setLoading(false);
    }
  };

  // 添加代码高亮
  useEffect(() => {
    let dom: any = contRef.current;
    if (dom) {
      document.querySelectorAll("pre").forEach((block: any) => {
        hljs.highlightBlock(block);
      });
    }
  });

  // 保存所有图片的 ref
  const [refMap, setResMap] = useState<any>({});
  useEffect(() => {
    const map: any = {};
    contList.forEach(item => {
      item.imgList.forEach(jtem => {
        let imgId: string = jtem.img_id;
        map[imgId] = React.createRef();
      });
    });
    setResMap(map);
  }, [contList]);
  // 交叉观察器加载图片
  useEffect(() => {
    let observer = new IntersectionObserver(entries => {
      entries.forEach(item => {
        if (item.isIntersecting) {
          const img: any = item.target;
          if (encodeURI(img["dataset"]["src"]) !== img["src"]) {
            img["src"] = img["dataset"]["src"];
          }
        }
      });
    });
    const list = Object.keys(refMap).map(item => refMap[item]);
    list.forEach(
      item => item.current !== null && observer.observe(item.current)
    );
  }, [refMap]);

  return (
    <div className={styles.treecontshow} ref={contShowRef}>
      {loading && <Loading /> }
      {
        <>
          <h2 className={styles.treecontTitle}>{treeContTitle}</h2>
          {contList.map(item => {
            return (
              <div ref={contRef} key={item.cont_id} className={styles.contitem}>
                <h3 className={styles.contitemTitle}>
                  <a
                    href={`#${item.sort}`}
                    id={`${item.c_id}-${item.sort}`}
                    className={hashValue === `${item.sort}` ? "active" : ""}
                  >
                    {item.title}
                  </a>
                  <span>修改时间：{item.motifytime}</span>
                </h3>
                <div
                  className={styles.contitemCont}
                  dangerouslySetInnerHTML={{ __html: item.cont }}
                ></div>
                {item.imgList.length !== 0 &&
                  item.imgList.map(imgItem => {
                    return (
                      <div key={imgItem.img_id} className={styles.contitemImg}>
                        <img
                          ref={refMap[imgItem.img_id]}
                          src={imgPlaceHolder}
                          data-src={
                            baseUrl + "/treecont/" + imgItem.imgfilename
                          }
                          alt={imgItem.imgname}
                          title={imgItem.imgname}
                          onClick={() => {
                            setPreviewImg(
                              baseUrl + "/treecont/" + imgItem.imgfilename
                            );
                            setPreviewImgName(imgItem.imgname);
                          }}
                        />
                        <span className={styles.imgName}>
                          {imgItem.imgname}
                        </span>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </>
      }
      {/* 锚点们 */}
      <div className={styles.mao}>
        {loading && <Loading />}
        {
          contList.map(item => {
            return (
              <a
                key={item.sort}
                href={`#${item.sort}`}
                className={hashValue === `${item.sort}` ? "active" : ""}
              >
                {item.title}
              </a>
            );
          })
        }
      </div>
      {/* 图片预览 */}
      <PreviewImage
        isPreview={previewImg !== ""}
        imageName={previewImgName}
        imageUrl={previewImg}
        closePreview={() => {
          setPreviewImg("");
          setPreviewImgName("");
        }}
      />
    </div>
  );
};

export default withRouter(TreeContShow);