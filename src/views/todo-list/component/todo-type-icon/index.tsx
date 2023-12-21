import React from "react";
import {
    AimOutlined,
    BookOutlined,
    ClockCircleOutlined,
    PushpinOutlined,
    ThunderboltFilled,
    AppleFilled,
    StarFilled,
    FireFilled,
} from "@ant-design/icons";

const todoIconMap = {
    target: AimOutlined,
    note: BookOutlined,
    habit: ClockCircleOutlined,
    urgent: ThunderboltFilled,
    work: AppleFilled,
    key: PushpinOutlined,
    followUp: FireFilled,
    bookMark: StarFilled,
};

export const todoNameMap = {
    target: "长期跟进",
    note: "Note",
    habit: "习惯",
    urgent: '加急',
    work: "工作",
    key: "关键节点",
    followUp: "短期需要跟进",
    bookMark: "置顶",
}

type TodoType = keyof typeof todoIconMap;

interface IProps {
    type: TodoType;
    [x: string]: any;
}

const TodoTypeIcon: React.FC<IProps> = (props) => {
    const { type, ...rest } = props;

    const Component = todoIconMap[type];

    return <Component {...rest} />;
};

export default TodoTypeIcon;
