import React, { useState, useRef, useEffect, ReactNode } from "react";

interface Props {
    render: (width?: number, height?: number) => ReactNode;
}

// 缩放的高阶组件
const ZoomWrapper: React.FC<Props> = (props) => {
    const ref = useRef<any>(null);

    const [width, setWidth] = useState<number>();
    const [height, setHeight] = useState<number>();

    const [isActive, setIsActive] = useState<boolean>(false);

    const drag = useRef<any>(null);
    useEffect(() => {
        // 元素初始宽高
        let originWidth = 0,
            originHeight = 0;

        // 鼠标初始位置
        let left = 0,
            top = 0;

        // 鼠标按下的时候记录位置
        const onMouseDown = (e: any) => {
            originWidth = ref.current.offsetWidth;
            originHeight = ref.current.offsetHeight;

            left = e.clientX;
            top = e.clientY;

            // 监听移动事件
            document.documentElement.addEventListener(
                "mousemove",
                onMouseMove,
                false
            );
        };
        // 释放鼠标移除移动事件的监听
        const onMouseUp = (e: any) => {
            document.documentElement.removeEventListener(
                "mousemove",
                onMouseMove,
                false
            );
        };

        // 监听移动事件
        const onMouseMove = (e: any) => {
            // 主要是记录了鼠标按下的位置，和当期那移动的位置做比较，将移动的距离叠加到元素的宽高上面
            const wid = originWidth + e.clientX - left;
            ref.current.style.width = `${wid}px`;
            setWidth(wid);

            const hig = originHeight + e.clientY - top;
            ref.current.style.height = `${hig}px`;
            setHeight(hig);
        };

        if (isActive) {
            drag.current?.addEventListener("mousedown", onMouseDown, false);
            document.documentElement.addEventListener(
                "mouseup",
                onMouseUp,
                false
            );
        } else {
            drag.current?.removeEventListener("mousedown", onMouseDown, false);
            document.documentElement.removeEventListener(
                "mouseup",
                onMouseUp,
                false
            );
        }
    }, [isActive]);

    return (
        <span
            ref={ref}
            style={{
                position: "relative",
                display: "inline-block",
                border: isActive ? "1px solid black" : "none",
            }}
            onDoubleClick={() => setIsActive((prev) => !prev)}
        >
            {props.render(width, height)}
            {isActive && (
                <span
                    ref={drag}
                    style={{
                        position: "absolute",
                        backgroundColor: "black",
                        display: "inline-block",
                        width: 4,
                        height: 4,
                        bottom: 0,
                        right: 0,
                        cursor: "se-resize",
                    }}
                />
            )}
        </span>
    );
};

export default ZoomWrapper;
