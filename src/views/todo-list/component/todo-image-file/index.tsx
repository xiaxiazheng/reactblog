import React, { useContext, useEffect, useState } from "react";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import { getTodoById } from "@/client/TodoListHelper";
import { TodoItemType } from "../../types";
import FileImageUpload from "@/components/file-image-handle/file-image-upload";
import FileListBox from "@/components/file-image-handle/file-list-box";
import { TodoEditContext } from "../../TodoEditContext";

interface IProps {
    todo: TodoItemType;
    handleFresh?: (item?: TodoItemType) => void;
    isOnlyShow?: boolean;
    width?: string;
}

const TodoImageFile: React.FC<IProps> = (props) => {
    const {
        todo: todoBackup,
        handleFresh,
        isOnlyShow = false,
        width = "120px",
    } = props;

    useEffect(() => {
        todoBackup && setTodo(todoBackup);
    }, [todoBackup]);

    const [todo, setTodo] = useState<TodoItemType>();
    const getTodo = async () => {
        if (todoBackup?.todo_id) {
            const res = await getTodoById(todoBackup.todo_id);
            setTodo(res.data);
            handleFresh?.(res.data);
        }
    };

    return (
        <>
            {!isOnlyShow && (
                <FileImageUpload
                    other_id={todoBackup?.todo_id}
                    type="todo"
                    refresh={getTodo}
                    width={width}
                />
            )}
            {/* 图片列表 */}
            <ImageListBox
                type="todo"
                width={width}
                refresh={getTodo}
                imageList={todo?.imgList || []}
            />
            {/* 文件列表，暂时还没有 */}
            <FileListBox
                type="todo"
                width={width}
                refresh={getTodo}
                fileList={todo?.fileList || []}
            />
        </>
    );
};

export default TodoImageFile;
