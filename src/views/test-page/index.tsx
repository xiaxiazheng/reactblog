import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import H5 from './h5';
import KNN from "./knn";
import VirtualScroll from "./virtual-scroll";
import KeepAlive from "./keep-alive";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import MousePosition from "./mouse-position";

const TestPage: React.FC = () => {
    const map: any = {
        H5: H5,
        knn: KNN,
        "virtual-scroll": VirtualScroll,
        "keep-alive": KeepAlive,
        "mouse-position": MousePosition
    };
    const list = Object.keys(map);
    const [active, setActive] = useState<string>("H5");

    useDocumentTitle("测试页");

    const Component = () => {
        const Comp = map[active];
        return <Comp />;
    };

    return (
        <div className={`${styles.testPage} ScrollBar`}>
            <div>测试页</div>
            <div className={styles.router}>
                {list.map((item) => (
                    <span key={item} className={item === active ? styles.active : ''} onClick={() => setActive(item)}>{item}</span>
                ))}
            </div>
            {active && <Component />}
        </div>
    );
};

export default TestPage;
