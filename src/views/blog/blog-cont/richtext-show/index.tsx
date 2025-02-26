import React from 'react';
import styles from "../markdown-show/index.module.scss";

interface PropsType {
    contentHtml: string;
}

const RichtextShow: React.FC<PropsType> = (props) => {
    return (
        <div className={`${styles.markdownShower}`} dangerouslySetInnerHTML={{ __html: props.contentHtml }}></div>
    )
}

export default RichtextShow;
