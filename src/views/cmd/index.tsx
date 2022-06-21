import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "./index.module.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Button, Input, message, Space, Spin } from "antd";
import { exec } from "@/client/CmdHelper";
import { useCtrlSHooks } from "../../hooks/useCtrlSHook";
import { addNote, getNoteList } from "@/client/NoteHelper";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useScrollToHook from "@/hooks/useScrollToHooks";

const { TextArea } = Input;

interface ICMD extends RouteComponentProps {}

const CMD: React.FC<ICMD> = (props) => {
    const { history } = props;

    useDocumentTitle("CMD");

    const [cmd, setCmd] = useState<string>("pwd");
    const [result, setResult] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const submit = async () => {
        if (!cmd) return;
        setLoading(true);

        const str = cmd
            .split("\n")
            .filter((item) => !(!item || /^#/.test(item)))
            .join("&&");

        pushResult(`-> ${str}`);

        try {
            ref?.current?.send(
                JSON.stringify({
                    event: "cmd",
                    data: str,
                })
            );
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

    const pushResult = (str: string) => {
        setResult((prev) => `${prev}\n${str}`);
        // 滚动到底部
        scrollToBottom();
    };

    const ref = useRef<any>(null);

    const resultRef = useRef<any>(null);
    const { scrollToBottom } = useScrollToHook(resultRef);

    // 链接 websocket
    const connectWS = () => {
        const websocket = new WebSocket("ws://www.xiaxiazheng.cn:3002/");
        ref.current = websocket;
        websocket.onopen = function () {
            pushResult(`websocket open`);
        };
        websocket.onclose = function () {
            pushResult(`websocket close`);
        };
        websocket.onmessage = function (e) {
            pushResult(
                `${
                    JSON.parse(e.data)
                        ?.data?.replaceAll(`\\n"`, "")
                        .replaceAll(`"`, "")
                        .replaceAll("\\n", "\n") || ""
                }`
            );
        };
    };

    useEffect(() => {
        connectWS();
    }, []);

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
                    <div className={styles.result} ref={resultRef}>
                        {result}
                    </div>
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
