import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Button, Input, message, Space, Spin } from "antd";
import { exec } from "@/client/CmdHelper";
import { useCtrlSHooks } from "../../hooks/useCtrlSHook";
import { addNote, getNoteList } from "@/client/NoteHelper";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const { TextArea } = Input;

interface ICMD extends RouteComponentProps {}

const CMD: React.FC<ICMD> = (props) => {
    const { history } = props;

    useDocumentTitle("CMD");

    const [cmd, setCmd] = useState<string>(
        "echo 执行脚本\n\npwd\necho 执行结束"
    );
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

    const [list, setList] = useState<any>([]);
    const getScript = async () => {
        setLoading(true);

        const params: any = {
            pageNo: 1,
            pageSize: 100,
            category: "脚本",
            keyword: "",
        };
        const res = await getNoteList(params);
        if (res) {
            setList(res?.data?.list || []);
        }
        setLoading(false);
    };
    useEffect(() => {
        getScript();
        submit();
    }, []);

    const saveScript = async () => {
        const params = {
            category: "脚本",
            note: cmd,
        };
        const res = await addNote(params);
        if (res) {
            message.success("保存脚本成功");
            getScript();
        } else {
            message.error("保存脚本失败");
        }
    };

    return (
        <div className={styles.cmd}>
            <div>
                <TextArea
                    className={styles.input}
                    value={cmd}
                    onChange={(e) => setCmd(e.target.value)}
                    rows={8}
                />
                <Space size={10}>
                    <Button type="primary" onClick={() => submit()}>
                        执行
                    </Button>
                    <Button onClick={() => saveScript()}>保存</Button>
                </Space>
                <div style={{ marginTop: 20 }}>结果：</div>
                <Spin spinning={loading}>
                    <div className={styles.result}>{result}</div>
                </Spin>
            </div>
            <div>
                <div>预设脚本：</div>
                <div className={styles.script}>
                    {list?.map((item: any) => {
                        return (
                            <div
                                className={styles.scriptItem}
                                key={item.note_id}
                                onClick={() => setCmd(item.note)}
                            >
                                {item.note}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default withRouter(CMD);
