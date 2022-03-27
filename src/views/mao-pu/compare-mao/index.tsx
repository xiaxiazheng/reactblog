import React, { useState } from "react";
import styles from "./index.module.scss";
import { IMao } from "../types";
import { Button, Select, Tree } from "antd";
import ParentMao from "../parent-mao";

interface IProps {
    maoList: IMao[];
    setActiveMao: Function;
}

const RenderCompareMao = (props: any) => {
    const { maoList } = props;
    const [choice, setChoice] = useState<IMao>();

    return (
        <div className={styles.compareMao}>
            <Select
                style={{ width: 300 }}
                value={choice?.mao_id}
                showSearch
                filterOption={(input, option) => {
                    return option?.children.indexOf(input) !== -1;
                }}
                onChange={(val) =>
                    setChoice(
                        maoList.filter((item: any) => item.mao_id === val)?.[0]
                    )
                }
            >
                {maoList.map((item: any) => {
                    return (
                        <Select.Option key={item.mao_id} value={item.mao_id}>
                            {item.name}
                        </Select.Option>
                    );
                })}
            </Select>
            {choice && <ParentMao mao={choice} />}
        </div>
    );
};

const CompareMao: React.FC<IProps> = (props) => {
    const { maoList, setActiveMao } = props;

    const [list, setList] = useState<number[]>([0, 0]);

    return (
        <div className={styles.maoTree}>
            <Button
                onClick={() =>
                    setList((prev) => {
                        console.log(prev);

                        return [...prev, 0];
                    })
                }
            >
                新增对比
            </Button>
            <div className={styles.compareBox}>
                {list.map((item, index) => (
                    <RenderCompareMao key={index} maoList={maoList} />
                ))}
            </div>
        </div>
    );
};

export default CompareMao;
