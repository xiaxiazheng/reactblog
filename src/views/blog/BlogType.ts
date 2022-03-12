import { ImageType } from "@/client/ImgHelper";
import { FType } from "@/client/FileHelper";

// 日志列表用到的日志数据
export interface BlogListType {
    author: string;
    cTime: string;
    edittype: "richtext" | "markdown";
    isShow: string;
    isStick: string;
    blog_id: string;
    mTime: string;
    title: string;
    tag: {
        tag_id: string;
        tag_name: string;
    }[];
    visits: number;
}

// 单篇日志用到的日志数据，比列表多一个具体内容和图片
export interface Inter extends BlogListType {
    blogcont: string;
    imgList: ImageType[];
    fileList: FType[];
}

export type OneBlogType = Partial<Inter>;
