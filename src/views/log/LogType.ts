// 日志列表用到的日志数据
export interface LogListType {
  author: string;
  cTime: string;
  edittype: 'richtext' | 'markdown';
  isShow: string;
  isStick: string;
  log_id: string;
  mTime: string;
  title: string;
  tag: {
    tag_id: string;
    tag_name: string;
  }[];
};

// 单篇日志用到的日志数据，比列表多一个具体内容和图片
export interface OneLogType extends LogListType {
  logcont: string;
  imgList: ImageType[];
};

export interface ImageType {
  img_id: string;
  imgcTime: string;
  filename: string;
  imgname: string;
}

// export const a = 1;  // 这个用来绕过 export interface 的报错