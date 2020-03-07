import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import {
  getAllLogTags,
  getShowLogTags,
  updateTag,
  deleteTag
} from "@/client/TagHelper";
import { IsLoginContext } from "@/context/IsLoginContext";
import { LogContext } from "../LogContext";
import { message, Modal, Icon, Button } from "antd";
import { addTag } from "@/client/TagHelper";

interface TagType {
  tag_id: string;
  tag_name: string;
}

const { confirm } = Modal;

interface PropsType {}

const TagList: React.FC<PropsType> = props => {
  const { isLogin } = useContext(IsLoginContext);
  const { activeTag, setActiveTag, tagList, setTagList } = useContext(
    LogContext
  );

  const [loading, setLoading] = useState(true);
  const getTagData = async () => {
    setLoading(true);
    let res;
    if (isLogin) {
      res = await getAllLogTags();
    } else {
      res = await getShowLogTags();
    }
    if (res) {
      setTagList(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTagData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 选中 tag */
  const choiceTag = (tag_id: string) => {
    setActiveTag(tag_id === activeTag ? "" : tag_id);
  };

  const createTag = async () => {
    const name = prompt(`请输入新增的 tag 的名称`, "new tag");
    if (name && name !== "") {
      const params = {
        tag_name: name
      };
      const res = await addTag(params);
      if (res) {
        message.success("新增 tag 成功");
        getTagData();
      } else {
        message.error("新增 tag 失败");
      }
    }
  };

  const editTag = async (id: string, oldName: string) => {
    const name = prompt(`请输入新增的 tag 的名称`, `${oldName}`);
    if (name === oldName) {
      message.warning("与原 tag 名称相同");
      return;
    }
    if (name && name !== "") {
      const params = {
        tag_id: id,
        tag_name: name
      };
      const res = await updateTag(params);
      if (res) {
        message.success("修改 tag 名称成功");
        getTagData();
      } else {
        message.error("修改 tag 名称失败");
      }
    }
  };

  const removeTag = async (tag_id: string, name: string) => {
    confirm({
      title: `你将删除"${name}"`,
      content: "Are you sure？",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const params = {
          tag_id
        };
        const res = await deleteTag(params);
        if (res) {
          message.success("删除成功", 1);
          getTagData();
        } else {
          message.error("删除失败", 1);
        }
      },
      onCancel() {
        message.info("已取消删除", 1);
      }
    });
  };

  const [editting_id, setEditting_id] = useState("");

  return (
    <>
      <div className={styles.tagList}>
        {loading && <div>loading...</div>}
        {tagList &&
          tagList.map((item: TagType) => (
            <span
              key={item.tag_id}
              className={`${styles.tagItem} ${
                activeTag === item.tag_id ? styles.active : ""
              }`}
              onClick={choiceTag.bind(null, item.tag_id)}
              onMouseEnter={e => {
                e.stopPropagation();
                editting_id !== item.tag_id && setEditting_id(item.tag_id);
              }}
              onMouseLeave={e => {
                e.stopPropagation();
                editting_id === item.tag_id && setEditting_id("");
              }}
            >
              {
                <div className={styles.allIconBox}>
                  {/* tag name */}
                  <span>{item.tag_name}</span>
                  {/* 工具们 */}
                  {isLogin &&
                    editting_id !== "" &&
                    editting_id === item.tag_id && (
                      <div
                        className={styles.iconsBox}
                        onClick={e => e.stopPropagation()}
                      >
                        <Icon
                          className={styles.treenodeIcon}
                          title="编辑名称"
                          type="edit"
                          onClick={e => {
                            e.preventDefault();
                            editTag(item.tag_id, item.tag_name);
                          }}
                        />
                        <Icon
                          className={styles.treenodeIcon}
                          title="删除节点"
                          type="delete"
                          onClick={e => {
                            e.preventDefault();
                            removeTag(item.tag_id, item.tag_name);
                          }}
                        />
                      </div>
                    )}
                </div>
              }
            </span>
          ))}
      </div>
      {isLogin && (
        <Button
          className={styles.addTag}
          title="add tag"
          type="primary"
          size="small"
          icon="plus"
          onClick={createTag}
        >
          add tag
        </Button>
      )}
    </>
  );
};

export default TagList;
