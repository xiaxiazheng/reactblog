import React from "react";
import styles from "./index.module.scss";
import { markdown } from "markdown";
// 挑选想用的 markdown 样式
import mdStyle from "./gitlab.module.scss";

interface PropsType {
  logcont: string;
}

const MarkdownShow: React.FC<PropsType> = (props) => {
  const { logcont } = props;

  return (
    <div
      className={`${styles.markdownShower} ${mdStyle.markdownShower}`}
      dangerouslySetInnerHTML={{
        __html: markdown.toHTML(logcont)
      }}
    />
  );
};

export default MarkdownShow;
