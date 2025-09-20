import React, { useContext, useEffect, useRef, useState } from "react";
import { message } from "antd";
import styles from "./index.module.scss";
import TodoForm from "../todo-form";
import TodoItemName from "../todo-item/todo-item-name";
import TodoChildList from "./todo-child-list";
import { FormInstance } from "antd/lib/form/Form";
import { TodoItemType } from "@xiaxiazheng/blog-libs";

interface IProps {
    otherTodo: TodoItemType | undefined;
    isEditing: boolean;
    isEditingOther: boolean;
    otherForm: FormInstance<any>;
    handleIsFieldChange: Function;
}

const OtherForm: React.FC<IProps> = props => {
    const {
        otherTodo,
        isEditing,
        isEditingOther,
        otherForm,
        handleIsFieldChange,
    } = props;

    return <>
        {otherTodo && (
            <div>
                <div className={styles.title}>前置 Todo：</div>
                <div style={{ marginBottom: 15 }}>
                    <TodoItemName
                        item={otherTodo}
                        // onlyShow={true}
                        isShowTime={true}
                        isShowTimeRange={true}
                        beforeClick={() => {
                            if (isEditing || isEditingOther) {
                                message.warning("正在编辑，不能切换");
                                return false;
                            }
                            return true;
                        }}
                    />
                </div>
                <TodoForm
                    form={otherForm}
                    open={!!otherTodo}
                    isFieldsChange={() => handleIsFieldChange()}
                    isOnlyShowTileDescription={true}
                    leftChildren={
                        otherTodo?.child_todo_list && (
                            <TodoChildList
                                title={`同级别 todo: ${otherTodo.child_todo_list_length}`}
                                todoChildList={
                                    otherTodo.child_todo_list
                                }
                                isEditing={isEditing || isEditingOther}
                            />
                        )
                    }
                />
            </div>
        )}
    </>
}

export default OtherForm;