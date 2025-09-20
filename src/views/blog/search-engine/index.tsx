import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Input, Pagination, Radio, Empty, Button, Space, Spin } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { searchBlogList } from "@xiaxiazheng/blog-libs";

interface IProps {
    back: Function;
}

const SearchEngine: React.FC<IProps> = (props) => {
    const { back } = props;

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    const [list, setList] = useState<any[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        if (keyword && keyword !== "") {
            setLoading(true);
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
            setLoading(false);
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

    useEffect(() => {
        handleSearch();
    }, [pageSize]);

    return (
        <div className={`${styles.searchEngine} ScrollBar`}>
            <Space className={styles.header} size={20}>
                <Button onClick={() => back()} size="large">
                    返回列表
                </Button>
                <Input
                    className={styles.keyword}
                    value={keyword}
                    onChange={(e) =>
                        setKeyword(e.target.value)
                    }
                    size="large"
                    placeholder="输入关键字并回车搜索"
                    onPressEnter={() => handleSearch()}
                />
            </Space>

            <Spin spinning={loading}>
                <div className={`${styles.resultList}`}>
                    {keyword && list?.length === 0 && <Empty />}
                    {list?.map((item) => {
                        return (
                            <div key={item.blog_id} className={styles.listItem}>
                                <div className={`${styles.itemTitle}`}>
                                    <span>{item.title}</span>
                                    <span>
                                        <ShareAltOutlined
                                            onClick={() => {
                                                window.open(
                                                    `${
                                                        location.origin
                                                    }/admin/blog/${btoa(
                                                        decodeURIComponent(
                                                            item.blog_id
                                                        )
                                                    )}`,
                                                    "_blank"
                                                );
                                            }}
                                        />
                                    </span>
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
                {total !== 0 && (
                    <Pagination
                        className={styles.pagination}
                        pageSize={pageSize}
                        current={pageNo}
                        total={total}
                        onChange={(page, pageSize) => {
                            setPageNo(page);
                            setPageSize(pageSize || 10);
                        }}
                        pageSizeOptions={["10", "15", "20"]}
                        showTotal={() => `共 ${total} 条 `}
                    />
                )}
            </Spin>
        </div>
    );
};

export default SearchEngine;
