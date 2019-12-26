import React, { useState, useEffect } from 'react';
import { OneLogType } from '../../LogType';
import styles from './LogContShowMD.module.scss';
import { getLogCont } from '@/client/LogHelper';
import Loading from '@/components/loading/Loading'
import classnames from 'classnames';
import { markdown } from 'markdown';

interface PropsType {
  log_id: string;
};

const LogContShowMD: React.FC<PropsType> = ({ log_id }) => {
  const [loading, setLoading] = useState(true);

  const [logdata, setlogdata] = useState<OneLogType>();
  const [markdownHtml, setMarkdownHtml] = useState();

  useEffect(() =>{
    console.log('id', log_id)
    const getData = async () => {
      setLoading(true);
      let id = decodeURIComponent(atob(log_id));
      const res: OneLogType = await getLogCont(id);
      if (res) {
        setlogdata(res);
        setLoading(false);
      }
    };
    getData();
  }, []);

  const className = classnames({
    [styles.logcontShowMD]: true,
    'ScrollBar': true,
  })

  useEffect(() => {
    logdata && setMarkdownHtml({
      __html: markdown.toHTML(logdata.logcont)
    })
  }, [logdata]);

  return (
    <div className={className}>
      {loading ? <Loading width={200} /> :
        logdata && 
        <>
          <h2 className={styles.title}>{logdata.title}</h2>
          <h3 className={styles.author}>{logdata.author}</h3>
          <div className={styles.time}>
            <span>创建时间: {logdata.cTime}</span>
            <span>修改时间: {logdata.mTime}</span>
          </div>
          {/* markdown 展示 */}
          <div className={styles.markdownShower} dangerouslySetInnerHTML={markdownHtml}/>
        </>
      }
    </div>
  )
};

export default LogContShowMD;