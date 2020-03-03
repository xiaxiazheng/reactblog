import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { getAllLogTags } from "@/client/TagHelper";
import { IsLoginContext } from "@/context/IsLoginContext";
import { LogContext } from "../LogContext";
import { OneLogType } from "../LogType";

interface TagType {
  tag_id: string;
  tag_name: string;
}

interface PropsType {}

const TagList: React.FC<PropsType> = props => {
  const { isLogin } = useContext(IsLoginContext);
  const { activeTag, setActiveTag } = useContext(LogContext);

  const [tagList, setTagList] = useState();
  const [loading, setLoading] = useState(true);
  const getTagData = async () => {
    setLoading(true);
    const res = await getAllLogTags();
    console.log("res", res);
    if (res) {
      setTagList(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTagData();
  }, []);

  /** 选中 tag */
  const choiceTag = (tag_id: string) => {
    setActiveTag(tag_id === activeTag ? '' : tag_id)
  }

  return (
    <div className={styles.tagList}>
      {loading && <div>loading...</div>}
      {tagList &&
        tagList.map((item: TagType) => (
          <span
            key={item.tag_id}
            className={`${styles.tagName} ${
              activeTag === item.tag_id ? styles.active : ""
            }`}
            onClick={choiceTag.bind(null, item.tag_id)}
          >
            {item.tag_name}
          </span>
        ))}
    </div>
  );
};

export default TagList;
