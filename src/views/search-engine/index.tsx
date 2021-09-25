import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Input, Pagination, Radio, Empty } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { searchBlogList } from "@/client/BlogHelper";

const categoryList = ["blog"];

const SearchEngine = () => {
    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    const [category, setCategory] = useState<string>("blog");

    const [list, setList] = useState<any[]>();

    const getData = async () => {
        if (keyword && keyword !== "") {
            if (category === "blog") {
                const params = {
                    pageNo,
                    pageSize,
                    keyword,
                };
                const res = await searchBlogList(params);
                if (res) {
                    console.log(list);
                    setList(res.list);
                    setTotal(res.total);
                }
            }
        }
    };

    useEffect(() => {
        getData();
    }, [pageNo]);

    const handleSearch = () => {
        if (pageNo !== 1) {
            setPageNo(1);
        } else {
            getData();
        }
    };

    return (
        <div className={`${styles.searchEngine} ScrollBar`}>
            <div className={styles.header}>
                <Input
                    className={styles.keyword}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value.replaceAll(' ', '%'))}
                    size="large"
                    placeholder="输入搜索"
                    onPressEnter={() => handleSearch()}
                />
                <Radio.Group
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {categoryList.map((item) => (
                        <Radio key={item} value={item}>
                            {item}
                        </Radio>
                    ))}
                </Radio.Group>
            </div>

            <div className={`${styles.resultList}`}>
                {keyword && list?.length === 0 && <Empty />}
                {list?.map((item) => {
                    return (
                        <div key={item.blog_id} className={styles.listItem}>
                            <div className={`${styles.itemTitle}`}>
                                <span>{item.title}</span>
                                <span><ShareAltOutlined onClick={() => {
                                    window.open(`${location.origin}/admin/blog/${btoa(
                                        decodeURIComponent(item.blog_id)
                                    )}`, "_blank");
                                }} /></span>
                            </div>
                            <div
                                className={`${styles.itemCont} ScrollBar`}
                                dangerouslySetInnerHTML={{
                                    __html: item.blogcont,
                                }}
                            />
                        </div>
                    );
                })}
            </div>
            <Pagination
                className={styles.pagination}
                pageSize={pageSize}
                current={pageNo}
                total={total}
                onChange={(page) => {
                    setPageNo(page);
                }}
            />
        </div>
    );
};

export default SearchEngine;
