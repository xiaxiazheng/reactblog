import React from "react";
import { Button, message, Popconfirm, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import ListItem from "../component/list-item";

interface Props {
    loading: boolean;
    title: "待办" | "已完成" | "待办池" | string;
    mapList: any;
    getTodo: Function;
    handleAdd: Function;
    handleEdit: Function;
}

// 待办池
const PoolList: React.FC<Props> = (props) => {
    const { loading, title, mapList, getTodo, handleAdd, handleEdit } = props;

    return (
        <div className={styles.list}>
            {loading && <Loading />}
            <div className={styles.header}>
                <span>
                    待办池({mapList.length})
                </span>
                <Button onClick={() => handleAdd(title)}>
                    <PlusOutlined />
                    todo
                </Button>
            </div>
            <div className={`${styles.listItemWrap} ScrollBar`}>
                <div className={styles.oneDay}>
                    <ListItem
                        list={mapList}
                        title="待办池"
                        getTodo={getTodo}
                        handleEdit={handleEdit}
                    />
                </div>
            </div>
        </div>
    );
};

export default PoolList;
