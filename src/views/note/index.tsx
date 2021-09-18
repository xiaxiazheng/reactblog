import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { getNoteList, getNoteCategory } from "@/client/NoteHelper";
import { Input, Radio, Pagination, Empty, Button, message, Popconfirm } from "antd";
import { NoteType, CategoryType } from "./types";
import EditNoteModal from "./edit-note-modal";
import { deleteNote } from "@/client/NoteHelper";

const { Search } = Input;

const Note: React.FC = () => {
    const [list, setList] = useState<NoteType[]>();
    const [total, setTotal] = useState<number>(0);

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(15);
    const [activeCategory, setActiveCategory] = useState<string>("所有");

    const getData = async () => {
        const params = {
            keyword,
            pageNo,
            pageSize,
        };
        const res = await getNoteList(params);
        if (res) {
            setList(res.data.list);
            setTotal(res.data.total);
        }
    };

    const onDelete = async () => {
        const params = {
            note_id: activeNote?.note_id
        }
        await deleteNote(params);
        message.success('删除 note 成功');
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
        setIsShowModal(false);
        setActiveNote(undefined);
        getData();
        getCategory();
    };

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        getData();
    }, [pageNo, category]);

    const [activeNote, setActiveNote] = useState<NoteType>();
    const [isShowModal, setIsShowModal] = useState<boolean>(false);

    return (
        <div className={styles.note}>
            <Search
                className={styles.input}
                value={keyword}
                enterButton
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={() => (pageNo === 1 ? getData() : setPageNo(1))}
                onPressEnter={() => (pageNo === 1 ? getData() : setPageNo(1))}
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
                        <Radio key={item.category} value={item.category}>
                            {item.category}
                        </Radio>
                    );
                })}
            </Radio.Group>
            <div className={`${styles.note_list} ScrollBar`}>
                {list?.map((item) => {
                    return (
                        <div
                            key={item.note_id}
                            className={`${styles.note_item} ${
                                item.note_id === activeNote?.note_id
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() => setActiveNote(item)}
                        >
                            <span className={styles.category}>
                                {item.category}
                            </span>
                            <span>{item.note}</span>
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
                    <Button
                        className={styles.delete_note}
                        danger
                    >
                        删除
                    </Button>
                </Popconfirm>
                </>
            )}

            <EditNoteModal
                visible={isShowModal}
                category={category}
                activeNote={activeNote}
                onCancel={() => setIsShowModal(false)}
                refreshData={refreshData}
            />
        </div>
    );
};

export default Note;
