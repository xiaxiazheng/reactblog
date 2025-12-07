import React, { useState, useEffect } from 'react';

/** 默认监听 ctrl + s */
export const useCtrlHooks = (fn: Function, params?: {
    keyCode?: number;
    options?: boolean | AddEventListenerOptions | undefined;
}) => {
    const { keyCode = 83, options } = params || {};
    const [isKeyDown, setIsKeyDown] = useState(false);
    useEffect(() => {
        if (isKeyDown) {
            fn();
            setIsKeyDown(false);
        }
    }, [isKeyDown]);

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown, options);
        return () => {
            document.removeEventListener("keydown", onKeyDown, options);
        };
    }, []);

    // 键盘事件
    const onKeyDown = (e: any) => {
        // 监听 ctrl + s，加上了 mac 的 command 按键的 metaKey 的兼容
        if (e.keyCode === keyCode && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            setIsKeyDown(true);
        }
    };
}