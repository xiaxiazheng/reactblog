import {
    DeleteOutlined,
    InfoCircleFilled,
    StarFilled,
} from "@ant-design/icons";
import {
    Button,
    message,
    Modal,
    Input,
    Space,
    Pagination,
    Radio,
    Tooltip,
    Spin,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import store, { Dispatch, RootState } from "@/views/todo-list/rematch";
import { Provider, useDispatch, useSelector } from "react-redux";
import TodoItem from "@/views/todo-list/component/todo-item";
import { useOriginTodo } from "@/views/todo-list/component/global-search";
import { SettingsContext } from "@/context/SettingsContext";
import Loading from "../loading";
import { CreateTodoItemReq, TodoItemType } from "@/views/todo-list/types";
import { addTodoItem } from "@/client/TodoListHelper";

const { confirm } = Modal;

interface PropsType {}

const QuickDecisionInHeader: React.FC<PropsType> = (props) => {
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const form = useSelector((state: RootState) => state.edit.form);
    const isWork = useSelector((state: RootState) => state.filter.isWork);
    const dispatch = useDispatch<Dispatch>();
    const { setShowEdit, setOperatorType, setActiveTodo } = dispatch.edit;
    const { punchTheClock } = dispatch.data;

    const originTodo = useOriginTodo();

    const handleAdd = () => {
        setActiveTodo(undefined);
        setOperatorType("add");
        setShowEdit(true);
        form?.setFieldsValue({
            ...originTodo,
            category: originTodo.category,
            isHabit: "1",
            isWork: isWork || "0",
        });
    };

    const habitLoading = useSelector(
        (state: RootState) => state.data.habitLoading
    );
    const habitListOrigin = useSelector(
        (state: RootState) => state.data.habitListOrigin
    ).sort((a, b) => Number(a.color) - Number(b.color));

    const settings = useContext(SettingsContext);

    const [chanceList, setChanceList] = useState<number[]>();
    const [activeIndex, setActiveIndex] = useState<number>();
    const [random, setRandom] = useState<number>();

    useEffect(() => {
        if (isShowModal && !random) {
            calculateChange();
        }
    }, [habitListOrigin, isShowModal, random]);

    const calculateChange = () => {
        const chanceColorList = settings?.quickDecisionConfig?.chanceColorList;
        const max =
            habitListOrigin
                .map((item) => item.child_todo_list_length)
                .sort((a, b) => b - a)?.[0] + 1; // 这里算出来，没有做过的事情占一份，做过的事情占 N+1 份
        const list = habitListOrigin
            .map(
                (item) => max - item.child_todo_list_length // 用 max 去减，得出的是反向的次数占比，用来提高做得少的事情的优先级
            )
            .map((item, index) => {
                const colorWeight =
                    chanceColorList[Number(habitListOrigin[index].color)];
                return colorWeight * item; // 这里是乘以优先级的权重
            });
        const sum = list.reduce((prev, cur) => prev + cur, 0);
        setChanceList(
            list.map((item) => Math.floor((item / sum) * 10000) / 100)
        );
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
        let random = Math.floor(Math.random() * 10000) / 100;
        setRandom(random);
        setActiveIndex(
            chanceList?.findIndex((item) => {
                if (random < item) {
                    return true;
                }
                random -= item;
                return false;
            })
        );
    };

    const handleFinish = async () => {
        const todo = habitListOrigin[activeIndex as number];
        const res = await punchTheClock(todo);
        onClear();
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
                width={"600px"}
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
                                <Button
                                    size="large"
                                    type="primary"
                                    onClick={handleFinish}
                                >
                                    {settings?.quickDecisionConfig?.finishText}
                                </Button>
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
                            当前选中的是第{activeIndex + 1}位，抽中概率
                            {chanceList?.[activeIndex]}%：
                            <TodoItem item={habitListOrigin[activeIndex]} />
                        </div>
                    )}
                    {!isSelected && (
                        <>
                            <div>
                                {settings?.quickDecisionConfig?.description}
                            </div>
                            <div className={styles.list}>
                                {habitLoading && <Loading />}
                                {habitListOrigin?.map((item, index) => {
                                    return (
                                        <div
                                            key={item.todo_id}
                                            className={styles.item}
                                        >
                                            <TodoItem item={item} />
                                            <div>
                                                完成次数：
                                                {item.child_todo_list_length} |
                                                概率：{chanceList?.[index]}%
                                            </div>
                                        </div>
                                    );
                                })}
                                <Button
                                    style={{ marginTop: 5 }}
                                    onClick={() => handleAdd()}
                                >
                                    新建任务
                                </Button>
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
