import { Space } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { ClearOutlined } from "@ant-design/icons";

interface IProps {
    onSearch: (keyword: string) => void;
}

export const getHisotryList = () => {
    try {
        const historyList = localStorage.getItem("todoDoneHistoryList");
        return historyList ? JSON.parse(historyList) : [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const setHistoryWord = (item: string) => {
    if (item) {
        try {
            localStorage.setItem("todoDoneHistoryList", JSON.stringify(Array.from(new Set([item].concat(getHisotryList())))));
        } catch (e) {
            console.error(e);
        }
    }
};

const clearHistoryWord = () => {
    try {
        localStorage.setItem("todoDoneHistoryList", JSON.stringify([]));
    } catch (e) {
        console.error(e);
    }
};

const SearchHistory: React.FC<IProps> = (props) => {
    const { onSearch } = props;

    const [list, setList] = useState<string[]>([]);
    useEffect(() => {
        setList(getHisotryList());
    }, []);

    return (
        <div className={styles.history}>
            <div className={styles.wordList}>
                {list.map((item, index) => {
                    return (
                        <span
                            key={index}
                            className={styles.word}
                            onClick={() => {
                                onSearch(item);
                                setHistoryWord(item);
                            }}
                        >
                            {item}
                        </span>
                    );
                })}
            </div>
            {!!list.length && (
                <div className={styles.clearAll}>
                    <span
                        onClick={() => {
                            clearHistoryWord();
                            onSearch('');
                        }}
                    >
                        <ClearOutlined /> 清空
                    </span>
                </div>
            )}
        </div>
    );
};

export default SearchHistory;