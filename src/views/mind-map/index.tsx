import React, { useEffect, useState, useContext } from "react";
import styles from "./index.module.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { IsLoginContext } from "@/context/IsLoginContext";

interface IMindMap extends RouteComponentProps {}

const MindMap: React.FC<IMindMap> = (props) => {
  // const { state } = props.location;
  useDocumentTitle(`思维导图`);

  const href = "https://www.processon.com/mindmap/6098ed92f346fb5a37674c7c";

  const { isLogin } = useContext(IsLoginContext);

  return (
    <div className={`${styles.MindMap}`}>
      {/* <div className={styles.tool}>
        <a href={href} target={'__blank'}>点击打开原腾讯文档</a>
      </div>
      <iframe
        src={href}
        seamless
        frameBorder="0"
        referrerPolicy={"origin"}
        sandbox="allow-same-origin allow-forms allow-scripts allow-top-navigation allow-popups allow-top-navigation-by-user-activation allow-presentation allow-popups-to-escape-sandbox allow-modals"
      ></iframe> */}
      {isLogin && (
        <div className={styles.origin}>
          <a href={href} target={"__blank"}>
            原链接
          </a>
        </div>
      )}
      <iframe
        id="embed_dom"
        name="embed_dom"
        frameBorder="0"
        // style="display:block;width:525px; height:245px;"
        src="https://www.processon.com/embed/6098ed92f346fb5a37674c7c"
      ></iframe>
    </div>
  );
};

export default withRouter(MindMap);
