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
    red: "#f5222d",
    orange: "#fa8c16",
    blue: "#40a9ff",
    grey: "#827e7e",
};
