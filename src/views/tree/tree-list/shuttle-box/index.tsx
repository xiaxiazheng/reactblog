import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { changeFather } from "@/client/TreeHelper";
import { message, Modal, Select } from "antd";

export interface ShuttleMsgType {
  c_label: string;
  c_id: string;
  f_id: string;
  options: { f_id: string; f_label: string; f_sort: number; last_child_sort: number }[];
}

interface ShuttleBoxType {
  isShuttle: boolean;
  shuttleMsg: ShuttleMsgType;
  treeList: any[];
  confirmShuttle: Function;
  closeShuttle: Function;
}

const { Option } = Select;

/** 封装穿梭框 */
export const ShuttleBox = (props: ShuttleBoxType) => {
  const {
    isShuttle,
    shuttleMsg,
    confirmShuttle,
    closeShuttle
  } = props;
  const {
    c_label,
    c_id,
    f_id,
    options
  } = shuttleMsg;

  const [newFId, setNewFId] = useState<string>();
  useEffect(() => {
    setNewFId(f_id)
  }, [f_id])

  // 更换父节点
  const changeFatherNode = async () => {
    if (newFId === f_id) {
      message.warning("当前所选父节点与原来的相同");
      return;
    }

    let params: any = {};
    for (let item of options) {
      if (item.f_id === newFId) {
        params = {
          f_id: newFId,
          f_label: item.f_label,
          f_sort: item.f_sort,
          new_c_sort: item.last_child_sort + 1,
          c_id: c_id
        };
        break;
      }
    }
    let res: any = await changeFather(params);
    if (res) {
      message.success("更换父节点成功");
      confirmShuttle();
    } else {
      message.error("更换父节点失败");
    }
  };

  const handleChange = (value: string) => {
    setNewFId(value)
  };

  return (
    <Modal
      className={styles.shuttleBox}
      title={`请选择将'${c_label}'移动到的父节点：`}
      open={isShuttle}
      onOk={changeFatherNode}
      onCancel={() => closeShuttle()}
    >
      <Select
        value={newFId}
        style={{ width: 300 }}
        onChange={handleChange}
      >
        {options.map(item => {
          return (
            <Option key={item.f_id} value={item.f_id}>
              {item.f_label}
            </Option>
          );
        })}
      </Select>
    </Modal>
  );
};
