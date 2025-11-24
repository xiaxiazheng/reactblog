import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Form,
    Input,
    FormInstance,
    Radio,
    Tooltip,
    Space,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { colorTitle } from "../../utils";
import styles from "./index.module.scss";
import styles2 from "../input-list/index.module.scss";
import {
    ButtonSwitch,
    TodoItemType,
    TodoPresetList,
    handleCopy,
    useSettingsContext,
    splitStr,
    SwitchCompent
} from "@xiaxiazheng/blog-libs";
import InputList from "../input-list";
import SearchTodo from "./searchTodo";
import CategoryOptions from "./categoryOptions";
import { useSelector } from "react-redux";
import { RootState } from "../../rematch";
import MyDatePicker from "./MyDataPicker";
import { UserContext } from "@/context/UserContext";
import TodoEncodeUtils from "../todo-encode-utils";

interface Props {
    form: FormInstance;
    isFieldsChange: (changedFields?: any[], allFields?: any[]) => void;
    activeTodo?: TodoItemType;
    open: boolean;
    isOnlyShowTileDescription?: boolean;
    leftChildren?: any;
    rightChildren?: any;
    needFocus?: boolean;
}

const TodoForm: React.FC<Props> = (props) => {
    const {
        form,
        isFieldsChange,
        activeTodo,
        open,
        isOnlyShowTileDescription = false,
        needFocus = false,
    } = props;

    const {
        todoColorMap,
        todoColorNameMap,
        todoDescriptionMap,
    } = useSettingsContext();

    const { username } = useContext(UserContext);
    const isMe = username === "zyb";

    const category = useSelector((state: RootState) => state.data.category);

    const input = useRef<any>(null);
    // 聚焦在输入框
    useEffect(() => {
        if (open) {
            getisEncode();

            needFocus && input?.current && input.current?.focus();
        }
    }, [open, needFocus]);

    // 处理预设选项集
    const handlePreset = (item: Record<string, string>) => {
        form.setFieldsValue(item);
        isFieldsChange?.();
    };

    const [password, setPassword] = useState<string>();

    // 是否是加密
    const [isEncode, setisEncode] = useState<string>();
    const getisEncode = () => {
        setisEncode(form.getFieldValue("isEncode"));
    };

    const getDescription = () => {
        return form.getFieldValue('description');
    }

    return (
        <Form
            className={styles.form}
            form={form}
            layout="vertical"
            onFieldsChange={(changedFields: any[]) => {
                getisEncode();
                isFieldsChange(changedFields);
            }}
        >
            <div className={styles.wrapper}>
                {/* 中间编辑标题和详情 */}
                <div className={styles.left}>
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
                        <InputList isShowMD={!isOnlyShowTileDescription} />
                    </Form.Item>
                    {props.leftChildren}
                </div>
                {/* 右边选其他状态 */}
                {!isOnlyShowTileDescription && (
                    <div className={styles.right}>
                        <Form.Item label="预设选项">
                            <TodoPresetList
                                onClick={(item) => handlePreset(item)}
                            />
                        </Form.Item>
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
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="color"
                            label={
                                <Tooltip
                                    placement="top"
                                    title={
                                        <pre>{todoDescriptionMap?.color}</pre>
                                    }
                                >
                                    {colorTitle} <QuestionCircleOutlined />
                                </Tooltip>
                            }
                            rules={[{ required: true }]}
                        >
                            <Radio.Group
                                optionType="button"
                                buttonStyle="solid"
                            >
                                {todoColorMap &&
                                    Object.keys(todoColorMap).map((item) => (
                                        <Radio.Button
                                            key={item}
                                            value={item}
                                            style={{
                                                color: todoColorMap[item],
                                            }}
                                            className={`${styles.color} ${
                                                item === "0" ? styles.zero : ""
                                            }${item === "1" ? styles.one : ""}${
                                                item === "2" ? styles.two : ""
                                            }${
                                                item === "3" ? styles.three : ""
                                            }${
                                                item === "4" ? styles.four : ""
                                            }${
                                                item === "-1"
                                                    ? styles.minusOne
                                                    : ""
                                            }`}
                                        >
                                            {todoColorNameMap?.[item]}
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
                            <Space wrap size={[8, 0]}>
                                <Form.Item
                                    name="isWork"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchCompent type="isWork" />
                                </Form.Item>
                                <Form.Item
                                    name="isShow"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchCompent type="isShow" />
                                </Form.Item>
                                <Form.Item
                                    name="isTarget"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchCompent type="isTarget" />
                                </Form.Item>
                                <Form.Item
                                    name="isNote"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchCompent type="isNote" />
                                </Form.Item>
                                <Form.Item
                                    name="isDirectory"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchCompent type="isDirectory" />
                                </Form.Item>
                                <Form.Item
                                    name="isBookMark"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchCompent type="isBookMark" />
                                </Form.Item>
                                <Form.Item
                                    name="doing"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchCompent type="doing" />
                                </Form.Item>
                                <Form.Item
                                    name="isFollowUp"
                                    rules={[{ required: true }]}
                                    initialValue={"0"}
                                >
                                    <SwitchCompent type="isFollowUp" />
                                </Form.Item>
                                {isMe && (
                                    <Form.Item
                                        name="isEncode"
                                        rules={[{ required: true }]}
                                        initialValue={"0"}
                                    >
                                        <ButtonSwitch>加密</ButtonSwitch>
                                    </Form.Item>
                                )}
                                {isEncode === "1" && (
                                    <div>
                                        <TodoEncodeUtils
                                            password={password}
                                            setPassword={setPassword}
                                            getDescription={getDescription}
                                            handleEncode={(description: string) => {
                                                form?.setFieldValue('description', description);
                                                isFieldsChange?.();
                                            }}
                                        />
                                    </div>
                                )}
                            </Space>
                        </Form.Item>
                        <Form.Item name="other_id" label="前置 todo">
                            <SearchTodo activeTodo={activeTodo} />
                        </Form.Item>
                        {props?.rightChildren}
                    </div>
                )}
            </div>
        </Form>
    );
};

export default TodoForm;
