import React, { useState, useEffect, useRef, useContext } from "react";
import { OneLogType } from "../../LogType";
import styles from "./index.module.scss";
import { getLogCont } from "@/client/LogHelper";
import Loading from "@/components/loading";
import classnames from "classnames";
import { IsLoginContext } from "@/context/IsLoginContext";
// 代码高亮
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark-reasonable.css";
// 富文本编辑器
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { markdown } from "markdown";
import mdStyle from "../mdShower.module.scss";
import { Button, message } from "antd";
import { addVisits } from "@/client/LogHelper";
import logCont from "..";
import LogContMao from "../log-cont-mao";

interface PropsType {
  log_id: string;
}

const LogContShow: React.FC<PropsType> = ({ log_id }) => {
  const [edittype, setEdittype] = useState<"richtext" | "markdown">("richtext");
  const [loading, setLoading] = useState(true);

  const { isLogin } = useContext(IsLoginContext);

  const logcontShowWrapper = useRef<any>(null);

  // 编辑器配置
  const modules: any = {
    syntax: {
      highlight: (text: any) => hljs.highlightAuto(text).value,
    },
    clipboard: {
      // 这个设置是防止每次保存都有莫名其妙的空行“<p><br></p>”插入到内容中
      matchVisual: false,
    },
  };

  const [logdata, setlogdata] = useState<OneLogType>();
  const [markdownHtml, setMarkdownHtml] = useState<any>();
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

        if (res.edittype === "markdown") {
          setMarkdownHtml({
            __html: markdown.toHTML(res.logcont),
          });
        }
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log_id]);

  useEffect(() => {
    if (logdata) {
      // TODO，这里要获取所有的 <hX> 的标签内容，卡在了正则上面
      // const cont: any = logdata.logcont;
      // console.dir(cont)
      // console.log(cont.matchAll(new RegExp(/<h/)))
    }
  }, [logdata]);

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
      }, 8000);
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

  const scrollTo = (type: "top" | "bottom") => {
    logcontShowWrapper.current.scroll({
      left: 0,
      top: type === "top" ? 0 : Number.MAX_SAFE_INTEGER,
      behavior: "smooth",
    });
    // contShowRef.current.scrollTop = type === 'top' ? 0 : Number.MAX_SAFE_INTEGER
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
                <div className={styles.logcontEditor}>
                  <ReactQuill
                    readOnly
                    theme="bubble"
                    value={logdata.logcont}
                    modules={modules}
                  />
                </div>
              )
            }
            {
              // markdown 展示
              edittype === "markdown" && (
                <div
                  className={`${styles.markdownShower} ${mdStyle.markdownShower}`}
                  dangerouslySetInnerHTML={markdownHtml}
                />
              )
            }
          </>
        )
      )}
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

export default LogContShow;
