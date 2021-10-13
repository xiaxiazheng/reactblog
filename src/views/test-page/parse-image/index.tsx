import React, { useEffect } from "react";

const ParseImage = () => {
    useEffect(() => {
        document.addEventListener("paste", function (event) {
            let items = event.clipboardData && event.clipboardData.items;
            console.log("items", items);
            let file: any = null;
            if (items && items.length) {
                // 检索剪切板 items
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        // 此时file就是剪切板中的图片文件
                        file = items[i].getAsFile();
                        break;
                    }
                }
            }
            const url = window.URL.createObjectURL(file);
            console.log("url", url);
            const img = new Image();
            img.src = url;
            img.onload = () => {
                document.getElementById("parse")?.appendChild(img);
            };
        });
    }, []);

    return (
        <div>
            <div>复制一张图片，并到此页面 ctrl + v</div>
            <div id="parse"></div>
        </div>
    );
};

export default ParseImage;
