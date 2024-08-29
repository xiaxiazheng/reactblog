import React from "react";
import { Button, message } from "antd";
import { handleCopy } from "@/views/todo-list/utils";

interface IProps {
    text: string;
    children?: any;
    [x: string]: any;
}

const CopyButton: React.FC<IProps> = (props) => {
    const { text, children = null, ...rest } = props;

    return (
        <Button onClick={() => handleCopy(text)} {...rest}>
            {children}
        </Button>
    );
};

export default CopyButton;
