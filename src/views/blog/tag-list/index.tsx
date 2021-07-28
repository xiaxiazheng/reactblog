import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import {
  getAllBlogTags,
  getShowBlogTags,
  updateTag,
  deleteTag,
} from "@/client/TagHelper";
import { IsLoginContext } from "@/context/IsLoginContext";
import { BlogContext } from "../BlogContext";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { message, Modal, Button, Input } from "antd";
import { addTag } from "@/client/TagHelper";
import { UserContext } from "@/context/UserContext";
import Loading from "@/components/loading";

interface TagType {
  tag_id: string;
  tag_name: string;
  count: number;
}

const { confirm } = Modal;

interface PropsType {
  closeDrawer?: Function;
}

const TagList: React.FC<PropsType> = (props) => {
  const { closeDrawer } = props;

  const { isLogin } = useContext(IsLoginContext);
  const { username } = useContext(UserContext);
  const {
    activeTag,
    setActiveTag,
    setIsTagChange,
    tagList,
    setTagList,
    isUpdateTag,
    setIsUpdateTag,
  } = useContext(BlogContext);

  const [loading, setLoading] = useState(true);
  const getTagData = async () => {
    setLoading(true);
    let res;
    if (isLogin) {
      res = await getAllBlogTags();
    } else {
      res = await getShowBlogTags(username);
    }
    if (res) {
      setTagList(res);
      setLoading(false);
    }
  };

  // loglist 那边更新了 tag 的话要重新获取
  useEffect(() => {
    if (isUpdateTag) {
      getTagData();
      setIsUpdateTag(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateTag]);

  useEffect(() => {
    getTagData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  /** 选中 tag */
  const choiceTag = (tag_id: string) => {
    setActiveTag(tag_id === activeTag ? "" : tag_id);
    setIsTagChange(true);
    closeDrawer && closeDrawer();
  };

  const createTag = async () => {
    const name = prompt(`请输入新增的 tag 的名称`, "new tag");
    if (name && name !== "") {
      const params = {
        tag_name: name,
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
        tag_name: name,
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
          tag_id,
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
      },
    });
  };

  // 正在编辑的 tag 的 id
  const [editting_id, setEditting_id] = useState("");

  const [keyword, setKeyword] = useState<string>("");
  const handleKeyword = (e: any) => {
    setKeyword(e.target.value);
  };
  const [showList, setShowList] = useState<any[]>([]);
  useEffect(() => {
    setShowList(
      tagList.filter(
        (item: any) =>
          item.tag_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      )
    );
  }, [tagList, keyword]);

  return (
    <div className={`${styles.wrapper}`}>
      {/* 筛选关键字输入框 */}
      <div className={styles.tagFilter}>
        <Input
          className={styles.tagFilterInput}
          value={keyword}
          onChange={handleKeyword}
          allowClear
          prefix={<SearchOutlined />}
        />
      </div>
      {/* 当前选中的 tag */}
      <div className={styles.nowActiveTag}>
        当前选中 tag：
        {activeTag && activeTag !== "" && (
          <span
            className={`${styles.tagItem} ${styles.active}`}
            onClick={choiceTag.bind(null, activeTag)}
          >
            {tagList
              .filter((item: any) => item.tag_id === activeTag)
              .map((item: any) => `${item.tag_name}(${item.count})`)}
          </span>
        )}
      </div>
      {/* tag list */}
      <div className={`${styles.tagList} ScrollBar`}>
        {isLogin && (
          <Button
            className={`${styles.tagItem} ${styles.addTag}`}
            title="新增 tag"
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={createTag}
          >
            Tag
          </Button>
        )}
        {loading && <Loading />}
        {showList.map((item: TagType) => (
          <span
            key={item.tag_id}
            className={`${styles.tagItem} ${
              activeTag === item.tag_id ? styles.active : ""
            }`}
            onClick={choiceTag.bind(null, item.tag_id)}
            onMouseEnter={(e) => {
              e.stopPropagation();
              editting_id !== item.tag_id && setEditting_id(item.tag_id);
            }}
          >
            <div className={styles.allIconBox}>
              {/* tag name */}
              <span>
                {item.tag_name}({item.count})
              </span>
              {/* 工具们 */}
              {isLogin && editting_id !== "" && editting_id === item.tag_id && (
                <div
                  className={styles.iconsBox}
                  onClick={(e) => e.stopPropagation()}
                >
                  <EditOutlined
                    className={styles.treenodeIcon}
                    title="编辑名称"
                    onClick={(e) => {
                      e.preventDefault();
                      editTag(item.tag_id, item.tag_name);
                    }}
                  />
                  <DeleteOutlined
                    className={styles.treenodeIcon}
                    title="删除节点"
                    onClick={(e) => {
                      e.preventDefault();
                      removeTag(item.tag_id, item.tag_name);
                    }}
                  />
                </div>
              )}
            </div>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagList;
