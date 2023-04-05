import React, { useState, useContext, useEffect } from "react";
import styles from "./index.module.scss";
import { message, Modal, Select } from "antd";
import {
    DeleteOutlined,
    EyeOutlined,
    TagsOutlined,
    VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { isShowBlog, isStickBlog, deleteBlogCont } from "@/client/BlogHelper";
import { makeBlogTag } from "@/client/TagHelper";
import { IsLoginContext } from "@/context/IsLoginContext";
import { BlogListType } from "../../BlogType";
import { BlogContext } from "../../BlogContext";

interface PropsType {
    // logClass: string;
    blogItemData: BlogListType;
    orderBy: "create" | "modify" | "letter" | "letterDesc" | "visits";
    getNewList: Function; // 完成操作后刷新数组
    // getAllLogClass: Function;
}

const { confirm } = Modal;
const { Option } = Select;

// 单条日志记录
const LogListItem: React.FC<PropsType> = (props) => {
    const { blogItemData, orderBy, getNewList } = props;
    const { isLogin } = useContext(IsLoginContext);
    const { tagList, setIsUpdateTag } = useContext(BlogContext);

    const [isShowPopup, setIsShowPopup] = useState(false);

    const [showList, setShowList] = useState<any[]>([]);
    useEffect(() => {
        setShowList(tagList);
    }, [tagList]);

    const [tag, setTag] = useState(
        blogItemData.tag.map((item: any) => item.tag_id)
    );

    // 打开 tag 的弹窗
    const handleMakeBlogTag = async (e: any) => {
        e.stopPropagation();
        setIsShowPopup(true);
    };

    // 切换分类：提交
    const submitMakeTag = async () => {
        const params = {
            blog_id: blogItemData.blog_id,
            tagIdList: tag,
        };
        const res = await makeBlogTag(params);
        if (res) {
            message.success("切换分类成功", 1);
            getNewList();
            setIsShowPopup(false);
            setIsUpdateTag(true);
        } else {
            message.error("切换分类失败", 1);
        }
    };

    // 置顶
    const handleStickBlog = async (e: any) => {
        e.stopPropagation();
        const params = {
            id: blogItemData.blog_id,
            isStick: blogItemData.isStick === "true" ? "false" : "true",
        };
        let res = await isStickBlog(params);
        if (res) {
            message.success("修改置顶状态成功");
            getNewList();
        } else {
            message.error("修改置顶状态失败");
        }
    };

    // 可见
    const handleShowBlog = async (e: any) => {
        e.stopPropagation();
        const params = {
            id: blogItemData.blog_id,
            isShow: blogItemData.isShow === "true" ? "false" : "true",
        };
        const res = await isShowBlog(params);
        if (res) {
            message.success("修改可见状态成功");
            getNewList();
        } else {
            message.error("修改可见状态失败");
        }
    };

    // 删除
    const handleDeleteBlog = (e: any) => {
        e.stopPropagation();
        confirm({
            title: `你将删除"${blogItemData.title}"`,
            content: "Are you sure？",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                const params = {
                    id: blogItemData.blog_id,
                };
                const res = await deleteBlogCont(params);
                if (res) {
                    message.success("删除成功", 1);
                    getNewList();
                } else {
                    message.error("删除失败", 1);
                }

                if (blogItemData.tag.length !== 0) {
                    setIsUpdateTag(true);
                }
            },
            onCancel() {
                message.info("已取消删除", 1);
            },
        });
    };

    return (
        <div className={styles.blogListItem}>
            <span className={styles.title} title={blogItemData.title}>
                {blogItemData.title}
            </span>
            <span className={styles.tagBox}>
                {blogItemData.tag.map((item) => {
                    return <span key={item.tag_id} className={styles.tag}>{item.tag_name}</span>;
                })}
            </span>
            <div>
                <span className={styles.author}>{blogItemData.author}</span>
                {isLogin && (
                    <>
                        <span className={styles.editType}>
                            (
                            {blogItemData.edittype === "richtext"
                                ? "富文本文档"
                                : "markdown"}
                            )
                        </span>
                        <span className={styles.visits}>
                            访问量：{blogItemData.visits}
                        </span>
                    </>
                )}
            </div>
            <span className={styles.orderbyTime}>
                {orderBy === "create" ? "创建" : "修改"}时间：
                {orderBy === "create" ? blogItemData.cTime : blogItemData.mTime}
            </span>
            {isLogin && (
                <div className={styles.blogOperateBox}>
                    <TagsOutlined
                        onClick={handleMakeBlogTag}
                        className={`${
                            blogItemData.tag.length !== 0 ? styles.active : ""
                        } ${styles.logOperateIcon}`}
                        title={"点击设置该日志的 tag"}
                    />
                    <VerticalAlignTopOutlined
                        onClick={handleStickBlog}
                        className={`${
                            blogItemData.isStick === "true" ? styles.active : ""
                        } ${styles.logOperateIcon}`}
                        title={
                            blogItemData.isStick === "true"
                                ? "点击取消置顶"
                                : "点击置顶该日志"
                        }
                    />
                    <EyeOutlined
                        onClick={handleShowBlog}
                        className={`${
                            blogItemData.isShow === "true" ? styles.active : ""
                        } ${styles.logOperateIcon}`}
                        title={
                            blogItemData.isShow === "true"
                                ? "当前日志可见"
                                : "当前日志不可见"
                        }
                    />
                    <DeleteOutlined
                        onClick={handleDeleteBlog}
                        className={styles.logOperateIcon}
                        title="点击删除该日志"
                    />
                </div>
            )}
            {/* 切换分类的弹出框 */}
            <div onClick={(e) => e.stopPropagation()}>
                <Modal
                    title={`请选择要为 “${blogItemData.title}” 设置的 tag：`}
                    open={isShowPopup}
                    centered
                    onOk={submitMakeTag}
                    onCancel={() => setIsShowPopup(false)}
                >
                    <Select
                        mode="multiple"
                        placeholder="请选择 tag"
                        value={tag}
                        style={{ width: 200 }}
                        filterOption={false}
                        onSearch={(val: any) => {
                            setShowList(
                                tagList.filter(
                                    (item: any) =>
                                        item.tag_name
                                            .toLowerCase()
                                            .indexOf(val.toLowerCase()) !== -1
                                )
                            );
                        }}
                        onChange={(val: any) => {
                            setTag(val);
                        }}
                    >
                        {showList.map(
                            (item: {
                                tag_id: string;
                                tag_name: string;
                                count: number;
                            }) => {
                                return (
                                    <Option
                                        key={item.tag_id}
                                        value={item.tag_id}
                                    >
                                        {item.tag_name} ({item.count})
                                    </Option>
                                );
                            }
                        )}
                    </Select>
                </Modal>
            </div>
        </div>
    );
};

export default LogListItem;
