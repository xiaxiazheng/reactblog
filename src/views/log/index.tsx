import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { getLog } from "@xiaxiazheng/blog-libs";
import styles from './index.module.scss';

const Log: React.FC = () => {
    const [data, setData] = useState<any>('');

    const getData = async () => {
        const res = await getLog();
        res && setData(res);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <Button onClick={getData}>刷新</Button>
            <div className={styles.log}>{data}</div>
        </>
    );
};

export default Log;
