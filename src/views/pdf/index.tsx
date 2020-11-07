import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";
import MarkdownShow from "@/views/log/log-cont/markdown-show";
import RichtextShow from "@/views/log/log-cont/richtext-show";
import rhStyles from "@/views/log/log-cont/log-cont-show/index.module.scss";

interface IPDF extends RouteComponentProps {}

const PDF: React.FC<IPDF> = (props) => {
  const { state } = props.location;

  const [logType, setLogType] = useState<"richtext" | "markdown" | "">("");
  const [logdata, setLogdata] = useState<any>();

  useEffect(() => {
    let myState: any = state;
    if (myState && myState.type) {
      setLogType(myState.type);
      setLogdata(myState.logdata);
    }
  }, [state]);

  useEffect(() => {
    if (logType !== "") {
      // 这里在下一个宏任务才执行打印，因为 MarkdownShow 需要拿到 logcont 之后再做一次转换才能渲染
      // setTimeout(() => {
      window.print();
      // }, 0)
    }
  }, [logType]);

  return (
    <div className={`${styles.pdf} ScrollBar`}>
      {/* 打印 markdown */}
      {logType === "markdown" && <MarkdownShow logcont={logdata.logcont} />}
      {/* 打印富文本 */}
      {logType === "richtext" && (
        <div className={rhStyles.logcontShow}>
          <div className={rhStyles.title}>{logdata.title}</div>
          <div className={rhStyles.author}>{logdata.author}</div>
          <RichtextShow logcont={logdata.logcont} />
        </div>
      )}
    </div>
  );
};

export default withRouter(PDF);
