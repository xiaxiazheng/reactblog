import React, { useState, useContext } from "react";
import styles from "./index.module.scss";
import {
  modifyTreeNode,
  deleteTreeNode,
  changeSort,
  updateIsShow
} from "@/client/TreeHelper";
import { Icon } from '@ant-design/compatible'

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  RocketOutlined,
} from '@ant-design/icons';

import { message, Modal } from "antd";
import { IsLoginContext } from "@/context/IsLoginContext";
// import { match } from 'react-router';
import { TreeContext } from "../../TreeContext";
import { isShowLog } from "@/client/LogHelper";

interface TreeMenuItemType {
  second_id?: string;

  /** 父节点及其所有兄弟节点 */
  grandFatherChildren?: { id: string; label: string }[];
  /** 父节点 id */
  fatherId?: string;

  /** 是否是父节点唯一的节点 */
  isOnly: boolean;
  /** 是否第一个节点 */
  isFirst: boolean;
  /** 是否最后一个节点 */
  isLast: boolean;
  /** 节点级别 */
  level: string;
  /** 节点名称 */
  label: string;
  /** 节点 id */
  id: string;
  /** 节点是否显示 */
  isShow: "true" | "false";
  /** 节点顺序号 */
  sort: number;

  /** 上一个兄弟节点的顺序号 */
  previousSort: number;
  /** 上一个兄弟节点的 id */
  previousId: string;
  /** 下一个兄弟节点的顺序号 */
  nextSort: number;
  /** 下一个兄弟节点的 id */
  nextId: string;

  openShuttle?: Function;
  getTreeData: Function;
  keyword: string;
  /** 删除节点成功后的回调 */
  afterDelete: Function;
}

// 单个树节点
const TreeMenuItem = (props: TreeMenuItemType) => {
  const { setTreeContTitle } = useContext(TreeContext);

  const {
    second_id,
    fatherId,
    isOnly,
    isFirst,
    isLast,
    level,
    label,
    id,
    isShow,
    sort,
    previousSort,
    previousId,
    nextSort,
    nextId,
    openShuttle,
    getTreeData,
    keyword,
    afterDelete
  } = props;

  const { isLogin } = useContext(IsLoginContext);

  const { confirm } = Modal;

  // 上移下移
  const changeNodeSort = async (type: "up" | "down") => {
    let otherId: any = "";
    let otherSort: any = "";
    if (type === "up") {
      otherId = previousId;
      otherSort = previousSort;
    } else if (type === "down") {
      otherId = nextId;
      otherSort = nextSort;
    } else {
      message.error("上下移动出错");
      return;
    }

    const params = {
      otherId,
      otherSort,
      level: Number(level.split("").pop()),
      thisId: id,
      thisSort: sort
    };

    let res: any = await changeSort(params);
    if (res) {
      message.success(`${type === "up" ? "上移" : "下移"}成功`);
      getTreeData();
    } else {
      message.success(`${type === "up" ? "上移" : "下移"}失败`);
    }
  };

  // 编辑树节点
  const editTreeNode = async () => {
    const name = prompt(`请输入将${label}修改成的名称`, `${label}`);
    if (name !== "" && name !== null) {
      let params = {
        id: id,
        label: name,
        level: Number(level.split("").pop())
      };
      const res: any = await modifyTreeNode(params);
      if (res) {
        message.success("修改节点名称成功");
        getTreeData();
        // 如果修改的是当前已经点开的路由，则要修改 TreecontTitle
        if (second_id === String(id)) {
          setTreeContTitle(name);
        }
      } else {
        message.error("修改节点名称失败");
      }
    }
  };

  // 删除节点
  const removeTreeNode = async () => {
    if (isOnly) {
      message.error("当前节点的父节点仅有一个子节点，不能删除");
      return;
    }
    confirm({
      title: `你将删除节点"${label}"`,
      content: "Are you sure？",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const levelValue = Number(level.split("").pop());
        const params = {
          id: id,
          level: levelValue
        };
        const res = await deleteTreeNode(params);
        if (res) {
          message.success(`删除${levelValue}级节点成功`, 1);
          getTreeData();
          afterDelete(level, id);
        } else {
          message.error(`删除${levelValue}级节点失败`, 1);
        }
      },
      onCancel() {
        message.info("已取消删除", 1);
      }
    });
  };

  // 设置 label 中的关键字高亮
  const highlight = (label: any) => {
    // 先把匹配的项都找回出来（一个字符串会被多次匹配）
    let reg = new RegExp(keyword, "gi");
    let matchlist = label.match(reg);
    // 然后把匹配的位置给找出来（通过 split 打断点），然后再用 reduce 把匹配的项和断点组装起来（主要是为了实现大小写都保持原来的串）
    let list = label.split(reg);
    return list.reduce((sum: any, item: any, index: number) => {
      return (
        <>
          {sum}
          {/* 这里用 index - 1 是因为 reduce 第一次运行只是初始化，sum 为空，这时候这里不需要插值，第一次插值的位置在0和1之间而不是在0之前 */}
          <span className={styles.activeKeyword}>{matchlist[index - 1]}</span>
          {item}
        </>
      );
    });
  };

  // 改变显示/隐藏状态
  const changeIsShow = async (e: any) => {
    e.stopPropagation();
    const params = {
      level: Number(level.split("").pop()),
      id: id,
      isShow: isShow === "true" ? "false" : "true"
    };
    const res = await updateIsShow(params);
    if (res) {
      message.success(`修改节点状态为${isShow !== "true" ? "显示" : "隐藏"}成功`);
      getTreeData();
    } else {
      message.error(`修改节点状态为${isShow !== "true" ? "显示" : "隐藏"}失败`);
    }
  };

  // 记录展开节点操作框的项的 id
  const [editting_id, setEditting_id] = useState<string>("");

  return (
    <span
      className={styles.treeMenuItem}
      onMouseLeave={e => {
        e.stopPropagation();
        editting_id === id && setEditting_id("");
      }}
    >
      {/* 每层节点显示的 label */}
      <span className={`${styles.titleName}`} title={label}>
        {keyword === "" || new RegExp(keyword, "gi").test(label) === false
          ? label
          : highlight(label)}
      </span>
      {/* 工具们 */}
      {isLogin && (
        <div
          className={styles.allIconBox}
          onMouseEnter={e => {
            e.stopPropagation();
            editting_id !== id && setEditting_id(id);
          }}
          onMouseLeave={e => {
            e.stopPropagation();
            editting_id === id && setEditting_id("");
          }}
        >
          <Icon
            title="显示or隐藏节点"
            type={isShow === "true" ? "eye" : "eye-invisible"}
            className={`${editting_id === id ? styles.editting : ""} ${
              styles.moreOperateIcon
            } ${
              isShow === 'true' ? styles.isShow : ''
            }`}
            onClick={changeIsShow}
          />
          {editting_id !== "" && editting_id === id && (
            // 树节点操作的操作 icons
            <div className={styles.iconsBox} onClick={e => e.stopPropagation()}>
              {!isFirst && (
                <Icon
                  className={styles.treenodeIcon}
                  title="向上移动"
                  type="arrow-up"
                  onClick={changeNodeSort.bind(null, "up")}
                />
              )}
              {!isLast && (
                <Icon
                  className={styles.treenodeIcon}
                  title="向下移动"
                  type="arrow-down"
                  onClick={changeNodeSort.bind(null, "down")}
                />
              )}
              <Icon
                className={styles.treenodeIcon}
                title="编辑名称"
                type="edit"
                onClick={editTreeNode}
              />
              {level !== "level1" && (
                <Icon
                  className={styles.treenodeIcon}
                  title="更换父节点"
                  onClick={() => {
                    openShuttle && openShuttle(id, label, fatherId || "");
                  }}
                />
              )}
              <Icon
                className={styles.treenodeIcon}
                title="删除节点"
                type="delete"
                onClick={removeTreeNode}
              />
            </div>
          )}
        </div>
      )}
    </span>
  );
};

export default TreeMenuItem;
