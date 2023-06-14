import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { getNoteList, getNoteCategory } from "@/client/NoteHelper";
import { Input, Radio, Pagination, Empty, Button, Spin, Space } from "antd";
import { NoteType, CategoryType } from "./types";
import NoteEditModal from "./note-edit-modal";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { handleNote } from "./utils";
import ImgFileNoteList from "./img-file-note-list";
import NoteDetailModal from "./note-detail-modal";
import { debounce } from "../todo-list/utils";

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
            setList(res?.data?.list || []);
            setTotal(res?.data?.total || 0);
        }
        setLoading(false);
    }, 300);

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
        getData();
    }, [pageNo]);

    useEffect(() => {
        pageNo === 1 ? getData() : setPageNo(1);
    }, [activeCategory, pageSize]);

    useEffect(() => {
        refreshData();
    }, []);

    const [activeNote, setActiveNote] = useState<NoteType>();
    // 新建 / 编辑
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    // 详情
    const [isShowDetail, setIsShowDetail] = useState<boolean>(false);

    return (
        <div className={`${styles.note} ScrollBar`}>
            <Spin spinning={loading}>
                <div className={styles.wrap}>
                    <div className={styles.left}>
                        <Radio.Group
                            className={styles.radioList}
                            value={activeCategory}
                            optionType="button"
                            onChange={(e) => setActiveCategory(e.target.value)}
                        >
                            <Space direction="vertical">
                                <Radio key="所有" value="所有">
                                    所有 (
                                    {category?.reduce(
                                        (prev, cur) => prev + Number(cur.count),
                                        0
                                    )}
                                    )
                                </Radio>
                                {category?.map((item) => {
                                    return (
                                        <Radio
                                            key={item.category}
                                            value={item.category}
                                        >
                                            {item.category} ({item.count})
                                        </Radio>
                                    );
                                })}
                            </Space>
                        </Radio.Group>
                    </div>
                    <div className={styles.right}>
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
                        <div className={styles.note_list}>
                            {list?.map((item) => {
                                return (
                                    <div
                                        key={item.note_id}
                                        className={styles.note_item}
                                        onClick={() => {
                                            setActiveNote(item);
                                            setIsShowDetail(true);
                                        }}
                                    >
                                        <span className={styles.category}>
                                            {item.category}
                                        </span>
                                        <span>{handleNote(item, keyword)}</span>
                                        <ImgFileNoteList
                                            isOnlyShow={true}
                                            activeNote={item}
                                            width="120px"
                                        />
                                    </div>
                                );
                            })}
                            {(!list || list?.length === 0) && (
                                <Empty
                                    style={{
                                        paddingTop: 100,
                                        gridColumnStart: 1,
                                        gridColumnEnd: 4,
                                    }}
                                />
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
                    </div>
                </div>

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

                {/* 详情 */}
                <NoteDetailModal
                    visible={isShowDetail}
                    activeNote={list?.find(
                        (item) => item.note_id === activeNote?.note_id
                    )}
                    refreshData={refreshData}
                    onCancel={() => {
                        setActiveNote(undefined);
                        setIsShowDetail(false);
                    }}
                    handleDelete={() => {
                        setActiveNote(undefined);
                        setIsShowDetail(false);
                        refreshData();
                    }}
                    handleEdit={() => {
                        setIsShowModal(true);
                    }}
                />

                {/* 新建 / 编辑 */}
                <NoteEditModal
                    visible={isShowModal}
                    category={category}
                    activeNote={activeNote}
                    setActiveNote={setActiveNote}
                    closeModal={() => {
                        setIsShowModal(false);
                    }}
                    refreshData={refreshData}
                />
            </Spin>
        </div>
    );
};

export default Note;
