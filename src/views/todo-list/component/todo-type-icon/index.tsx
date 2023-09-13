import React from "react";
import {
    AimOutlined,
    BookOutlined,
    ClockCircleOutlined,
    PushpinOutlined,
    ThunderboltFilled,
    AppleFilled,
} from "@ant-design/icons";

type TodoType = "target" | "note" | "habit" | "pin" | "urgent" | "work";

const map = {
    target: AimOutlined,
    note: BookOutlined,
    habit: ClockCircleOutlined,
    pin: PushpinOutlined,
    urgent: ThunderboltFilled,
    work: AppleFilled,
};

interface IProps {
    type: TodoType;
    [x: string]: any;
}

const TodoTypeIcon: React.FC<IProps> = (props) => {
    const { type, ...rest } = props;

    const Component = map[type];

    return <Component {...rest} />;
};

export default TodoTypeIcon;
