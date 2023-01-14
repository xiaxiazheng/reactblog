import moment from "moment";

export const formatArrayToTimeMap = (list: any[]) => {
    return list.reduce((prev, cur) => {
        prev[cur.time] =
            typeof prev[cur.time] === "undefined"
                ? [cur]
                : prev[cur.time].concat(cur);
        return prev;
    }, {});
};

const weekList = ["日", "一", "二", "三", "四", "五", "六"];
export const getWeek = (time: string) => {
    return `周${weekList[moment(time).day()]}`;
};

export const colorMap: any = {
    0: "#f5222d",
    1: "#fa8c16",
    2: "#40a9ff",
    3: "#827e7e",
    [-1]: "#20d420",
    [-2]: "#9c27b0",
};

export const colorNameMap: any = {
    0: "重要紧急",
    1: "紧急",
    2: "重要",
    3: "普通",
    [-1]: "自定义",
    // [-2]: "短期目标",
};

export const colorList = Object.keys(colorNameMap);
