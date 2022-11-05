import React from "react";

// 处理详细描述，把链接抠出来，思路是保留每一个断点的 url 并填充占位符，最后统一处理
export const handleDesc = (str: string) => {
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
                                style={{ color: "black" }}
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
