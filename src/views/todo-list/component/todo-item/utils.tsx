import React from "react";

export const handleHighlight = (string: string, keyword: string = "") => {
    if (!string) return "";
    return handleUrlHighlight(string, keyword);
};

// 把 http/https 的 url 抠出来，思路是保留每一个断点的 url 并填充占位符，最后统一处理
export const handleUrlHighlight = (str: string, keyword: string = '') => {
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
        handleKeywordHighlight(str, keyword)
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
                                {handleKeywordHighlight(urlList[index], keyword)}
                            </a>
                        )}
                    </span>
                );
            })}
        </span>
    );
};

const colorList = ["yellow", "#32e332", "#40a9ff", "red"];

// 根据关键字高亮
export const handleKeywordHighlight = (str: string, keyword: string = '') => {
    if (!keyword || keyword === '') {
        return str;
    }

    // 用空格分隔关键字
    const keys = keyword.split(" ").filter(item => !!item);

    // demo 代码：
    // var str = "31331231";
    // var a1 = 31,
    //     a2 = 23;
    // var reg = new RegExp(`(${a2})|(${a1})`, "gim");
    // str.split(reg);

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
