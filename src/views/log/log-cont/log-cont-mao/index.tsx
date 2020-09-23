import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface PropsType extends RouteComponentProps {
  logcont: string;
}

const LogCont: React.FC<PropsType> = (props) => {
  const { logcont } = props;
  const [maoList, setMaoList] = useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line no-useless-escape
    const list = logcont.match(/\<(h\d+)(.*?)\>(.*?)\<\/h\d+\>/gm);
    list && setMaoList(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logcont]);

  let activeDom: any = undefined;

  const scrollIntoMao = (name: string) => {
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
    const dom = list.filter((item) => item.innerText === name);
    if (dom.length !== 0) {
      activeDom = dom[0];
      dom[0].scrollIntoView({ behavior: 'smooth' });
      dom[0].style.color = "#e4d149";
    }
  };

  const getMaoName = (header: string) => {
    // eslint-disable-next-line no-useless-escape
    const name = header.replace(/\<h\d\>|\<\/h\d\>/g, "");

    return (
      <div
        key={header}
        className={styles.maoItem}
        onClick={() => scrollIntoMao(name)}
      >
        {name}
      </div>
    );
  };

  return (
    <div className={styles.logMao}>
      {maoList.map((item) => {
        return getMaoName(item);
      })}
    </div>
  );
};

export default withRouter(LogCont);
