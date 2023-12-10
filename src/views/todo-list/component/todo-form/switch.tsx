import React, { ReactChild } from "react";
import { Button } from "antd";

interface IProps {
    value: string;
    onChange: (val: '0' | '1') => void;
    children: ReactChild;
}

const SwitchComp = (props: IProps) => {
    const { value, onChange, children } = props;
    return (
        <Button
            type={value === "1" ? "primary" : "default"}
            onClick={() => onChange(value === "0" ? "1" : "0")}
        >
            {children}
        </Button>
    );
};

export default SwitchComp;
