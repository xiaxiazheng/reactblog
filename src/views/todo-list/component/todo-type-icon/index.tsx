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
    FieldTimeOutlined,
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
    onlyToday: FieldTimeOutlined,
};

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
