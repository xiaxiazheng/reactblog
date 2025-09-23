import { SettingsContext } from "@/context/SettingsContext";
import {
    DownCircleOutlined,
    UpCircleOutlined,
    UpOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Radio } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CategoryType } from "../../types";
import styles from "./index.module.scss";

const CategoryOptions = ({ value, onChange, category }: any) => {
    const [showAll, setShowAll] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>();

    const { todoCategoryDefaultShow = 0 } = useSettings();

    const [l, setList] = useState<CategoryType[]>(category);
    useEffect(() => {
        setList(category);
    }, [category]);

    const getList = () => {
        const list = l?.slice(0, todoCategoryDefaultShow);
        return list?.map(item => item.category).includes(value) ? list : l?.slice(0, todoCategoryDefaultShow - 1).concat(l.filter(item => item.category === value));
    };

    return (
        <>
            <Radio.Group
                optionType="button"
                buttonStyle="solid"
                value={value}
                onChange={(val) => onChange(val)}
            >
                {(showAll ? l : getList()).map((item: CategoryType) => (
                    <Radio.Button key={item.category} value={item.category}>
                        {item.category} ({item.count})
                    </Radio.Button>
                ))}
                <Button
                    className={styles.showMore}
                    type="text"
                    onClick={() => setShowAll((prev) => !prev)}
                >
                    show all category
                    {showAll ? <UpCircleOutlined /> : <DownCircleOutlined />}
                </Button>
            </Radio.Group>
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
