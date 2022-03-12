import { message } from "antd";

export const handleSize = (size: number) => {
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)}KB`;
    } else {
        return `${(size / 1024 / 1024).toFixed(2)}MB`;
    }
};

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
