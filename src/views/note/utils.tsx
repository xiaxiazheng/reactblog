import React from 'react';
import { renderToString } from "react-dom/server";

// 处理 note，把链接抠出来，思路是保留每一个断点的 url 并填充占位符，最后统一处理
export const handleUrl = (str: string): string => {
    const re = /http[s]?:\/\/[^\s]*/g;
    let match;
    const urlList: string[] = [];
    let s = str;
    while ((match = re.exec(str)) !== null) {
        const url = match[0];
        urlList.push(url);
        s = s.replace(url, "<url_flag>");
    }

    const jsx: any =
        urlList.length === 0 ? (
            str
        ) : (
            <span>
                {s.split("<url_flag>").map((item, index) => {
                    return (
                        <span key={index}>
                            {item}
                            {urlList[index] && (
                                <a style={{ color: "#1890ff" }} href={urlList[index]} target="_blank" rel="noreferrer">
                                    {urlList[index]}
                                </a>
                            )}
                        </span>
                    );
                })}
            </span>
        );
    return renderToString(jsx);
};

export const handleKeyword = (str: string, keyword: string): string => {
    let list = str.split(keyword);
    const jsx = (
        <span
            style={{
                color: "#908080",
                background: "yellow",
                margin: "0 3px",
                padding: "0 3px",
                fontSize: "14px",
                borderRadius: "4px",
                boxSizing: "border-box",
            }}
        >
            {keyword}
        </span>
    );

    return list.map((item) => handleUrl(item)).join(renderToString(jsx));
};
