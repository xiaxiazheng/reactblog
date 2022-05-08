import React, { useContext } from "react";
import styles from "./index.module.scss";
import { IsLoginContext } from "@/context/IsLoginContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import CloudStorage from "./cloud-storage";

const Cloud: React.FC = () => {
    // const { isLogin } = useContext(IsLoginContext);

    useDocumentTitle("cloud");

    return (
        <div className={styles.cloud}>
            <div className={styles.cloudContent}>
                <CloudStorage />
            </div>
        </div>
    );
};

export default Cloud;
