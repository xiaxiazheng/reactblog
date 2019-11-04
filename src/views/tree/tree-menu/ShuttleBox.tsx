import React from 'react';
import styles from './ShuttleBox.module.scss';
import { changeFather } from '../../../client/TreeHelper';
import { message, Modal, Select } from 'antd';

export interface ShuttleMsgType {
  title: string;
  level: string;
  id: string;
  defaultFatherId: string;
  shuttleFatherId: string;
  shuttleOptions: {id: string, label: string}[];
}

interface ShuttleBoxType {
  isShuttle: boolean;
  shuttleMsg: ShuttleMsgType;
  treeList: any[];
  handleShuttleChange: Function;
  confirmShuttle: Function;
  closeShuttle: Function;
}

/** 封装穿梭框 */
export const ShuttleBox = (props: ShuttleBoxType) => {
  const {
    title,
    level,
    id,
    defaultFatherId,
    shuttleFatherId,
    shuttleOptions,
  } = props.shuttleMsg;
  const {
    isShuttle,
    treeList,
    handleShuttleChange,
    confirmShuttle,
    closeShuttle,
  } = props;

  const { Option } = Select;

  // 更换父节点
  const changeFatherNode = async () => {
    if (defaultFatherId === shuttleFatherId) {
      message.warning('当前所选父节点与原来的相同');
      return;
    }

    let params: any = {};
    if (level === '2') {
      for (let item of treeList) {  // 二级节点穿梭，就要到一级节点找穿梭到的节点
        if (item.id === shuttleFatherId) {
          params = {
            shuttleLevel: Number(level),
            category_id: shuttleFatherId,
            f_sort:  item.children[item.children.length - 1].sort + 1,
            f_id: id
          };
          break;
        }
      }
    }
    if (level === '3') {  // 三级节点穿梭，就要到二级节点找穿梭到的节点
      for (let item of treeList) {
        let isfind = false;
        for (let jtem of item.children) {
          if (jtem.id === shuttleFatherId) {
            params = {
              shuttleLevel: Number(level),
              fatherid: jtem.id,
              fatherlabel: jtem.label,
              fathersort: jtem.sort,
              newchildsort: jtem.children[jtem.children.length - 1].sort + 1,
              childid: id
            };
            isfind = true;
            break;
          }
        }
        if (isfind) {
          break;
        }
      }
    }
    let res: any = await changeFather(params);
    if (res) {
      message.success('更换父节点成功');
      confirmShuttle();
    } else {
      message.error('更换父节点失败');
    }
  };

  const handleChange = (value: string) => {
    handleShuttleChange(value);
  }
  
  return (
    <Modal
      className={styles.shuttleBox}
      title={title}
      visible={isShuttle}
      onOk={changeFatherNode}
      onCancel={() => closeShuttle()}
    >
      <Select value={shuttleFatherId} style={{ width: 300 }} onChange={handleChange}>
        {shuttleOptions.map(item => {
          return (
            <Option key={item.id} value={item.id}>{item.label}</Option>
          )
        })}
      </Select>
    </Modal>
  )
}
