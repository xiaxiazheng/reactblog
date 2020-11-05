import React from 'react';
import styles from './index.module.scss'
import mdStyle from '@/views/log/log-cont/mdShower.module.scss'

interface IPrintMarkdown {
  markHtml: {
    __html: string
  }
}

// 打印 markdown
const PrintMarkdown: React.FC<IPrintMarkdown> = (props) => {
  const { markHtml } = props

  return (
    <div className={`${styles.markdownShower} ${mdStyle.markdownShower} ScrollBar`} dangerouslySetInnerHTML={markHtml} />
  );
}

export default PrintMarkdown;
