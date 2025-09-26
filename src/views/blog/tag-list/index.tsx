import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import {
    getAllBlogTags,
    getShowBlogTags,
    updateTag,
    deleteTag,
    addTag,
} from "@xiaxiazheng/blog-libs";
import { IsLoginContext } from "@/context/IsLoginContext";
import { BlogContext } from "../BlogContext";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { message, Modal, Button, Input, Popover } from "antd";
import { UserContext } from "@/context/UserContext";
import { Loading } from "@xiaxiazheng/blog-libs";

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
        activeTagId,
        setActiveTagIdId,
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
    }, [isUpdateTag]);

    useEffect(() => {
        getTagData();
    }, [username]);

    /** 选中 tag */
    const choiceTag = (tag_id: string) => {
        setActiveTagIdId(tag_id === activeTagId ? "" : tag_id);
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

    // 处理搜索 tag
    const [keyword, setKeyword] = useState<string>("");
    const handleKeyword = (e: any) => {
        setKeyword(e.target.value);
    };
    const [showList, setShowList] = useState<any[]>([]);
    useEffect(() => {
        setShowList(
            tagList.filter(
                (item: any) =>
                    item.tag_name
                        .toLowerCase()
                        .indexOf(keyword.toLowerCase()) !== -1
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
            <div className={styles.nowactiveTagId}>
                当前选中 tag：
                {activeTagId && activeTagId !== "" && (
                    <span
                        className={`${styles.tagItem} ${styles.active}`}
                        onClick={choiceTag.bind(null, activeTagId)}
                    >
                        {tagList
                            .filter((item: any) => item.tag_id === activeTagId)
                            .map(
                                (item: any) => `${item.tag_name}(${item.count})`
                            )}
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
                            activeTagId === item.tag_id ? styles.active : ""
                        }`}
                        onClick={choiceTag.bind(null, item.tag_id)}
                    >
                        {!isLogin ? (
                            `${item.tag_name}[${item.count}]`
                        ) : (
                            <Popover
                                autoAdjustOverflow
                                // overlayStyle={{ padding: '0 5px' }}
                                content={
                                    <>
                                        <Button
                                            icon={<EditOutlined />}
                                            className={styles.treeNodeIcon}
                                            title="编辑名称"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.nativeEvent.stopImmediatePropagation();
                                                editTag(
                                                    item.tag_id,
                                                    item.tag_name
                                                );
                                            }}
                                        />
                                        <Button
                                            icon={<DeleteOutlined />}
                                            className={styles.treeNodeIcon}
                                            title="删除节点"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.nativeEvent.stopImmediatePropagation();
                                                removeTag(
                                                    item.tag_id,
                                                    item.tag_name
                                                );
                                            }}
                                        />
                                    </>
                                }
                            >
                                {item.tag_name}[{item.count}]
                            </Popover>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TagList;
