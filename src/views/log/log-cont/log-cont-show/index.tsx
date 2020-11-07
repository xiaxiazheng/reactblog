import React, { useState, useEffect, useRef, useContext } from "react";
import { OneLogType } from "@/views/log/LogType";
import styles from "./index.module.scss";
import { getLogCont } from "@/client/LogHelper";
import Loading from "@/components/loading";
import classnames from "classnames";
import { IsLoginContext } from "@/context/IsLoginContext";
import { Button, message } from "antd";
import { addVisits } from "@/client/LogHelper";
import LogContMao from "../log-cont-mao";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Icon } from "@ant-design/compatible";

import MarkdownShow from "../markdown-show";
import RichtextShow from "../richtext-show";

interface PropsType extends RouteComponentProps {
  log_id: string;
}

const LogContShow: React.FC<PropsType> = (props) => {
  const { history, log_id } = props

  const [edittype, setEdittype] = useState<"richtext" | "markdown">("richtext");
  const [loading, setLoading] = useState(true);

  const { isLogin } = useContext(IsLoginContext);

  const logcontShowWrapper = useRef<any>(null);

  const [logdata, setlogdata] = useState<OneLogType>();
  const [visits, setVisits] = useState<Number>();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      let id = decodeURIComponent(atob(log_id));
      const res: OneLogType = await getLogCont(id);
      if (res) {
        setVisits(res.visits);
        setlogdata(res);
        setEdittype(res.edittype);
        setLoading(false);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log_id]);

  // 统计访问量
  useEffect(() => {
    let visit: any;
    if (logdata) {
      visit = setTimeout(async () => {
        const res1 = await addVisits({
          log_id: decodeURIComponent(atob(log_id)),
          visits: Number(visits),
        });
        isLogin && message.success(res1.message, 1);
        setVisits(res1.data.visits);
      }, 12000);
    }

    return () => {
      clearTimeout(visit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logdata]);

  const className = classnames({
    [styles.logcontShow]: true,
    ScrollBar: true,
  });

  // 回到顶部或底部
  const scrollTo = (type: "top" | "bottom") => {
    logcontShowWrapper.current.scroll({
      left: 0,
      top: type === "top" ? 0 : Number.MAX_SAFE_INTEGER,
      behavior: "smooth",
    });
    // contShowRef.current.scrollTop = type === 'top' ? 0 : Number.MAX_SAFE_INTEGER
  };

  // 导出到 pdf
  const exportPdf = () => {
    history.push({
      pathname: "/pdf",
      state: {
        type: edittype,
        logdata: logdata,
      },
    });
  };

  return (
    <div className={className} ref={logcontShowWrapper}>
      {loading ? (
        <Loading />
      ) : (
        logdata && (
          <>
            <div className={styles.title}>{logdata.title}</div>
            <div className={styles.author}>{logdata.author}</div>
            <div className={styles.time}>
              <span>创建时间: {logdata.cTime}</span>
              <span>修改时间: {logdata.mTime}</span>
              {isLogin && <span>访问量：{visits}</span>}
            </div>
            {
              // 富文本展示
              edittype === "richtext" && (
                <RichtextShow logcont={logdata.logcont} />
              )
            }
            {
              // markdown 展示
              edittype === "markdown" && (
                <MarkdownShow logcont={logdata.logcont} />
              )
            }
          </>
        )
      )}
      {/* 导出到 pdf 按钮 */}
      <Button
        className={styles.exportPdf}
        // type={'danger'}
        onClick={exportPdf}
      >
        <Icon type="file-pdf" />
        导出
      </Button>
      {/* 回到顶部 */}
      <Button
        className={styles.scrollToTop}
        title="回到顶部"
        type="primary"
        shape="circle"
        icon="vertical-align-top"
        size="large"
        onClick={scrollTo.bind(null, "top")}
      />
      {/* 回到底部 */}
      <Button
        className={styles.scrollToBottom}
        title="回到底部"
        type="primary"
        shape="circle"
        icon="vertical-align-bottom"
        size="large"
        onClick={scrollTo.bind(null, "bottom")}
      />
      {/* 锚点 */}
      {logdata && <LogContMao logcont={logdata.logcont} />}
    </div>
  );
};

export default withRouter(LogContShow);
