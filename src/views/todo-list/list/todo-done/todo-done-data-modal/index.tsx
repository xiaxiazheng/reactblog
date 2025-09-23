import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Select, Table } from "antd";
import { useSelector } from "react-redux";
import { getTodoDoneCountList, getTodoList } from "@xiaxiazheng/blog-libs";
import { RootState } from "@/views/todo-list/rematch";
import dayjs from "dayjs";
import { useSettings } from "@xiaxiazheng/blog-libs";
import styles from "./index.module.scss";
import TodoCalendar from "./todo-calendar";
import { TodoItemType } from "@xiaxiazheng/blog-libs";

interface Props {
    open: boolean;
    setOpen: (val: boolean) => void;
}

// 已完成列表
const DoneList: React.FC<Props> = (props) => {
    const { open, setOpen } = props;

    const { todoColorMap = {}, todoColorNameMap = {} } = useSettings();

    const category = useSelector((state: RootState) => state.data.category);

    const [activeCategory, setActiveCategory] = useState<string>();
    useEffect(() => {
        if (open && activeCategory) {
            getThisYearTodoList();
            getDoneTotalData();
        }
    }, [open, activeCategory]);

    const isWork = useSelector((state: RootState) => state.filter.isWork);

    const [doneTotalData, setDoneTotalData] = useState<any[]>([]);
    const [total, setTotal] = useState<number>();
    useEffect(() => {
        open && doneTotalData.length === 0 && getDoneTotalData();
    }, [open, doneTotalData]);
    const getDoneTotalData = async () => {
        const params = {
            isWork,
            category: activeCategory,
        };
        const data = await getTodoDoneCountList(params);
        const { total, ...rest } = data.data;
        setTotal(total);
        setDoneTotalData(handleData(rest));
    };

    const handleData = (obj: any) => {
        const arr = Object.keys(obj).reduce((prev, color) => {
            return prev.concat({
                color,
                sum: Object.keys(obj[color]).reduce(
                    (prev: number, cur: any) => {
                        return prev + Number(obj[color][cur]);
                    },
                    0
                ),
                ...obj[color],
            });
        }, [] as any[]);
        arr.push(
            arr.reduce((prev, cur) => {
                Object.keys(cur).forEach((item) => {
                    prev[item] = (prev?.[item] || 0) + Number(cur[item]);
                });
                return prev;
            }, {})
        );
        return arr;
    };

    const [columns, setColumns] = useState<any[]>([]);
    const getColoums = () => {
        const yearList: number[] = [];
        for (let i = dayjs().get("year"); i >= 2018; i--) {
            yearList.push(i);
        }

        setColumns(
            [
                {
                    title: "color",
                    dataIndex: "color",
                    key: "color",
                    render: (color: number) => (
                        <span style={{ color: todoColorMap[color] }}>
                            {todoColorNameMap[color] || "合计"}
                        </span>
                    ),
                },
            ]
                .concat(
                    yearList.map((year) => {
                        return {
                            title: year + "",
                            dataIndex: year + "",
                            key: year + "",
                        };
                    }) as any[]
                )
                .concat({
                    title: "sum",
                    dataIndex: "sum",
                    key: "sum",
                } as any)
        );
    };
    useEffect(() => {
        open && columns.length === 0 && getColoums();
    }, [open, columns]);

    const thisYear = dayjs().startOf("year").format("YYYY-MM-DD");
    const [thisYearTodoList, setThisYearTodoList] = useState<TodoItemType[]>();
    const [thisYearTodoListTotal, setThisYearTodoListTotal] = useState<number>();
    useState<TodoItemType[]>();
    const getThisYearTodoList = async () => {
        const params = {
            isWork,
            category: activeCategory,
            startTime: thisYear,
            endTime: dayjs().format("YYYY-MM-DD"),
            status: '1'
        };
        const res = await getTodoList(params);
        console.log(res);
        if (res) {
            setThisYearTodoList(res.data.list);
            setThisYearTodoListTotal(res.data.total);
        }
    };

    return (
        <>
            <Button
                onClick={() => {
                    setOpen(true);
                }}
            >
                统计面板
            </Button>
            <Modal
                open={open}
                width="800px"
                title={
                    <>
                        数据面板({total})&nbsp;
                        <Button onClick={() => getDoneTotalData()}>刷新</Button>
                    </>
                }
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <div className={styles.filter}>
                    <Select
                        className={styles.select}
                        value={activeCategory || undefined}
                        placeholder="类别"
                        onChange={(val: any) => setActiveCategory(val)}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        allowClear
                        style={{ width: 150 }}
                        options={category?.map((item) => {
                            return {
                                label: `${item.category} (${item.count})`,
                                value: item.category,
                            };
                        })}
                    />
                </div>
                <Table columns={columns} dataSource={doneTotalData} />
                {activeCategory && thisYearTodoList && (
                    <>
                        <h2>今年该类别下的情况：</h2>
                        <TodoCalendar
                            startTime={thisYear}
                            todoList={thisYearTodoList}
                        />
                        <div>
                            <div>今年至今 {dayjs().diff(thisYear, 'day')} 天</div>
                            <div>有记录 {thisYearTodoListTotal} 条</div>
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
};

export default DoneList;
