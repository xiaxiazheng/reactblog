import moment from "moment";

// 获取已经在一起多久的日期
export const getAlreadyDate = () => {
    // 获取相隔的年月日
    const getAlreadyDate = () => {
        const startDate = moment("2016-04-16");
        const endDate = moment(new Date());
        // 計算兩者差異年數
        const years = endDate.diff(startDate, "years");
        // 計算兩者差異月數，這邊要扣掉上面計算的差異年，否則會得到12個月
        const months = endDate.diff(startDate, "months") - years * 12;
        // 把差異的年、月數加回來，否則會變成計算起訖日相差的天數(365天)
        startDate.add(years, "years").add(months, "months");
        const days = endDate.diff(startDate, "days");
        return `${years} 年 ${months} 个月 ${days} 天`;
    };
    // 获取相隔的日期
    const getAlreadyDays = () => {
        const startDate = moment("2016-04-16");
        const endDate = moment(new Date());
        return endDate.diff(startDate, "days");
    };

    return {
        date: getAlreadyDate(),
        days: getAlreadyDays(),
    };
};
