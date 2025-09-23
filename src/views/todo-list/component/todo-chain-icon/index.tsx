import React, { useContext } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "antd";
import {
    SwapLeftOutlined,
    SwapOutlined,
    SwapRightOutlined,
} from "@ant-design/icons";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../rematch";

const TodoChainIcon = (props: {
    item: TodoItemType;
    isOnlyShow?: boolean;
}) => {
    const {
        item,
        isOnlyShow = false,
    } = props;

    const dispatch = useDispatch<Dispatch>();
    const { setChainId, setShowChainModal } = dispatch.edit;

    const isHasChild =
        typeof item?.child_todo_list_length !== "undefined" &&
        item?.child_todo_list_length !== 0;

    // 在 todo 链路的展示中，前置的就不看了（因为已经找全了）
    const isUp = item?.other_id;
    // 非后续的任务，如果少于一条也不看了，因为也已经找全了；后续任务有后续的还是得看的
    const isDown = (() => {
        return isHasChild && (item?.child_todo_list_length ?? 0) > 0;
    })();

    if (!isUp && !isDown) {
        return null;
    }
    let Comp: any;

    if (isUp && isDown) {
        Comp = SwapOutlined;
    } else if (isUp) {
        Comp = SwapLeftOutlined;
    } else {
        Comp = SwapRightOutlined;
    }

    return (
        <Tooltip
            title={`查看 todo 链 ${isDown ? `(后置任务数 ${item?.child_todo_list_length})` : ""}`}
        >
            <Comp
                className={styles.progressIcon}
                style={{
                    color: "#40a9ff",
                    paddingTop: isOnlyShow ? 0 : 5,
                }}
                title="查看 todo 链"
                onClick={(e: any) => {
                    e.stopPropagation();
                    if (!isOnlyShow) {
                        setChainId(item.todo_id);
                        setShowChainModal(true);
                    }
                }}
            />
            {isDown && <span className={styles.childNumber}>{item?.child_todo_list_length}</span>}
        </Tooltip>
    );
};

export default TodoChainIcon;
