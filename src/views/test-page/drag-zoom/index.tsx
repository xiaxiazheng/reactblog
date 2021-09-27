import React, { CSSProperties } from "react";
import styles from "./index.module.scss";
import ZoomWrapper from "./zoom-wrapper";

const DragZoom = () => {
    const Demo = (props: any) => {
        const { width, height, title } = props;

        const style: CSSProperties = {
            display: "inline-block",
            width,
            height,
            margin: 10,
            padding: 20,
            border: "1px solid #ccc",
            textAlign: 'center'
        };

        return <div style={style}>{title}</div>;
    };

    return (
        <div className={styles.drag_zoom}>
            <ZoomWrapper
                render={(width, height) => {
                    return <Demo width={width} height={height} title="demo1" />;
                }}
            />
            <ZoomWrapper
                render={(width, height) => {
                    return <Demo width={width} height={height} title="demo2" />;
                }}
            />
        </div>
    );
};

export default DragZoom;
