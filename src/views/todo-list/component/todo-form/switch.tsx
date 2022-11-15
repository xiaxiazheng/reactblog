import React from "react";
import { Switch } from "antd";

const SwitchComp = ({ value, onChange }: any) => {
    return (
        <Switch
            checked={value === "1"}
            onChange={(val) => onChange(val ? "1" : "0")}
        />
    );
};

export default SwitchComp;
