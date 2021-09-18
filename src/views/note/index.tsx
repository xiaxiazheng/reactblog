import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { getNoteList, getNoteCategory } from "@/client/NoteHelper";
import { Input, Radio, Pagination, Empty } from "antd";

const { Search } = Input;

const Note = () => {
    const [list, setList] = useState<any[]>();
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

    const [category, setCategory] = useState<any[]>();
    const getCategory = async () => {
        const res = await getNoteCategory();
        if (res) {
            setCategory(res.data);
        }
    };

    useEffect(() => {
        getData();
        getCategory();
    }, []);

    useEffect(() => {
        getData();
    }, [pageNo, category]);

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
                        <div key={item.note_id} className={styles.note_item}>
                            <span className={styles.category}>
                                {item.category}
                            </span>
                            <span>{item.note}</span>
                        </div>
                    );
                })}
                {(!list || list?.length === 0) && <Empty style={{ paddingTop: 100 }} />}
            </div>
            <Pagination
                className={styles.pagination}
                current={pageNo}
                pageSize={pageSize}
                total={total}
                onChange={(page) => setPageNo(page)}
                showTotal={(total) => `共${total}条`}
            />
        </div>
    );
};

export default Note;
