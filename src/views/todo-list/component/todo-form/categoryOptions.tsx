import {
    DownCircleOutlined,
    UpCircleOutlined,
    UpOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Radio } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CategoryType } from "../../types";
import styles from "./index.module.scss";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";

const CategoryOptions = ({ value, onChange, category }: any) => {
    // const [showAll, setShowAll] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>();

    // const { todoCategoryDefaultShow = 0 } = useSettingsContext();

    const [originalCategoryList, setOriginalCategoryList] = useState<CategoryType[]>(category);
    const [showCategoryList, setShowCategoryList] = useState<CategoryType[]>(category);
    useEffect(() => {
        setOriginalCategoryList(category);
    }, [category]);

    // const getList = () => {
    //     const list = l?.slice(0, todoCategoryDefaultShow);
    //     return list?.map(item => item.category).includes(value) ? list : l?.slice(0, todoCategoryDefaultShow - 1).concat(l.filter(item => item.category === value));
    // };

    useEffect(() => {
        if (keyword) {
            setShowCategoryList(
                originalCategoryList.filter((item) => item.category.toLowerCase().includes(keyword.toLowerCase()))
            );
        } else {
            setShowCategoryList(originalCategoryList);
        }
    }, [keyword]);

    return (
        <>
            <Input
                placeholder="筛选类别，回车快速选中第一个，没有待选则新增类别"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => {
                    if (showCategoryList.length > 0) {
                        onChange(showCategoryList[0].category);
                    } else {
                        if (keyword !== "") {
                            const newList = category.concat({
                                category: keyword,
                                count: 0,
                            });
                            setShowCategoryList(newList);
                            setOriginalCategoryList(newList);
                            onChange(keyword);
                        }
                    }
                }}
            />
            <Radio.Group
                optionType="button"
                buttonStyle="solid"
                value={value}
                onChange={(val) => onChange(val)}
            >
                {showCategoryList.map((item: CategoryType) => (
                    <Radio.Button key={item.category} value={item.category}>
                        {item.category} ({item.count})
                    </Radio.Button>
                ))}
                {/* <Button
                    className={styles.showMore}
                    type="text"
                    onClick={() => setShowAll((prev) => !prev)}
                >
                    show all category
                    {showAll ? <UpCircleOutlined /> : <DownCircleOutlined />}
                </Button> */}
            </Radio.Group>
        </>
    );
};

export default CategoryOptions;
