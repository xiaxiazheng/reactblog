import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Table } from "antd";
import { useSelector } from "react-redux";
import { getTodoDoneCountList } from "@/client/TodoListHelper";
import { RootState } from "@/views/todo-list/rematch";
import dayjs from "dayjs";
import { SettingsContext } from "@/context/SettingsContext";

interface Props {
    open: boolean;
    setOpen: (val: boolean) => void;
}

// 已完成列表
const DoneList: React.FC<Props> = (props) => {
    const { open, setOpen } = props;

    const { todoColorMap, todoColorNameMap } = useContext(SettingsContext);

    const isWork = useSelector((state: RootState) => state.filter.isWork);

    const [doneTotalData, setDoneTotalData] = useState<any[]>([]);
    const [total, setTotal] = useState<number>();
    useEffect(() => {
        open && doneTotalData.length === 0 && getDoneTotalData();
    }, [open, doneTotalData]);
    const getDoneTotalData = async () => {
        const params = {
            isWork,
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
                <Table columns={columns} dataSource={doneTotalData} />
            </Modal>
        </>
    );
};

export default DoneList;
