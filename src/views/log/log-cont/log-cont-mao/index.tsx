import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface PropsType extends RouteComponentProps {
  logcont: string;
  closeDrawer?: Function;
}

const LogCont: React.FC<PropsType> = (props) => {
  const { logcont, closeDrawer } = props;
  const [maoList, setMaoList] = useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line no-useless-escape
    const list = logcont.match(/\<(h\d+)(.*?)\>(.*?)\<\/h\d+\>/gm);
    list && setMaoList(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logcont]);

  let activeDom: any = undefined;

  const scrollIntoMao = (content: string) => {
    // 把上一个亮的熄灭
    if (activeDom) {
      activeDom.style.color = "unset";
    }

    const headerList = ["h1", "h2", "h3", "h4"];
    let list: any[] = [];
    headerList.forEach((item) => {
      const l = Array.from(document.querySelectorAll(item));
      list = list.concat(l);
    });

    const dom = list.filter((item) => item.innerHTML === content);
    if (dom.length !== 0) {
      activeDom = dom[0];
      dom[0].scrollIntoView({ behavior: "smooth" });
      dom[0].style.color = "#e4d149";
    }

    // 必须延迟才会等到动画结束再执行，否则不会 scroll
    closeDrawer && setTimeout(() => closeDrawer(), 500);
  };

  const getMaoName = (header: string) => {
    // eslint-disable-next-line no-useless-escape
    // console.dir(header);
    // 这是剥掉了标题标签后剩下的内容
    const content = header.replace(/\<h\d[^>]*\>|\<\/h\d>/g, "");
    // 这是剥掉了内容里的其他 html 标签元素（例如加粗、斜体之类的标签及样式等）
    const name = content.replace(/\<[^>]*\>|\<\/[^>]*>/g, "");

    return (
      <div
        key={header}
        className={styles.maoItem}
        onClick={() => {
          scrollIntoMao(content);
        }}
      >
        {name}
      </div>
    );
  };

  return (
    <>
      {maoList.length !== 0 && (
        <div className={`${styles.logMao} ScrollBar`}>
          {maoList.map((item) => {
            return getMaoName(item);
          })}
        </div>
      )}
    </>
  );
};

export default withRouter(LogCont);
