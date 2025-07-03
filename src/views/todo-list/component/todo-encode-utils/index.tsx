import { Button, Input, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import InputList from "../input-list";
import { decrypt, encrypt } from "../todo-form/encodeDecodeUtils";
import styles from './index.module.scss';

interface Props {
    password: string | undefined;
    setPassword: any;
    getDescription: () => string;
    handleEncode: (description: string) => void;
}

const TodoEncodeUtils: React.FC<Props> = (props) => {
    let cancelCount = 0;
    const { password, setPassword, getDescription, handleEncode } = props;

    const [isShowDecode, setIsShowDecode] = useState<boolean>(false);
    const [original, setOriginal] = useState<string>();

    const handleOk = async () => {
        if (password) {
            const data = await encrypt(value, password);
            if (data) {
                handleEncode(data);
                getFromDescription();
            } else {
                message.error("保存失败");
            }
        }
    }

    const handleClose = () => {
        setIsShowDecode(false);
        cancelCount = 0;
    }

    const [value, setValue] = useState<string>('');

    const getFromDescription = async () => {
        if (password) {
            const description = getDescription();
            // 如果已经有 description 了，说明要解码，解码成功才给展示
            if (description) {
                const data = await decrypt(description, password);
                if (data) {
                    setValue(data);
                    setOriginal(data);
                    setIsShowDecode(true);
                } else {
                    message.warning('解码无结果，密码不对');
                }
            } else {
                // 如果没有文案，说明是新增，可以直接打开编辑
                setValue('');
                setOriginal('');
                setIsShowDecode(true);
            }
        }
    }

    return (
        <>
            <Input
                style={{ width: 150, marginBottom: 10 }}
                value={password}
                placeholder={'请输入密码'}
                onChange={(e) => setPassword(e.target.value)}
                onPressEnter={() => {
                    if (password) {
                        getFromDescription();
                    } else {
                        message.warning("请输入密码");
                    }
                }}
            />
            <Modal
                className={styles.modal}
                width={'70vw'}
                style={{ minWidth: '1000px' }}
                title={'edit modal'}
                open={isShowDecode}
                onOk={handleOk}
                okText={'保存但不关闭'}
                onCancel={() => {
                    if (cancelCount === 0 && original !== value) {
                        message.warning('你的修改还没保存，确定取消吗？');
                        cancelCount++;
                    } else {
                        handleClose();
                    }
                }}
                okButtonProps={{
                    danger: original !== value
                }}
                cancelButtonProps={{
                    disabled: original !== value
                }}
            >
                <div style={{ paddingRight: 10 }}>
                    <InputList value={value} onChange={(val: string) => {
                        setValue(val);
                        cancelCount = 0;
                    }} isShowMD={true} />
                </div>
            </Modal>
        </>
    );
};

export default TodoEncodeUtils;
