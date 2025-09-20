import React from "react";
import { TodoIconMap } from "@xiaxiazheng/blog-libs";

type TodoType = keyof typeof TodoIconMap;

interface IProps {
    type: TodoType;
    [x: string]: any;
}

const TodoTypeIcon: React.FC<IProps> = (props) => {
    const { type, ...rest } = props;

    const Component = TodoIconMap[type];

    return <Component {...rest} />;
};

export default TodoTypeIcon;
