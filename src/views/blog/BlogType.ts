import { ImgType } from '@/client/ImgHelper'
import { FileType } from '@/client/FileHelper'

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
export interface OneBlogType extends BlogListType {
  blogcont: string;
  imgList: ImgType[];
  fileList: FileType[];
}

// export const a = 1;  // 这个用来绕过 export interface 的报错
