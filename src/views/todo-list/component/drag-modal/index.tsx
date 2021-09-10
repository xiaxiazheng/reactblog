import React, { ReactNode, useEffect, useState } from "react";
import { Modal, ModalProps } from "antd";

interface DragModalType extends ModalProps {
    children?: any;
}

// 可拖动的模态框
const DragModal = (props: DragModalType) => {
    const { title, visible, onOk, onCancel } = props;

    const [left, setLeft] = useState<number | string>('');
    const [top, setTop] = useState<number | string>('');
    const [transform, setTransform] = useState<string>('');

    useEffect(() => {
        requestAnimationFrame(() => {
            setTransform('translate(-50%, -50%)');
            setLeft('50%')
            setTop('50%')
        })
    }, [])

    // 监听键盘事件，实现 Ctrl+s 保存
    useEffect(() => {
        const onKeyDown = (e: any) => {
            // 加上了 mac 的 command 按键的 metaKey 的兼容
            if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                setIsKeyDown(true);
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    /** 判断是否用 ctrl + s 保存修改，直接在 onKeyDown 运行 saveEditLog() 的话只会用初始值去发请求（addEventListener）绑的太死 */
    const [isKeyDown, setIsKeyDown] = useState(false);
    useEffect(() => {
        if (isKeyDown) {
            onOk && onOk({} as any);
            setIsKeyDown(false);
        }
    }, [isKeyDown, onOk]);

    // 一开始的偏移量，后续需要被剪掉
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    return (
        <Modal
            title={
                <div
                    draggable
                    onDragStart={(e) => {
                        setTransform('');
                        setOffsetX(e.nativeEvent.offsetX + 24); // 这个偏移，是 title 跟 Modal 外部的框本身的偏移
                        setOffsetY(e.nativeEvent.offsetY + 16); // 这个是根据 Modal 到 title 的 padding 得出来的
                    }}
                    onDrag={(e) => {
                        setTransform('');
                        setLeft(e.nativeEvent.x - offsetX);
                        setTop(e.nativeEvent.y - offsetY);
                    }}
                    onDragEnd={(e) => {
                        const newLeft = e.nativeEvent.x - offsetX;
                        const newTop = e.nativeEvent.y - offsetY;
                        setLeft(newLeft);
                        setTop(newTop);
                    }}
                    onDragOver={(e) => {
                        e.dataTransfer.dropEffect = "move";
                        e.preventDefault();
                    }}
                >
                    {title}
                </div>
            }
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            style={{ position: "absolute", transform, left, top }}
            transitionName=""
            destroyOnClose
        >
            {props.children}
        </Modal>
    );
};

export default DragModal;
