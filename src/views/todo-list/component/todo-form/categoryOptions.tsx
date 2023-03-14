import { DownCircleOutlined, UpCircleOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Input, message, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { CategoryType } from "../../types";
import styles from './index.module.scss';

const CategoryOptions = ({ value, onChange, category }: any) => {
    const [showAll, setShowAll] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>();

    const [l, setList] = useState<CategoryType[]>(category);
    useEffect(() => {
        setList(category);
    }, [category])

    return (
        <>
            <Radio.Group
                optionType="button"
                buttonStyle="solid"
                value={value}
                onChange={(val) => onChange(val)}
            >
                {(showAll ? l : l.slice(0, 9)).map(
                    (item: CategoryType) => (
                        <Radio.Button key={item.category} value={item.category}>
                            {item.category} ({item.count})
                        </Radio.Button>
                    )
                )}
            </Radio.Group>
            <Button className={styles.showMore} type="text" onClick={() => setShowAll((prev) => !prev)}>
                show all category{showAll ? <UpCircleOutlined /> : <DownCircleOutlined />}
            </Button>
            {showAll && (
                <Input
                    placeholder="请输入类别名称"
                    prefix="输入并回车新增类别："
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onPressEnter={() => {
                        if (keyword !== "") {
                            setList(
                                category.concat({
                                    category: keyword,
                                    count: 0,
                                })
                            );
                            onChange(keyword);
                        } else {
                            message.error("请输入类别名称");
                        }
                    }}
                />
            )}
        </>
    );
};

export default CategoryOptions;
