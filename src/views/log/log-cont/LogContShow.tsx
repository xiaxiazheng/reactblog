import React, { useState, useEffect } from 'react';
import { OneLogType } from '../LogType';
import styles from './LogContShow.module.scss';
import { getLogCont } from '../../../client/LogHelper';
import Loading from '../../../components/loading/Loading'
import classnames from 'classnames';
// 代码高亮
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
// 富文本编辑器
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

interface PropsType {
  log_id: string;
};

const LogContShow: React.FC<PropsType> = ({ log_id }) => {

  const [loading, setLoading] = useState(true);

  // 编辑器配置
  const modules: any = {
    syntax: {
      highlight: (text: any) => hljs.highlightAuto(text).value
    },
    clipboard: {  // 这个设置是防止每次保存都有莫名其妙的空行“<p><br></p>”插入到内容中
      matchVisual: false
    }
  };

  const [logdata, setlogdata] = useState<OneLogType>();

  useEffect(() =>{
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
    [styles.logcontShow]: true,
    'ScrollBar': true,
  })

  return (
    <div className={className}>
      {loading ? <Loading fontSize={60} /> :
        logdata && 
        <>
          <h2 className={styles.title}>{logdata.title}</h2>
          <h3 className={styles.author}>{logdata.author}</h3>
          <div className={styles.time}>
            <span>创建时间: {logdata.cTime}</span>
            <span>修改时间: {logdata.mTime}</span>
          </div>
          {/* 富文本编辑器 */}
          <div className={styles.logcontEditor}>
            <ReactQuill
              readOnly
              theme="bubble"
              value={logdata.logcont}
              modules={modules}
            />
          </div>
        </>
      }
    </div>
  )
};

export default LogContShow;