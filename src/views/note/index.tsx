import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { getNoteList, getNoteCategory } from "@/client/NoteHelper";
import {
    Input,
    Radio,
    Pagination,
    Empty,
    Button,
    message,
    Popconfirm,
    Spin,
} from "antd";
import { NoteType, CategoryType } from "./types";
import EditNoteModal from "./edit-note-modal";
import { deleteNote } from "@/client/NoteHelper";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { handleKeyword, handleUrl } from "./utils";
import { debounce } from "lodash";
import ImgFileNoteModal from './img-file-note-modal';

const { Search } = Input;

const Note: React.FC = () => {
    const [list, setList] = useState<NoteType[]>();
    const [total, setTotal] = useState<number>(0);

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(15);
    const [activeCategory, setActiveCategory] = useState<string>("所有");

    const [loading, setLoading] = useState<boolean>(false);

    useDocumentTitle("便签");

    const getData = debounce(async () => {
        setLoading(true);

        const params: any = {
            keyword,
            pageNo,
            pageSize,
        };

        if (activeCategory !== "所有") {
            params["category"] = activeCategory;
        }

        const res = await getNoteList(params);
        if (res) {
            setList(
                res.data.list?.map((item: NoteType) => {
                    return {
                        ...item,
                        noteNode:
                            keyword && keyword !== ""
                                ? handleKeyword(item.note, keyword)
                                : handleUrl(item.note),
                    };
                })
            );
            setTotal(res.data.total);
        }
        setLoading(false);
    }, 300);

    const onDelete = async () => {
        if (activeNote?.imgList.length !== 0) {
            message.warning("图片不为空，不能删除");
            return false;
        }
        const params = {
            note_id: activeNote?.note_id,
        };
        await deleteNote(params);
        message.success("删除 note 成功");
        refreshData();
    };

    const [category, setCategory] = useState<CategoryType[]>();
    const getCategory = async () => {
        const res = await getNoteCategory();
        if (res) {
            setCategory(res.data);
        }
    };

    const refreshData = () => {
        getData();
        getCategory();
    };

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        getData();
    }, [pageNo]);

    useEffect(() => {
        pageNo === 1 ? getData() : setPageNo(1);
    }, [activeCategory, pageSize]);

    const [activeNote, setActiveNote] = useState<NoteType>();
    // 新建 / 编辑
    const [isShowModal, setIsShowModal] = useState<boolean>(false);

    return (
        <div className={`${styles.note} ScrollBar`}>
            <Spin spinning={loading}>
                <div className={styles.header}>
                    <Search
                        className={styles.input}
                        value={keyword}
                        enterButton
                        onChange={(e) => setKeyword(e.target.value)}
                        onSearch={() =>
                            pageNo === 1 ? getData() : setPageNo(1)
                        }
                        onPressEnter={() =>
                            pageNo === 1 ? getData() : setPageNo(1)
                        }
                    />
                    <Radio.Group
                        className={styles.radio}
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                    >
                        <Radio key="所有" value="所有">
                            所有
                        </Radio>
                        {category?.map((item) => {
                            return (
                                <Radio
                                    key={item.category}
                                    value={item.category}
                                >
                                    {item.category}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                </div>

                <div className={`${styles.note_list}`}>
                    {list?.map((item) => {
                        return (
                            <div
                                key={item.note_id}
                                className={`${styles.note_item} ${
                                    item.note_id === activeNote?.note_id
                                        ? styles.active
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveNote(
                                        activeNote?.note_id !== item.note_id
                                            ? item
                                            : undefined
                                    )
                                }
                                onDoubleClick={() => {
                                    setActiveNote(item);
                                    setIsShowModal(true);
                                }}
                            >
                                <span className={styles.category}>
                                    {item.category}
                                </span>
                                <span>{item.noteNode}</span>
                                <ImgFileNoteModal
                                    isOnlyShow={true}
                                    activeNote={item}
                                    width="150px"
                                />
                            </div>
                        );
                    })}
                    {(!list || list?.length === 0) && (
                        <Empty style={{ paddingTop: 100 }} />
                    )}
                </div>

                <Pagination
                    className={styles.pagination}
                    current={pageNo}
                    pageSize={pageSize}
                    total={total}
                    onChange={(page) => setPageNo(page)}
                    onShowSizeChange={(cur, size) => setPageSize(size)}
                    showTotal={(total) => `共${total}条`}
                />

                <Button
                    className={styles.add_note}
                    type="primary"
                    onClick={() => {
                        setActiveNote(undefined);
                        setIsShowModal(true);
                    }}
                >
                    新增
                </Button>
                {activeNote && (
                    <>
                        <Button
                            className={styles.edit_note}
                            type="primary"
                            danger
                            onClick={() => {
                                setIsShowModal(true);
                            }}
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            title="确定删除吗？"
                            onConfirm={onDelete}
                            okText="Yes"
                            cancelText="No"
                            placement="left"
                        >
                            <Button className={styles.delete_note} danger>
                                删除
                            </Button>
                        </Popconfirm>
                    </>
                )}

                {/* 新建 / 编辑 */}
                <EditNoteModal
                    visible={isShowModal}
                    category={category}
                    activeNote={activeNote}
                    setActiveNote={setActiveNote}
                    closeModal={() => {
                        setIsShowModal(false);
                        setActiveNote(undefined);
                    }}
                    refreshData={refreshData}
                />
            </Spin>
        </div>
    );
};

export default Note;
