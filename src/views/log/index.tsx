import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import LogList from "./log-list";
import TagList from "./tag-list";
import { IsLoginContext } from "@/context/IsLoginContext";
import { LogContext } from "./LogContext";
import { addLogCont } from "@/client/LogHelper";
import { Button, message } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface PropsType extends RouteComponentProps {}

const Log: React.FC<PropsType> = props => {
  const { history } = props;

  const { isLogin } = useContext(IsLoginContext);
  const { setActiveTag } = useContext(LogContext);

  // 添加日志
  const addNewLog = async (type: "richtext" | "markdown") => {
    const params = {
      edittype: type
    };
    const res: any = await addLogCont(params);
    if (res) {
      message.success("新建成功");
      setActiveTag("");
      /** 新建成功直接跳转到新日志 */
      const newId = res.newid;
      const path = `/admin/log/${btoa(decodeURIComponent(newId))}`;
      history.push({
        pathname: path,
        state: {
          editType: type // 要带上日志类型
        }
      });
    } else {
      message.error("新建失败");
    }
  };

  return (
    <div className={styles.log}>
      <div className={styles.logLeft}>
        {isLogin && (
          // 新建日志
          <div className={styles.addLog}>
            <Button
              className={styles.addLogButton}
              title="新建富文本日志"
              type="primary"
              size="small"
              icon="file-text"
              onClick={addNewLog.bind(null, "richtext")}
            >
              新建富文本日志
            </Button>
            <Button
              className={styles.addLogButton}
              title="新建 MarkDown 日志"
              type="primary"
              size="small"
              icon="file-markdown"
              onClick={addNewLog.bind(null, "markdown")}
            >
              新建 markdown 日志
            </Button>
          </div>
        )}
        <TagList/>
      </div>
      <div className={`${styles.logRight} ScrollBar`}>
        {/* 日志列表 */}
        <LogList/>
      </div>
    </div>
  );
};

export default withRouter(Log);
