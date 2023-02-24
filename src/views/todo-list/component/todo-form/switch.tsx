import React from "react";
import { Button } from "antd";

const SwitchComp = (props: any) => {
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
