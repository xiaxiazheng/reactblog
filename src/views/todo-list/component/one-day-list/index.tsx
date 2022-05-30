import React, { useState } from "react";
import styles from "./index.module.scss";
import { Collapse, message, Modal, Popconfirm, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    ApartmentOutlined,
    GoldOutlined,
} from "@ant-design/icons";
import { doneTodoItem, getTodoById } from "@/client/TodoListHelper";
import { StatusType, TodoItemType, TodoStatus } from "../../types";
import NameWrapper from "./name-wrapper";

interface Props {
    list: TodoItemType[];
    getTodo: (type: StatusType) => void;
    handleEdit: Function;
    refreshData: Function;
}

const ListItem: React.FC<Props> = (props) => {
    const { list, getTodo, handleEdit, refreshData } = props;

    // 完成 todo（只有待办才能触发这个函数）
    const doneTodo = async (todo_id: string) => {
        const req = {
            todo_id,
        };
        const res = await doneTodoItem(req);
        if (res) {
            message.success(res.message);
            getTodo("done");
            getTodo("todo");
        } else {
            message.error("完成 todo 失败");
        }
    };

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();

    const getParentTodo = async (other_id: string) => {
        const res = await getTodoById(other_id);
        setActiveTodo(res.data);
        setShowDrawer(true);
    };

    const renderItemList = (
        list: TodoItemType[],
        isChild: boolean,
        isShowAllLevel: boolean
    ) => {
        if (!list) {
            return null;
        }
        const map = list.reduce((prev: any, cur: any) => {
            prev[cur.todo_id || ""] = true;
            return prev;
        }, {});

        const renderItem = (item: TodoItemType) => {
            const isHasChild =
                item?.child_todo_list && item?.child_todo_list.length !== 0;
            const isAllChildDone = isHasChild
                ? item?.child_todo_list?.every(
                      (item) => item.status == TodoStatus.done
                  )
                : true;

            return (
                <div
                    key={item.todo_id}
                    className={isChild ? styles.childList : ""}
                >
                    <div className={styles.item}>
                        <span>
                            <span>
                                {item?.other_id && !isShowAllLevel && (
                                    <Tooltip title={"查看父级所有进度"}>
                                        <GoldOutlined
                                            className={styles.doneIcon}
                                            title="查看父级所有进度"
                                            onClick={() =>
                                                getParentTodo(
                                                    item?.other_id || ""
                                                )
                                            }
                                        />
                                    </Tooltip>
                                )}
                            </span>
                            <span>
                                {isHasChild && !isShowAllLevel && (
                                    <Tooltip title={"查看进度"}>
                                        <ApartmentOutlined
                                            className={styles.doneIcon}
                                            style={{
                                                color: "#40a9ff",
                                            }}
                                            title="查看进度"
                                            onClick={() => {
                                                setActiveTodo(item);
                                                setShowDrawer(true);
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            </span>
                            {item.status == TodoStatus.todo && !isHasChild && (
                                <Popconfirm
                                    title="确认已完成吗？"
                                    onConfirm={() => {
                                        if (isAllChildDone) {
                                            doneTodo(item.todo_id || "");
                                        } else {
                                            message.warning("还有子任务待完成");
                                        }
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Tooltip title={"点击完成"} color="#20d420">
                                        <CheckCircleOutlined
                                            title="完成"
                                            className={styles.doneIcon}
                                        />
                                    </Tooltip>
                                </Popconfirm>
                            )}
                            <NameWrapper
                                item={item}
                                isChild={isChild}
                                handleEdit={handleEdit}
                                refreshData={refreshData}
                            />
                        </span>
                    </div>
                </div>
            );
        };

        return (
            <div>
                {list
                    .filter((item) => !map[item.other_id || ""])
                    .map((item: TodoItemType) => {
                        const isHasChild =
                            item?.child_todo_list &&
                            item?.child_todo_list.length !== 0;

                        const childListNow = isShowAllLevel
                            ? item.child_todo_list
                            : (isHasChild &&
                                  item.child_todo_list.filter(
                                      (child) => map[child.todo_id || ""]
                                  )) ||
                              [];

                        return (
                            <div key={item.todo_id}>
                                {childListNow.length > 0 ? (
                                    <Collapse
                                        ghost
                                        defaultActiveKey={[item.todo_id || ""]}
                                    >
                                        <Collapse.Panel
                                            header={renderItem(item)}
                                            key={item.todo_id || ""}
                                        >
                                            {childListNow.map((child) => {
                                                return (
                                                    <div key={child.todo_id}>
                                                        {renderItem(child)}
                                                    </div>
                                                );
                                            })}
                                        </Collapse.Panel>
                                    </Collapse>
                                ) : (
                                    <>{renderItem(item)}</>
                                )}
                            </div>
                        );
                    })}
            </div>
        );
    };

    return (
        <div>
            <div>{renderItemList(list, false, false)}</div>
            <Modal
                title={"所有层级"}
                visible={showDrawer}
                onCancel={() => setShowDrawer(false)}
                footer={null}
            >
                <div className={styles.modal}>
                    {activeTodo && renderItemList([activeTodo], false, true)}
                </div>
            </Modal>
        </div>
    );
};

export default ListItem;
