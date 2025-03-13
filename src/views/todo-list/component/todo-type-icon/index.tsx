import React from "react";
import {
    AimOutlined,
    BookOutlined,
    BarsOutlined,
    PushpinOutlined,
    ThunderboltFilled,
    AppleFilled,
    StarFilled,
    FireFilled,
    FieldTimeOutlined,
    CoffeeOutlined,
} from "@ant-design/icons";

const todoIconMap = {
    target: AimOutlined,
    note: BookOutlined,
    habit: BarsOutlined,
    urgent: ThunderboltFilled,
    work: AppleFilled,
    key: PushpinOutlined,
    followUp: FireFilled,
    bookMark: StarFilled,
    onlyToday: FieldTimeOutlined,
    life: CoffeeOutlined,
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
