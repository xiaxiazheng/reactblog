import React, { useState, useContext } from "react";
import styles from "./index.module.scss";
import { Icon, message, Modal, Select } from "antd";
import {
  isShowLog,
  isStickLog,
  deleteLogCont,
  makeLogTag
} from "@/client/LogHelper";
import { IsLoginContext } from "@/context/IsLoginContext";
import { LogListType } from "../../LogType";
import { LogContext } from "../../LogContext";

interface PropsType {
  // logClass: string;
  logItemData: LogListType;
  orderBy: "create" | "modify";
  getNewList: Function; // 完成操作后刷新数组
  // getAllLogClass: Function;
}

const { confirm } = Modal;
const { Option } = Select;

// 单条日志记录
const LogListItem: React.FC<PropsType> = props => {
  const { logItemData, orderBy, getNewList } = props;
  const { isLogin } = useContext(IsLoginContext);
  const { tagList } = useContext(LogContext);

  const [isShowPopup, setIsShowPopup] = useState(false);

  const [tag, setTag] = useState(logItemData.tag.map(item => item.tag_id));

  // 打开 tag 的弹窗
  const handleMakeLogTag = async (e: any) => {
    e.stopPropagation();
    setIsShowPopup(true);
  };

  // 切换分类：提交
  const submitMakeTag = async () => {
    const params = {
      log_id: logItemData.log_id,
      tagIdList: tag
    };
    const res = await makeLogTag(params);
    if (res) {
      message.success("切换分类成功", 1);
      getNewList();
      setIsShowPopup(false);
    } else {
      message.error("切换分类失败", 1);
    }
  };

  // 置顶
  const handleStickLog = async (e: any) => {
    e.stopPropagation();
    const params = {
      id: logItemData.log_id,
      isStick: logItemData.isStick === "true" ? "false" : "true"
    };
    let res = await isStickLog(params);
    if (res) {
      message.success("修改置顶状态成功");
      getNewList();
    } else {
      message.error("修改置顶状态失败");
    }
  };

  // 可见
  const handleShowLog = async (e: any) => {
    e.stopPropagation();
    const params = {
      id: logItemData.log_id,
      isShow: logItemData.isShow === "true" ? "false" : "true"
    };
    const res = await isShowLog(params);
    if (res) {
      message.success("修改可见状态成功");
      getNewList();
    } else {
      message.error("修改可见状态失败");
    }
  };

  // 删除
  const handleDeleteLog = (e: any) => {
    e.stopPropagation();
    confirm({
      title: `你将删除"${logItemData.title}"`,
      content: "Are you sure？",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const params = {
          id: logItemData.log_id
        };
        const res = await deleteLogCont(params);
        if (res) {
          message.success("删除成功", 1);
          getNewList();
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
    <div className={styles.logListItem}>
      <span className={styles.title} title={logItemData.title}>{logItemData.title}</span>
      <span className={styles.tagBox}>
        {logItemData.tag.map(item => {
          return <span className={styles.tag}>{item.tag_name}</span>;
        })}
      </span>
      <div>
        <span className={styles.author}>{logItemData.author}</span>
        {isLogin && (
          <span className={styles.editType}>
            ({logItemData.edittype === "richtext" ? "富文本文档" : "markdown"})
          </span>
        )}        
      </div>
      <span className={styles.orderbyTime}>
        {orderBy === "create" ? "创建" : "修改"}时间：
        {orderBy === "create" ? logItemData.cTime : logItemData.mTime}
      </span>
      {isLogin && (
        <div className={styles.logOperateBox}>
          <Icon
            onClick={handleMakeLogTag}
            className={`${logItemData.tag.length !== 0 ? styles.active : ""} ${
              styles.logOperateIcon
            }`}
            title={"点击设置该日志的 tag"}
            type="tags"
          />
          <Icon
            onClick={handleStickLog}
            className={`${
              logItemData.isStick === "true" ? styles.active : ""
            } ${styles.logOperateIcon}`}
            title={
              logItemData.isStick === "true" ? "点击取消置顶" : "点击置顶该日志"
            }
            type="vertical-align-top"
          />
          <Icon
            onClick={handleShowLog}
            className={`${logItemData.isShow === "true" ? styles.active : ""} ${
              styles.logOperateIcon
            }`}
            title={
              logItemData.isShow === "true" ? "当前日志可见" : "当前日志不可见"
            }
            type="eye"
          />
          <Icon
            onClick={handleDeleteLog}
            className={styles.logOperateIcon}
            title="点击删除该日志"
            type="delete"
          />
        </div>
      )}
      {/* 切换分类的弹出框 */}
      <div onClick={e => e.stopPropagation()}>
        <Modal
          title={`请选择要为 “${logItemData.title}” 设置的 tag：`}
          visible={isShowPopup}
          centered
          onOk={submitMakeTag}
          onCancel={() => setIsShowPopup(false)}
        >
          <Select
            mode="multiple"
            placeholder="请选择 tag"
            value={tag}
            style={{ width: 200 }}
            onChange={(val: any) => {
              setTag(val);
            }}
          >
            {tagList.map((item: { tag_id: string; tag_name: string }) => {
              return (
                <Option key={item.tag_id} value={item.tag_id}>
                  {item.tag_name}
                </Option>
              );
            })}
          </Select>
        </Modal>
      </div>
    </div>
  );
};

export default LogListItem;
