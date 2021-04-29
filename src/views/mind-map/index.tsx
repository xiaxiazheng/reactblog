import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";
import useDocumentTitle from "@/hooks/useDocumentTitle";

interface IMindMap extends RouteComponentProps {}

const MindMap: React.FC<IMindMap> = (props) => {
  // const { state } = props.location;
  useDocumentTitle(`思维导图'}`);

  const href = 'https://docs.qq.com/mind/DVVdvSVJZZWt2eEtu'

  return (
    <div className={`${styles.MindMap}`}>
      <div className={styles.tool}>
        <a href={href} target={'__blank'}>点击打开原腾讯文档</a>
      </div>
      <iframe
        src={href}
        seamless
        frameBorder="0"
        referrerPolicy={"origin"}
        sandbox="allow-same-origin allow-forms allow-scripts allow-top-navigation allow-popups allow-top-navigation-by-user-activation allow-presentation allow-popups-to-escape-sandbox allow-modals"
      ></iframe>
    </div>
  );
};

export default withRouter(MindMap);
