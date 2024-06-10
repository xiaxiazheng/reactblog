import {
    switchTranslateMark,
    YouDaoTranslate,
    YouDaoTranslateDict,
} from "@/client/TranslateHelper";
import { useCtrlSHooks } from "@/hooks/useCtrlSHook";
import { Button, message, Modal, Input, Space } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

const { TextArea } = Input;

const isAllEnglishLetter = (str: string) => /^[a-zA-Z]+$/.test(str);

interface PropsType {}

const TranslateInHeader: React.FC<PropsType> = (props) => {
    const [isShowModal, setIsShowModal] = useState<boolean>(false);

    const getData = () => {};

    const [keyword, setKeyword] = useState<string>();
    const [lastKeyword, setLastKeyword] = useState<string>();
    const [translate, setTranslate] = useState<any>();

    const handleTranslate = async () => {
        const str = keyword?.trim();
        if (!str) {
            message.warning("请输入要翻译的内容");
            return;
        }
        const res = isAllEnglishLetter(str)
            ? await YouDaoTranslateDict(str)
            : await YouDaoTranslate(str);
        console.log(res);
        if (res) {
            setLastKeyword(keyword);
            const result = res?.result && JSON.parse(res.result);
            console.log(result);
            setTranslate({
                ...res,
                result,
            });
        } else {
            setTranslate(false);
        }
    };

    // 加入 or 移出单词本
    const switchMark = async () => {
        const newMark = translate.isMark === 1 ? 0 : 1;
        const res = await switchTranslateMark(translate.translate_id, newMark);
        if (res) {
            setTranslate({
                ...translate,
                isMark: newMark,
            });
        }
    };

    useCtrlSHooks(() => {
        isShowModal && handleTranslate();
    });

    const renderTranslate = () => {
        return (
            <>
                {translate?.result && (
                    <div className={styles.label}>翻译：</div>
                )}
                {translate?.result?.translation?.map((item: any) => {
                    return <div key={item}>{item}</div>;
                })}
            </>
        );
    };

    const renderTranslateDict = () => {
        return (
            <>
                {translate?.result?.ec && (
                    <div>
                        {translate?.result.ec?.word?.map(
                            (word: any, wordIndex: number) => (
                                <Space key={wordIndex} direction="vertical">
                                    <div>
                                        <div className={styles.label}>
                                            音标：
                                        </div>
                                        <Space>
                                            <span>
                                                us:{" "}
                                                <span
                                                    className={styles.phonetic}
                                                >
                                                    [${word.usphone}]
                                                </span>
                                            </span>
                                            <span>
                                                uk:{" "}
                                                <span
                                                    className={styles.phonetic}
                                                >
                                                    [${word.ukphone}]
                                                </span>
                                            </span>
                                        </Space>
                                    </div>
                                    <div>
                                        <div className={styles.label}>
                                            翻译：
                                        </div>
                                        <div>
                                            {word?.trs?.map(
                                                (
                                                    trs: any,
                                                    trsIndex: number
                                                ) => (
                                                    <div key={trsIndex}>
                                                        {trs.tr.map(
                                                            (
                                                                tr: any,
                                                                trIndex: number
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        trIndex
                                                                    }
                                                                >
                                                                    {tr?.l?.i?.map(
                                                                        (
                                                                            i: any,
                                                                            iIndex: number
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    iIndex
                                                                                }
                                                                            >
                                                                                {
                                                                                    i
                                                                                }
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    {word?.wfs && (
                                        <div>
                                            <div className={styles.label}>
                                                其他形式：
                                            </div>
                                            <Space wrap>
                                                {word.wfs?.map(
                                                    (
                                                        wfs: any,
                                                        index: number
                                                    ) => (
                                                        <div key={index}>
                                                            <span>
                                                                {wfs?.wf?.name}
                                                            </span>
                                                            ：
                                                            <span>
                                                                {wfs?.wf?.value}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </Space>
                                        </div>
                                    )}
                                </Space>
                            )
                        )}
                    </div>
                )}
                {translate?.result?.blng_sents_part && (
                    <div>
                        <div className={styles.label}>例句：</div>
                        <Space direction="vertical">
                            {translate.result.blng_sents_part?.[
                                "sentence-pair"
                            ]?.map((item: any, index: number) => (
                                <div key={index}>
                                    <div>
                                        {index + 1}. {item?.["sentence"]}
                                    </div>
                                    <div>{item?.["sentence-translation"]}</div>
                                </div>
                            ))}
                        </Space>
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            <Button
                size="small"
                onClick={() => {
                    setIsShowModal(true);
                    getData();
                }}
            >
                translate
            </Button>
            <Modal
                title={`翻译${
                    keyword
                        ? isAllEnglishLetter(keyword)
                            ? "单词"
                            : "句子"
                        : ""
                }`}
                open={isShowModal}
                onCancel={() => setIsShowModal(false)}
                width={"80vw"}
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    <TextArea
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        rows={5}
                    />
                    <Space className={styles.search}>
                        <Button
                            onClick={() => handleTranslate()}
                            type="primary"
                            disabled={!keyword}
                        >
                            查询
                        </Button>
                        {translate?.isMark === 1 && <span>当前查询已记录</span>}
                        {translate && (
                            <Button
                                onClick={() => switchMark()}
                                danger={translate.isMark === 1}
                            >
                                {translate.isMark === 0 ? "保存" : "移除"}
                            </Button>
                        )}
                    </Space>
                    {lastKeyword && (
                        <Space
                            direction="vertical"
                            className={`${styles.result} ScrollBar`}
                        >
                            {isAllEnglishLetter(lastKeyword)
                                ? renderTranslateDict()
                                : renderTranslate()}
                        </Space>
                    )}
                </Space>
            </Modal>
        </>
    );
};

export default TranslateInHeader;
