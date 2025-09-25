import React, { useContext, useState } from "react";
import { Button, Space, Tooltip } from "antd";
import {
    ThunderboltFilled,
    DownOutlined,
    UpOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import { getRangeFormToday, getWeek } from "../utils";
import SortBtn, { SortKeyMap, useIsSortTime } from "../component/sort-btn";
import { useIsHIdeModel } from "../hooks";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";
import { getToday } from "@/components/header-admin/utils";
import TodoTreeWeb from "../component/todo-tree-web";
import { TodoItemType } from "@xiaxiazheng/blog-libs";

interface Props {
    loading: boolean;
    title: string | React.ReactNode;
    mapList: {
        [k in string]: TodoItemType[];
    };
    sortKey: SortKeyMap;
    showDoingBtn?: boolean; // 是否展示加急的筛选按钮
    showTimeOprationBtn?: boolean; // 是否展示日期右边的操作按钮
    isReverseTime?: boolean; // 是否倒序展示日期
    btnChildren?: React.ReactNode; // 额外的按钮
    renderDateBtn?: (time: string) => React.ReactNode; // 自定义日期按钮
}

// 待办
const List: React.FC<Props> = (props) => {
    const {
        loading,
        title,
        mapList,
        sortKey,
        showDoingBtn,
        renderDateBtn,
        isReverseTime = false,
        btnChildren = null,
    } = props;

    const { todoNameMap } = useSettingsContext();

    const Today = () => getToday().format("YYYY-MM-DD");

    const total = Object.keys(mapList).reduce(
        (prev, cur) => mapList[cur].length + prev,
        0
    );

    const { isSortTime, setIsSortTime, handleSortTime, handleSortByColor } = useIsSortTime(
        `${sortKey}-sort-time`
    );

    // 获取展示的 list
    const getShowList = (list: TodoItemType[]) => {
        let l = list;
        if (isOnlyShowDoing) {
            l = l.filter((item) => item.doing === "1");
        }
        if (!isSortTime) {
            l = l
                .filter((item) => item.doing === "1")
                .concat(handleSortByColor(l.filter((item) => item.doing !== "1")));
        } else {
            l = handleSortTime(l);
        }

        return l;
    };

    const [isOnlyShowDoing, setIsOnlyShowDoing] = useState<boolean>(false);

    const { isHide, setIsHide } = useIsHIdeModel(`${sortKey}`);

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span className={styles.active} onClick={() => setIsHide()}>
                    {title}({total}){" "}
                    {isHide ? <UpOutlined /> : <DownOutlined />}
                </span>
                <Space size={8}>
                    {btnChildren}
                    {showDoingBtn && (
                        <Tooltip title={`只看 ${todoNameMap?.urgent}`}>
                            <Button
                                className={
                                    isOnlyShowDoing
                                        ? styles.isOnlyShowDoing
                                        : ""
                                }
                                type={isOnlyShowDoing ? "primary" : "default"}
                                onClick={() =>
                                    setIsOnlyShowDoing((prev) => !prev)
                                }
                                icon={<ThunderboltFilled />}
                            ></Button>
                        </Tooltip>
                    )}
                    <SortBtn
                        isSortTime={isSortTime}
                        setIsSortTime={setIsSortTime}
                    />
                </Space>
            </div>

            {!isHide && (
                <div className={`${styles.OneDayListWrap} ScrollBar`}>
                    {(isReverseTime
                        ? Object.keys(mapList).sort().reverse()
                        : Object.keys(mapList).sort()
                    ).map((time) => {
                        const showList = getShowList(mapList[time]);
                        if (!showList.length) {
                            return null;
                        }
                        return (
                            <div className={styles.oneDay} key={time}>
                                <div
                                    className={`${styles.time} ${time === Today()
                                        ? styles.today
                                        : time > Today()
                                            ? styles.future
                                            : styles.previously
                                        }`}
                                >
                                    <span>
                                        {time}&nbsp; ({getWeek(time)},
                                        {getRangeFormToday(time)})
                                        {mapList[time]?.length > 6
                                            ? ` ${mapList[time]?.length}`
                                            : null}
                                    </span>
                                    {renderDateBtn?.(time)}
                                </div>
                                <TodoTreeWeb todoList={showList} getTodoItemProps={() => {
                                    return { showDoneIcon: true }
                                }} />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default List;
