import React from "react";
import { NoteType } from "./types";

// 这个是添加了关键字高亮和解析了 url 的 react 节点
export const handleNote = (item: NoteType | undefined, keyword: string) => {
    return !item
        ? ""
        : keyword && keyword !== ""
        ? handleKeyword(item.note, keyword)
        : handleUrl(item.note);
};

// 处理 note，把链接抠出来，思路是保留每一个断点的 url 并填充占位符，最后统一处理
export const handleUrl = (str: string) => {
    const re = /http[s]?:\/\/[^\s]*/g;
    let match;
    const urlList: string[] = [];
    let s = str;
    while ((match = re.exec(str)) !== null) {
        const url = match[0];
        urlList.push(url);
        s = s.replace(url, "<url_flag>");
    }

    return urlList.length === 0 ? (
        str
    ) : (
        <span>
            {s.split("<url_flag>").map((item, index) => {
                return (
                    <span key={index}>
                        {item}
                        {urlList[index] && (
                            <a
                                style={{ color: "#1890ff" }}
                                href={urlList[index]}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {urlList[index]}
                            </a>
                        )}
                    </span>
                );
            })}
        </span>
    );
};

// 先按照关键字拆开成数组，然后拆开的部分用 handleUrl 处理，断口再用 keyword 接起来
export const handleKeyword = (str: string, keyword: string) => {
    let list = str.split(keyword);

    return list.map((item, index) => {
        return (
            <span key={index}>
                {handleUrl(item)}
                {index !== list.length - 1 && (
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
                )}
            </span>
        );
    });
};
