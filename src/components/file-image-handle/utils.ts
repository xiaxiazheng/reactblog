import { message } from "antd";

// 复制 url
export const copyUrl = (url: string) => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.setAttribute("value", url);
    input.select();
    document.execCommand("copy");
    message.success("复制图片路径成功", 1);
    document.body.removeChild(input);
};
