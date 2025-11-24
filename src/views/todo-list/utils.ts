import dayjs from "dayjs";
import { TodoStatusMap } from "./types";
import { getExtraDayjs } from "@/components/header-admin/utils";
import { StatusType } from "@xiaxiazheng/blog-libs";

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
    return `周${weekList[dayjs(time).day()]}`;
};

export const getRangeFormToday = (time: string | undefined) => {
    if (!time) return '';
    const day = getExtraDayjs(time).diff(getExtraDayjs(dayjs()), "d");
    if (day === 0) return "今天";
    if (day === -1) return "昨天";
    if (day === -2) return "前天";
    if (day === 1) return "明天";
    if (day === 2) return "后天";
    return `${Math.abs(day)} 天${day < 0 ? "前" : "后"}`;
};

export const colorTitle = "优先级";

export const handleSortColor = () => {};

// 确定 todo 的刷新范围
export const handleRefreshList = (formData: any) => {
    const list: StatusType[] = [];
    if (formData.isTarget === "1" || formData.name.includes("打卡")) {
        list.push("target");
    }
    if (formData.isNote === "1") {
        list.push("note");
    }
    if (formData.isBookMark === "1") {
        list.push("bookMark");
    }
    if (formData.isDirectory === "1") {
        list.push("category");
    }
    if (formData.isFollowUp === "1") {
        list.push("followUp");
    }
    list.push(TodoStatusMap[formData.status]);

    return list;
};

let timer: any = 0;
export const debounce = (fn: () => void, ms: number) => {
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn();
        }, ms);
    };
};

// export interface TimeRange {
//     startTime: dayjs.Dayjs;
//     target: number;
// }

// export const timeRangeStringify = ({
//     startTime,
//     target,
// }: TimeRange): string => {
//     return JSON.stringify({
//         startTime: startTime.format("YYYY-MM-DD"),
//         target,
//     });
// };

// export const timeRangeParse = (val: string): TimeRange => {
//     const obj = JSON.parse(val);
//     return {
//         ...obj,
//         startTime: dayjs(obj.startTime),
//     };
// };
