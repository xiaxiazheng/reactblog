import dayjs from "dayjs";

export const getDayjs = (day: dayjs.Dayjs | string) => {
    if (typeof day === "string") {
        day = dayjs(day);
    }
    const year = day.get("year");
    const month = day.get("month") + 1;
    const date = day.get("date");
    return dayjs(`${year}-${month}-${date}`);
};

const getToday = () => {
    const day = dayjs();
    return getDayjs(day);
};

// 获取已经在一起多久的日期
export const getAlreadyDate = () => {
    // 获取相隔的年月日
    const getAlreadyDate = () => {
        const startDate = dayjs("2016-04-16");
        const today = getToday();
        // 計算兩者差異年數
        const years = today.diff(startDate, "years");
        // 計算兩者差異月數，這邊要扣掉上面計算的差異年，否則會得到12個月
        const months = today.diff(startDate, "months") - years * 12;
        // 把差異的年、月數加回來，否則會變成計算起訖日相差的天數(365天)
        const days = today.diff(
            startDate.add(years, "years").add(months, "months"),
            "days"
        );
        return `${years} 年 ${months} 个月 ${days} 天`;
    };
    // 获取相隔的日期
    const getAlreadyDays = () => {
        const startDate = dayjs("2016-04-16");
        const today = getToday();
        return today.diff(startDate, "days");
    };
    // 获取下一次纪念日的时间
    const getNextDate = (month: number, date: number) => {
        const year = dayjs().get("year");
        const thisYearDate = dayjs(`${year}-${month}-${date}`);
        const today = getToday();
        if (
            thisYearDate.isSame(today, "days") ||
            thisYearDate.isAfter(today, "days")
        ) {
            return thisYearDate.diff(today, "days");
        } else {
            return thisYearDate.add(1, "years").diff(today, "days");
        }
    };

    return {
        date: getAlreadyDate(),
        days: getAlreadyDays(),
        next: getNextDate(4, 16),
        nextBirthday: getNextDate(5, 18),
    };
};
