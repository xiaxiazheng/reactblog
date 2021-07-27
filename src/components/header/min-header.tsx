import React from 'react';
import styles from './index.module.scss';
import { Drawer } from "antd";
import { Icon } from "@ant-design/compatible";

interface Props {
  visible: boolean;
  setVisible: Function;
}

const MinHeader: React.FC<Props> = (props) => {
  const { visible, setVisible } = props;

    return (
        <>
              {/* 移动端展示 */}
      {window.screen.availWidth <= 720 && (
        <>
          <Drawer
            // title="Basic Drawer"
            placement="left"
            closable={false}
            onClose={() => {
              setVisible(!visible);
            }}
            className={styles.drawer}
            width={"calc(100% - 80px)"}
            visible={visible}
          >
            {props.children}
          </Drawer>
          <div
            className={styles.drawerControl}
            onClick={() => setVisible(true)}
          >
            <Icon type="home" className={styles.headerIcon} />
          </div>
        </>
      )}
      </>
    )
}

export default MinHeader;