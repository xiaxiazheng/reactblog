export interface LogListType {
  author: string;
  cTime: string;
  classification: string;
  edittype: string;
  isShow: string;
  isStick: string;
  log_id: string;
  mTime: string;
  title: string;
};

export interface OneLogType {
  author: string;
  cTime: string;
  classification: string;
  edittype: string;
  imgList: ImageType[]
  isShow: string;
  isStick: string;
  log_id: string;
  logcont: string;
  mTime: string;
  title: string;
};

export interface ImageType {
  img_id: string;
  imgcTime: string;
  filename: string;
  imgname: string;
}

export const a = 1;  // 这个用来绕过 export interface 的报错