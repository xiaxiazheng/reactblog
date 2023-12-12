import React, { useEffect, useRef } from "react";
import {
    Form,
    Input,
    FormInstance,
    Radio,
    Tooltip,
    Space,
    FormListFieldData,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
    colorMap,
    colorNameMap,
    colorList,
    handleCopy,
    colorTitle,
} from "../../utils";
import styles from "./index.module.scss";
import styles2 from "../input-list/index.module.scss";
import dayjs from "dayjs";
import { TodoItemType } from "../../types";
import InputList, { splitStr } from "../input-list";
import SwitchComp from "./switch";
import SearchTodo from "./searchTodo";
import CategoryOptions from "./categoryOptions";
import { useSelector } from "react-redux";
import { RootState } from "../../rematch";
import TodoTypeIcon from "../todo-type-icon";
import MyDatePicker from "./MyDataPicker";

interface Props {
    form: FormInstance;
    isFieldsChange: (changedFields?: any[], allFields?: any[]) => void;
    activeTodo?: TodoItemType;
    open: boolean;
    isShowOther?: boolean;
    leftChildren?: any;
    rightChildren?: any;
}

const TodoForm: React.FC<Props> = (props) => {
    const {
        form,
        isFieldsChange,
        activeTodo,
        open,
        isShowOther = false,
    } = props;

    const category = useSelector((state: RootState) => state.data.category);

    // const isPunchTheClock = Form.useWatch("isPunchTheClock", form) === "1";

    const input = useRef<any>(null);
    useEffect(() => {
        open && input?.current && input.current?.focus();
    }, [open]);

    return (
        <Form
            className={styles.form}
            form={form}
            layout="vertical"
            onFieldsChange={isFieldsChange}
        >
            <div className={styles.wrapper}>
                <div className={!isShowOther ? styles.left : styles.full}>
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[{ required: true }]}
                        style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 2,
                            background: "rgb(0, 21, 41)",
                        }}
                    >
                        <Input.TextArea
                            className={styles2.textarea}
                            placeholder="尽量的量化，有具体的完成指标，任务尽量细致且易完成"
                            autoFocus={true}
                            ref={input}
                            allowClear
                            autoSize={{ minRows: 1, maxRows: 4 }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={
                            <Tooltip
                                title={
                                    <div>
                                        <div>
                                            1. 分割符为 {splitStr}, 点击复制
                                        </div>
                                        <div>2. 五个回车可新增输入框</div>
                                    </div>
                                }
                            >
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleCopy(splitStr)}
                                >
                                    详细描述 <QuestionCircleOutlined />
                                </span>
                            </Tooltip>
                        }
                        initialValue={""}
                    >
                        <InputList />
                    </Form.Item>
                    {props.leftChildren}
                </div>
                {!isShowOther && (
                    <div className={styles.right}>
                        <Form.Item
                            name="status"
                            label="状态"
                            rules={[{ required: true }]}
                        >
                            <Radio.Group
                                optionType="button"
                                buttonStyle="solid"
                            >
                                <Radio.Button value={0}>待办</Radio.Button>
                                <Radio.Button value={1}>已完成</Radio.Button>
                                <Radio.Button value={2}>待办池</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="color"
                            label={colorTitle}
                            rules={[{ required: true }]}
                        >
                            <Radio.Group
                                optionType="button"
                                buttonStyle="solid"
                            >
                                {colorList.map((item) => (
                                    <Radio.Button
                                        key={item}
                                        value={item}
                                        style={{ color: colorMap[item] }}
                                        className={`${styles.color} ${
                                            item === "0" ? styles.zero : ""
                                        }${item === "1" ? styles.one : ""}${
                                            item === "2" ? styles.two : ""
                                        }${item === "3" ? styles.three : ""}${
                                            item === "-1" ? styles.minusOne : ""
                                        }`}
                                    >
                                        {colorNameMap[item]}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="category"
                            label="类别"
                            rules={[{ required: true }]}
                        >
                            <CategoryOptions category={category} />
                        </Form.Item>
                        <Form.Item
                            name="time"
                            label="时间"
                            rules={[{ required: true }]}
                        >
                            <MyDatePicker />
                        </Form.Item>
                        <Form.Item label="特殊状态" style={{ marginBottom: 0 }}>
                            <Space className={styles.special} size={[8, 0]}>
                                <Form.Item
                                    name="isWork"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchComp>
                                        <span>
                                            <TodoTypeIcon
                                                type="work"
                                                style={{ color: "#00d4d8" }}
                                            />{" "}
                                            工作
                                        </span>
                                    </SwitchComp>
                                </Form.Item>
                                <Form.Item
                                    name="doing"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchComp>
                                        <span>
                                            <TodoTypeIcon
                                                type="urgent"
                                                style={{ color: "red" }}
                                            />{" "}
                                            加急
                                        </span>
                                    </SwitchComp>
                                </Form.Item>
                                <Form.Item
                                    name="isTarget"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchComp>
                                        <span>
                                            <TodoTypeIcon
                                                type="target"
                                                style={{ color: "#ffeb3b" }}
                                            />{" "}
                                            目标
                                        </span>
                                    </SwitchComp>
                                </Form.Item>
                                <Form.Item
                                    name="isBookMark"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchComp>
                                        <span>
                                            <TodoTypeIcon
                                                type="pin"
                                                style={{
                                                    marginRight: 5,
                                                    color: "#ffeb3b",
                                                }}
                                            />{" "}
                                            书签
                                        </span>
                                    </SwitchComp>
                                </Form.Item>
                                <Form.Item
                                    name="isNote"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchComp>
                                        <span>
                                            <TodoTypeIcon
                                                type="note"
                                                style={{
                                                    marginRight: 5,
                                                    color: "#ffeb3b",
                                                }}
                                            />{" "}
                                            Note
                                        </span>
                                    </SwitchComp>
                                </Form.Item>
                                <Form.Item
                                    name="isHabit"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchComp>
                                        <span>
                                            <TodoTypeIcon
                                                type="habit"
                                                style={{
                                                    marginRight: 5,
                                                    color: "#ffeb3b",
                                                }}
                                            />{" "}
                                            习惯
                                        </span>
                                    </SwitchComp>
                                </Form.Item>

                                <Form.Item
                                    name="isKeyNode"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchComp>
                                        <span>
                                            <TodoTypeIcon
                                                type="key"
                                                style={{
                                                    marginRight: 5,
                                                    color: "#ffeb3b",
                                                }}
                                            />{" "}
                                            关键节点
                                        </span>
                                    </SwitchComp>
                                </Form.Item>
                            </Space>
                        </Form.Item>

                        <Form.Item name="other_id" label="前置 todo">
                            <SearchTodo activeTodo={activeTodo} />
                        </Form.Item>

                        {/* {isPunchTheClock && (
                            <>
                                <Form.Item
                                    name="startTime"
                                    label="打卡开始时间"
                                    rules={[{ required: true }]}
                                    initialValue={dayjs()}
                                >
                                    <MyDatePicker />
                                </Form.Item>
                                <Form.Item
                                    name="target"
                                    label="达标天数"
                                    rules={[{ required: true }]}
                                    initialValue={7}
                                >
                                    <Input />
                                </Form.Item>
                            </>
                        )} */}

                        {props?.rightChildren}
                    </div>
                )}
            </div>
        </Form>
    );
};

export default TodoForm;
