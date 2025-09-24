import React, { useContext } from "react";
import { Tooltip } from "antd";
import { hasChainIcon, TodoChainIcon, TodoItemType } from "@xiaxiazheng/blog-libs";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../rematch";

/** 基于 todo-chain-icon 的封装，加上了一些默认逻辑 */
const TodoChainIconWeb = (props: {
    item: TodoItemType;
    isOnlyShow?: boolean;
}) => {
    const {
        item,
        isOnlyShow = false,
    } = props;

    const dispatch = useDispatch<Dispatch>();
    const { setChainId, setShowChainModal } = dispatch.edit;

    const { isDown } = hasChainIcon(item);

    return (
        <Tooltip
            title={`查看 todo 链 ${isDown ? `(后置任务数 ${item?.child_todo_list_length})` : ""}`}
        >
            <span>
                <TodoChainIcon
                    item={item}
                    wrapperStyle={{
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
            </span>
        </Tooltip>
    );
};

export default TodoChainIconWeb;
