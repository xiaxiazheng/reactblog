import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { ImageType, getImgList } from "@/client/ImgHelper";
import { staticUrl } from "@/env_config";
import classnames from "classnames";
import { UserContext } from "@/context/UserContext";
import { withRouter, RouteComponentProps } from "react-router-dom";
import beian from "@/assets/beian.png";
import { Button, Input, Spin } from "antd";
import { exec } from "@/client/CmdHelper";
import { useCtrlSHooks } from "./useCtrlSHook";

const { TextArea } = Input;

interface ICMD extends RouteComponentProps {}

const CMD: React.FC<RouteComponentProps> = (props) => {
    const { history } = props;

    const [cmd, setCmd] = useState<string>("\npwd");
    const [result, setResult] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const submit = async () => {
        setResult("");
        if (!cmd) return;
        setLoading(true);

        const str = cmd
            .split("\n")
            .filter((item) => !!item)
            .join("&&");

        try {
            const res = await exec(str);
            if (res) {
                setResult(res);
            }
        } finally {
            setLoading(false);
        }
    };

    useCtrlSHooks(submit);

    return (
        <div className={styles.cmd}>
            <TextArea
                className={styles.input}
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
                rows={8}
            />
            <Button type="primary" onClick={() => submit()}>
                执行
            </Button>
            <div style={{ marginTop: 20 }}>结果：</div>
            <Spin spinning={loading}>
                <div className={styles.result}>{result}</div>
            </Spin>
        </div>
    );
};

export default withRouter(CMD);
