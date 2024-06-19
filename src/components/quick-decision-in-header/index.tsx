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

const { confirm } = Modal;

interface PropsType {}

const QuickDecisionInHeader: React.FC<PropsType> = (props) => {
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const form = useSelector((state: RootState) => state.edit.form);
    const isWork = useSelector((state: RootState) => state.filter.isWork);
    const dispatch = useDispatch<Dispatch>();
    const { setShowEdit, setOperatorType, setActiveTodo } = dispatch.edit;

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
    );

    // const handleDelete = async (e: any, item: TranslateType) => {
    //     e.stopPropagation();
    //     confirm({
    //         title: `你将删除"${item.keyword}"`,
    //         content: "Are you sure？",
    //         okText: "Yes",
    //         okType: "danger",
    //         cancelText: "No",
    //         onOk: async () => {},
    //         onCancel() {
    //             message.info("已取消删除", 1);
    //         },
    //     });
    // };

    const settings = useContext(SettingsContext);

    const [changeList, setChangeList] = useState<number[]>();

    useEffect(() => {
        calculateChange();
    }, [habitListOrigin]);

    const calculateChange = () => {
        const max =
            habitListOrigin
                .map((item) => item.child_todo_list_length)
                .sort((a, b) => a - b)?.[0] + 1;
        const list = habitListOrigin.map(
            (item) => max - item.child_todo_list_length
        );
        const sum = list.reduce((prev, cur) => prev + cur, 0);
        setChangeList(list.map((item) => Math.floor((item / sum) * 100)));
    };

    return (
        <>
            <Button
                size="small"
                onClick={() => {
                    setIsShowModal(true);
                }}
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
                        <Button size="large" type="primary">
                            {settings?.quickDecisionConfig?.startText}
                        </Button>
                    </div>
                }
            >
                <Space
                    className={styles.modalContent}
                    direction="vertical"
                    style={{ width: "100%" }}
                >
                    <div>{settings?.quickDecisionConfig?.description}</div>
                    <div className={styles.list}>
                        {habitLoading && <Loading />}
                        {habitListOrigin?.map((item, index) => {
                            return (
                                <div key={item.todo_id} className={styles.item}>
                                    <TodoItem item={item} />
                                    <div>
                                        完成次数：{item.child_todo_list_length} |
                                        概率：{changeList?.[index]}%
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
