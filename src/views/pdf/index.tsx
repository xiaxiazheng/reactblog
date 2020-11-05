import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import mdStyle from "@/views/log/log-cont/mdShower.module.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";
import PrintRichtext from "./print-richtext";
import PrintMarkdown from "./print-markdown";

interface IPDF extends RouteComponentProps {}

const PDF: React.FC<IPDF> = (props) => {
  const { state } = props.location;

  const [logType, setLogType] = useState<"richtext" | "markdown" | "">("");
  const [markHtml, setMarkHtml] = useState({
    __html: "",
  });
  const [logcont, setLogCont] = useState<any>();

  useEffect(() => {
    let myState: any = state;
    if (myState && myState.type) {
      setLogType(myState.type);
      myState.type === "richtext" && setLogCont(myState.logcont);
      myState.type === "markdown" && setMarkHtml(myState.html);
    }
  }, [state]);

  useEffect(() => {
    if (logType !== "") {
      window.print();
    }
  }, [logType]);

  return (
    <div className={`${styles.pdf} ScrollBar`}>
      {/* 打印 markdown */}
      {logType === "markdown" && <PrintMarkdown markHtml={markHtml} />}
      {/* 打印富文本 */}
      {logType === "richtext" && <PrintRichtext logcont={logcont} />}
    </div>
  );
};

export default withRouter(PDF);
