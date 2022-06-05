import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { ImageType, getImgList } from "@/client/ImgHelper";
import { staticUrl } from "@/env_config";
import classnames from "classnames";
import { UserContext } from "@/context/UserContext";
import { withRouter, RouteComponentProps } from "react-router-dom";
import beian from "@/assets/beian.png";
import { Input, Spin } from "antd";
import { exec } from "@/client/SshHelper";

interface ICMD extends RouteComponentProps {}

const CMD: React.FC<RouteComponentProps> = (props) => {
    const { history } = props;

    const [cmd, setCmd] = useState<string>();
    const [result, setResult] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const submit = async () => {
        setResult("");
        if (!cmd) return;
        setLoading(true);
        try {
            const res = await exec(cmd);
            if (res) {
                setResult(res);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.cmd}>
            <Input
                className={styles.input}
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
                onPressEnter={submit}
            />
            <div>结果：</div>
            <Spin spinning={loading}>
                <div className={styles.result}>{result}</div>
            </Spin>
        </div>
    );
};

export default withRouter(CMD);
