import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
// import { withRouter, match } from 'react-router';
// import { History, Location } from 'history';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getChildName } from "@/client/TreeHelper";
import {
  getNodeCont,
  modifyNodeCont,
  deleteNodeCont,
  changeContSort,
  addNodeCont
} from "@/client/TreeContHelper";
import { staticUrl } from "@/env_config";
import { Input, Button, message, Modal } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  FileAddOutlined,
  SaveOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import ImageBox from "@/components/image-box";
import Loading from "@/components/loading";
import { ImgType } from '@/client/ImgHelper'

interface PropsType extends RouteComponentProps {
  first_id: string;
  second_id: string;
}

interface TreeContType {
  c_id: string; // 第三级树节点 id
  cont: string;
  cont_id: string; // 树内容每个节点的单独 id
  cTime: string;
  imgList: ImgType[];
  mTime: string;
  sort: number;
  title: string;
}

const TreeContEdit: React.FC<PropsType> = props => {
  const { match, first_id, second_id } = props;

  const scrollWrapper = useRef<any>(null)

  const { TextArea } = Input;

  const [contList, setContList] = useState<TreeContType[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    second_id && getTreeCont();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [second_id]);

  // 监听键盘事件，实现 Ctrl+s 保存
  useEffect(() => {
    const onKeyDown = (e: any) => {
      if (e.keyCode === 83 && e.ctrlKey) {
        e.preventDefault();
        saveTreeCont();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contList]);

  const [title, setTitle] = useState("");

  // 获取树详情所有信息
  const getTreeCont = async () => {
    setIsLoading(true);
    const res = await getChildName(second_id);
    setTitle(res || "");
    const res2 = await getNodeCont(second_id);
    if (res2) {
      setContList(res2);
    }
    setIsLoading(false);
  };

  /** 判断页面是否编辑过 */
  const [isChange, setIsChange] = useState(false);
  const handleChange = (
    cont_id: string,
    type: "title" | "content",
    newValue: string
  ) => {
    const newData = [...contList];
    const index = newData.findIndex(item => cont_id === item.cont_id);
    const item = newData[index];
    type === "title" && (item.title = newValue);
    type === "content" && (item.cont = newValue);
    newData.splice(index, 1, {
      ...item
    });
    setContList(newData);
    setIsChange(true);
  };

  // 新增内容节点
  const addTreeCont = async (addtype: "front" | "behind") => {
    const params = {
      id: second_id, // 子节点的id
      sort:
        addtype === "front"
          ? contList[0].sort
          : contList[contList.length - 1].sort,
      addtype: addtype
    };
    let res: any = await addNodeCont(params);
    if (res) {
      message.success("新增成功");
      getTreeCont();
    } else {
      message.error("新增失败");
    }
  };

  // 保存内容
  const saveTreeCont = async () => {
    const params: any = {
      c_id: second_id,
      list: contList
    };
    const res: any = await modifyNodeCont(params);
    if (res) {
      message.success(res);
      setIsChange(false);
    } else {
      message.error("修改失败");
    }
  };

  // 内容详情的单个节点的 icons
  const ContItemIcons = (props: {
    contLength: number; // 字数
    itemData: TreeContType;
    isFirst: boolean;
    isLast: boolean;
    index: number;
  }) => {
    const { confirm } = Modal;

    // 上移内容节点
    const upTreeContNode = async () => {
      let params = {
        thisContId: props.itemData.cont_id,
        thisSort: props.itemData.sort,
        otherContId: contList[props.index - 1].cont_id,
        otherSort: contList[props.index - 1].sort
      };
      let res: any = await changeContSort(params);
      if (res) {
        message.success("上移成功");
        getTreeCont();
      } else {
        message.error("上移失败");
      }
    };

    // 下移内容节点
    const downTreeContNode = async () => {
      let params = {
        thiscTime: props.itemData.cTime,
        thisSort: props.itemData.sort,
        othercTime: contList[props.index + 1].cTime,
        otherSort: contList[props.index + 1].sort
      };
      let res: any = await changeContSort(params);
      if (res) {
        message.success("上移成功");
        getTreeCont();
      } else {
        message.error("上移失败");
      }
    };

    // 删除内容节点
    const removeTreeContNode = () => {
      confirm({
        title: `你将删除"${props.itemData.title}"`,
        content: "Are you sure？",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          const params = {
            cont_id: props.itemData.cont_id
          }
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
        }
      });
    };

    return (
      <div className={styles.contitemIcons}>
        <div className={styles.contitemIconsBox}>
          {!props.isFirst && (
            <ArrowUpOutlined
              className={styles.contnodeIcon}
              title="向上移动"
              type="arrow-up"
              onClick={upTreeContNode}
            />
          )}
          {!props.isLast && (
            <ArrowDownOutlined
              className={styles.contnodeIcon}
              title="向下移动"
              type="arrow-down"
              onClick={downTreeContNode}
            />
          )}
          <DeleteOutlined
            className={styles.contnodeIcon}
            title="删除节点"
            type="delete"
            onClick={removeTreeContNode}
          />
        </div>
        <div className={styles.contitemTime}>
          <span>字数：{props.contLength}</span>
          <span>创建时间：{props.itemData.cTime}</span>
          <span>修改时间：{props.itemData.mTime}</span>
        </div>
      </div>
    );
  };

  const scrollTo = (type: 'top' | 'bottom') => {
    scrollWrapper.current.scroll({
      left: 0,
      top: type === 'top' ? 0 : Number.MAX_SAFE_INTEGER,
      behavior: 'smooth'
    })
    // scrollWrapper.current.scrollTop = type === 'top' ? 0 : Number.MAX_SAFE_INTEGER
  }

  return (
    <div className={styles.treecontedit}>
      {isLoading && (
        <div className={styles.mask}>
          <Loading />
        </div>
      )}
      <div className={`${styles.treeconteditWrapper} ScrollBar`} ref={scrollWrapper}>
        <h2 className={styles.treecontTitle}>{title}</h2>
        {contList.map((item, index) => {
          return (
            <div key={item.cont_id} className={styles.contitem}>
              <div className={styles.contitemEdit}>
                <Input
                  className={styles.contitemInput}
                  placeholder="请输入小标题"
                  value={item.title}
                  onChange={e =>
                    handleChange(item.cont_id, "title", e.target.value)
                  }
                />
                <TextArea
                  className={`${styles.contitemTextarea} ScrollBar`}
                  placeholder="请输入内容"
                  autoSize={{ minRows: 6, maxRows: 21 }}
                  value={item.cont}
                  onChange={e =>
                    handleChange(item.cont_id, "content", e.target.value)
                  }
                />
                <ContItemIcons
                  contLength={item.cont.replaceAll('\n', '').length} // 这里回车不算一个字符
                  itemData={item}
                  isFirst={index === 0}
                  isLast={index === contList.length - 1}
                  index={index}
                />
              </div>
              <div className={styles.contitemImg}>
                {/* 上传图片 */}
                <ImageBox
                  otherId={item.cont_id}
                  type="treecont"
                  imageUrl=""
                  imageMinUrl=""
                  initImgList={getTreeCont}
                  width="120px"
                  imageData={{}}
                />
                {/* 图片列表 */}
                {item.imgList.map((jtem: ImgType) => {
                  return (
                    <ImageBox
                      key={jtem.img_id}
                      type="treecont"
                      imageId={jtem.img_id}
                      imageName={jtem.imgname}
                      imageFileName={jtem.filename}
                      imageUrl={`${staticUrl}/img/treecont/${jtem.filename}`}
                      imageMinUrl={jtem.has_min === '1' ? `${staticUrl}/min-img/${jtem.filename}` : ''}
                      initImgList={getTreeCont}
                      width="120px"
                      imageData={jtem}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {/* 新增按钮 */}
      <Button
        className={styles.treecontAddbuttonFront}
        title="最上方新增一个节点"
        type="primary"
        shape="circle"
        icon={<FileAddOutlined />}
        size="large"
        onClick={addTreeCont.bind(null, "front")}
      />
      <Button
        className={styles.treecontAddbuttonBehind}
        title="最下方新增一个节点"
        type="primary"
        shape="circle"
        icon={<FileAddOutlined />}
        size="large"
        onClick={addTreeCont.bind(null, "behind")}
      />
      {/* 保存按钮 */}
      <Button
        className={styles.treecontSavebutton}
        title="保存"
        type={"primary"}
        danger={isChange}
        shape="circle"
        icon={<SaveOutlined />}
        size="large"
        onClick={saveTreeCont}
      />
      {/* 回到顶部 */}
      <Button
        className={styles.scrollToTop}
        title="回到顶部"
        type="primary"
        shape="circle"
        icon={<VerticalAlignTopOutlined />}
        size="large"
        onClick={scrollTo.bind(null, 'top')}
      />
      {/* 回到底部 */}
      <Button
        className={styles.scrollToBottom}
        title="回到底部"
        type="primary"
        shape="circle"
        icon={<VerticalAlignBottomOutlined />}
        size="large"
        onClick={scrollTo.bind(null, 'bottom')}
      />
    </div>
  );
};

export default withRouter(TreeContEdit);
