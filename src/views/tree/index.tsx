import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { IsLoginContext } from "@/context/IsLoginContext";
import TreeList from "./tree-list";
import { Icon } from '@ant-design/compatible'
import { Switch } from "antd";
import TreeCont from "./tree-cont";
import classnames from "classnames";
import { withRouter, RouteComponentProps, match } from "react-router-dom";

interface PropsType extends RouteComponentProps {
  match: match<{
    first_id: string;
    second_id: string;
  }>;
}

const Tree: React.FC<PropsType> = (props) => {
  const { match } = props;
  const { first_id, second_id } = match.params;
  const { isLogin } = useContext(IsLoginContext);

  const [showLeft, setShowLeft] = useState(true);

  const [isEdit, setIsEdit] = useState(false);
  const [isMain, setIsMain] = useState(true);

  useEffect(() => {
    setIsMain(JSON.stringify(match.params) === "{}");
  }, [match.params]);

  return (
    <div className={styles.Tree}>
      {/* 左边的树 */}
      <div
        className={`${styles.treeLeft} ${showLeft ? styles.show : styles.hide}`}
      >
        <TreeList first_id={first_id} second_id={second_id} />
        <Icon
          type={showLeft ? "left-square" : "right-square"}
          className={styles.showLeft}
          onClick={() => {
            setShowLeft(!showLeft);
          }}
        />
      </div>
      {/* 右边的展示 & 编辑 */}
      <div className={`${styles.treeRight}`}>
        {
          // 编辑与查看的切换按钮
          isLogin && (
            <Switch
              className={styles.treeEditSwitch}
              checkedChildren="编辑"
              unCheckedChildren="查看"
              defaultChecked={isEdit}
              onChange={() => setIsEdit(!isEdit)}
            />
          )
        }
        <TreeCont
          isMain={isMain}
          isEdit={isEdit}
          first_id={first_id}
          second_id={second_id}
        />
      </div>
    </div>
  );
};

export default withRouter(Tree);
