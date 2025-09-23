import {
    Button,
    message,
    Modal,
    Space,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import store, { Dispatch, RootState } from "@/views/todo-list/rematch";
import { Provider, useDispatch, useSelector } from "react-redux";
import TodoItem from "@/views/todo-list/component/todo-item";
import { useSettings } from "@xiaxiazheng/blog-libs";
import Loading from "../loading";
import { TodoItemType } from "@xiaxiazheng/blog-libs";

interface PropsType { }

const QuickDecisionInHeader: React.FC<PropsType> = (props) => {
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const form = useSelector((state: RootState) => state.edit.form);
    const isWork = useSelector((state: RootState) => state.filter.isWork);
    const dispatch = useDispatch<Dispatch>();
    const { setShowEdit, setOperatorType, setActiveTodo } = dispatch.edit;
    const [isShowAll, setIsShowAll] = useState<boolean>(false);

    const habitListOrigin = useSelector(
        (state: RootState) => state.data.habitListOrigin
    ).sort((a, b) => Number(a.color) - Number(b.color));
    const listLoading = useSelector(
        (state: RootState) => state.data.todoLoading
    );
    const todoListOrigin = useSelector(
        (state: RootState) => state.data.todoListOrigin // 不能在这里直接 concat 两个对象，会导致每次函数重跑都是新的对象，造成循环
    );
    const [listOrigin, setListOrigin] = useState<TodoItemType[]>([]);

    useEffect(() => {
        setListOrigin(
            todoListOrigin
                .sort(
                    (a, b) =>
                        new Date(b.cTime || "").getTime() -
                        new Date(a.cTime || "").getTime()
                ) // 把创建时间最晚的放前面
        );
    }, [todoListOrigin]);

    const settings = useSettings();

    const [chanceList, setChanceList] = useState<number[]>();
    const [activeIndex, setActiveIndex] = useState<number>();
    const [random, setRandom] = useState<number>(); // 抽奖的随机数

    useEffect(() => {
        if (isShowModal && !random) {
            calculateChance2(listOrigin);
        }
    }, [habitListOrigin, listOrigin, isShowModal, random]);

    // 这是基于打卡任务计算的，会用子todo数量进行计算
    const calculateChance = (l: TodoItemType[]) => {
        const chanceColorList = settings?.quickDecisionConfig?.chanceColorList;
        const max =
            l
                .map((item) => item?.child_todo_list_length || 0)
                .sort((a, b) => b - a)?.[0] + 1; // 这里算出来，没有做过的事情占一份，做过的事情占 N+1 份
        const list = l
            .map(
                (item) => max - (item?.child_todo_list_length || 0) // 用 max 去减，得出的是反向的次数占比，用来提高做得少的事情的优先级
            )
            .map((item, index) => {
                const colorWeight = chanceColorList[Number(l[index].color)];
                return colorWeight * item; // 这里是乘以优先级的权重
            });
        const sum = list.reduce((prev, cur) => prev + cur, 0);
        setChanceList(list.map((item) => (item / sum) * 100));
    };

    // 这是基于普通任务计算的，会用创建时间进行计算
    const calculateChance2 = (l: TodoItemType[]) => {
        const chanceColorList = settings?.quickDecisionConfig?.chanceColorList;
        // 因为默认创建时间晚的放前面，所以 index 越高，创建时间越早
        const list = l
            .map(
                (item, index) => index * 0.01 + 1 // 所以直接用 index 提高创建时间早的任务的比例，每多一件，概率高 0.01
            )
            .map((item, index) => {
                const colorWeight = chanceColorList[Number(l[index].color)];
                return colorWeight * item; // 这里是乘以优先级的权重
            });
        const sum = list.reduce((prev, cur) => prev + cur, 0);
        setChanceList(list.map((item) => (item / sum) * 100));
    };

    const [isSelected, setIsSelected] = useState<boolean>(false);
    const [isSelectedEnd, setIsSelectedEnd] = useState<boolean>(false);
    const handleStart = () => {
        setIsSelected(true);
        let count = 0;
        let timer = setInterval(() => {
            handleSelect();
            count++;
            if (count >= 20) {
                clearInterval(timer);
                setIsSelectedEnd(true);
            }
        }, 100);
    };

    const handleSelect = () => {
        const total =
            chanceList?.reduce((prev, cur) => {
                return prev + cur;
            }, 0) || 100;
        let random = Math.floor(Math.random() * 10000) / 100;
        if (random > total) {
            // 兜底，计算可能导致精度丢失，以至于让 total < 100%，遇到这汇总情况直接重新来
            // 另一层兜底就是在就算时不截断位数，只在展示时截断
            message.warning("触发溢出，自动重试");
            handleSelect();
            return;
        }
        setRandom(random);
        const index = chanceList?.findIndex((item) => {
            if (random <= item) {
                return true;
            }
            random = random - item;
            return false;
        });
        setActiveIndex(index);
    };

    const onClear = () => {
        setActiveIndex(undefined);
        setRandom(undefined);
        setIsSelected(false);
        setIsSelectedEnd(false);
    };

    return (
        <>
            <Button
                size="small"
                onClick={() => {
                    setIsShowModal(true);
                }}
                type={isSelected ? "primary" : "default"}
            >
                quick-decision
            </Button>
            <Modal
                className={styles.modal}
                title={settings?.quickDecisionConfig?.title}
                open={isShowModal}
                onCancel={() => setIsShowModal(false)}
                width={"900px"}
                footer={
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {!isSelected && (
                            <Button
                                size="large"
                                type="primary"
                                onClick={handleStart}
                            >
                                {settings?.quickDecisionConfig?.startText}
                            </Button>
                        )}
                        {isSelectedEnd && (
                            <div>
                                <Button size="large" onClick={onClear}>
                                    {settings?.quickDecisionConfig?.restartText}
                                </Button>
                            </div>
                        )}
                    </div>
                }
            >
                <Space
                    className={styles.modalContent}
                    direction="vertical"
                    style={{ width: "100%" }}
                >
                    {isSelected && typeof activeIndex !== "undefined" && (
                        <div>
                            当前选中的是第{activeIndex + 1} /{" "}
                            {chanceList?.length}位，抽中概率
                            {chanceList?.[activeIndex]?.toFixed(2)}%：
                            <TodoItem
                                item={
                                    listOrigin[activeIndex]
                                }
                                isShowTime
                                isShowTimeRange
                            />
                        </div>
                    )}
                    {!isSelected && (
                        <>
                            <div>
                                {settings?.quickDecisionConfig?.description}
                            </div>
                            <div className={styles.list}>
                                {listLoading && <Loading />}
                                {(isShowAll
                                    ? listOrigin
                                    : listOrigin.slice(0, 18)
                                )?.map((item, index) => {
                                    return (
                                        <div
                                            key={item.todo_id}
                                            className={styles.item}
                                        >
                                            <TodoItem item={item} />
                                            <div
                                                className={styles.itemInfo}
                                            >
                                                创建时间：
                                                {item.cTime} | 概率：
                                                {chanceList?.[
                                                    index
                                                ]?.toFixed(2)}
                                                %
                                            </div>
                                        </div>
                                    );
                                })}
                                {!isShowAll && (
                                    <Button
                                        onClick={() => setIsShowAll(true)}
                                    >
                                        展示全部
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </Space>
            </Modal>
        </>
    );
};

const QuickDecisionWrapper: React.FC = () => (
    <Provider store={store}>
        <QuickDecisionInHeader />
    </Provider>
);

export default QuickDecisionWrapper;
