import React from "react";
import { getFootPrintList } from "../../list/todo-footprint";
import MarkdownShow from "@/views/blog/blog-cont/markdown-show";

const colorList = ["yellow", "#32e332", "#40a9ff", "red"];

// 根据关键字高亮
export const handleKeywordHighlight = (
    str: string,
    originKeyword: string = ""
) => {
    const keyword = originKeyword.trim(); // 去掉左右的空格
    if (!keyword || keyword === "") {
        return str;
    }

    // 用空格分隔关键字
    const keys = keyword.split(" ").filter((item) => !!item);

    try {
        const key = keys.map((item) => `(${item})`).join("|");
        const reg = new RegExp(key, "gim");
        const list = str
            .split(reg)
            .filter((item) => typeof item !== "undefined" && item !== "");

        const map = keys.reduce((prev, cur, index) => {
            prev[cur.toLowerCase()] = index;
            return prev;
        }, {} as any);

        return list.map((item, index) => {
            if (typeof map[item.toLowerCase()] !== "undefined") {
                return (
                    <span
                        key={index}
                        style={{
                            color: "#908080",
                            background:
                                colorList?.[map[item.toLowerCase()]] ||
                                "yellow",
                            margin: "0 3px",
                            padding: "0 3px",
                            fontSize: "14px",
                            borderRadius: "4px",
                            boxSizing: "border-box",
                        }}
                    >
                        {item}
                    </span>
                );
            } else {
                return <span key={index}>{item}</span>;
            }
        });
    } catch (e) {
        return str;
    }
};

// 判断是否是最后几次操作的 todo
const latestColorList = [
    "rgba(175, 226, 177, 0.45)",
    "rgba(175, 226, 177, 0.2)",
    "rgba(175, 226, 177, 0.1)",
];
export const judgeIsLastModify = (todo_id: string) => {
    const index = getFootPrintList()
        .slice(0, 3)
        .map((item) => item.todo_id)
        .indexOf(todo_id);
    return index !== -1
        ? { backgroundColor: latestColorList[index], display: "inline" }
        : {};
};

// 把 http/https 的 url 抠出来，思路是保留每一个断点的 url 并填充占位符，最后统一处理
export const handleUrlHighlight = (str: string, keyword: string = "") => {
    const re = /http[s]?:\/\/[^\s|,|，|:|：]*/g;
    let match;
    const urlList: string[] = [];
    let s = str;
    while ((match = re.exec(str)) !== null) {
        const url = match[0];
        urlList.push(url);
        s = s.replace(url, "<url_flag>");
    }

    return urlList.length === 0 ? (
        <MarkdownShow blogcont={str} />
    ) : (
        <span>
            {s.split("<url_flag>").map((item, index) => {
                return (
                    <span key={index}>
                        {handleKeywordHighlight(item, keyword)}
                        {urlList[index] && (
                            <a
                                style={{ color: "#40a9ff" }}
                                href={urlList[index]}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {handleKeywordHighlight(
                                    urlList[index],
                                    keyword
                                )}
                            </a>
                        )}
                    </span>
                );
            })}
        </span>
    );
};
