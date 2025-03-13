import React, { useContext } from "react";
import styles from "./index.module.scss";
import { Tooltip } from "antd";
import {
    SwapLeftOutlined,
    SwapOutlined,
    SwapRightOutlined,
} from "@ant-design/icons";
import { TodoItemType } from "../../types";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../rematch";

const TodoChainIcon = (props: {
    item: TodoItemType;
    isChain?: boolean; // 是否是 chain modal 中的展示
    isChainNext?: boolean; // 是否是后续任务
    isOnlyShow?: boolean;
}) => {
    const {
        item,
        isChain = false,
        isChainNext = false,
        isOnlyShow = false,
    } = props;

    const dispatch = useDispatch<Dispatch>();
    const { setChainId, setShowChainModal } = dispatch.edit;

    const isHasChild =
        typeof item?.child_todo_list_length !== "undefined" &&
        item?.child_todo_list_length !== 0;

    // 在 todo 链路的展示中，前置的就不看了（因为已经找全了）
    const isUp = item?.other_id && !isChain;
    // 非后续的任务，如果少于一条也不看了，因为也已经找全了；后续任务有后续的还是得看的
    const isDown = (() => {
        if (!isChain || isChainNext) {
            return isHasChild;
        } else {
            return isHasChild && item?.child_todo_list_length > 1;
        }
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
            title={`查看 todo 链 ${
                isDown ? `(后置任务数 ${item?.child_todo_list_length})` : ""
            }`}
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
        </Tooltip>
    );
};

export default TodoChainIcon;
