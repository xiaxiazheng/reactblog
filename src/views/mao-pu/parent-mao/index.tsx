import React from "react";
import styles from "./index.module.scss";
import { IMao } from "../types";

interface IProps {
    mao: IMao;
}

const ParentMao: React.FC<IProps> = (props) => {
    const { mao } = props;

    // 二叉渲染猫猫的祖先
    const renderParentMao = (mao: IMao) => {
        return (
            <div key={mao.mao_id} className={styles.maoBox}>
                <div className={styles.self}>{mao.name}</div>
                {(mao.fatherObject || mao.motherObject) && (
                    <div className={styles.parent}>
                        <div className={styles.father}>
                            {mao.fatherObject ? (
                                renderParentMao(mao.fatherObject)
                            ) : (
                                <div className={styles.self}>{mao.father}</div>
                            )}
                        </div>

                        <div className={styles.mother}>
                            {mao.motherObject ? (
                                renderParentMao(mao.motherObject)
                            ) : (
                                <div className={styles.self}>{mao.mother}</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return <div className={styles.ParentMao}>{renderParentMao(mao)}</div>;
};

export default ParentMao;
