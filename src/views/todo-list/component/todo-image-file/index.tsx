import React, { useEffect, useState } from "react";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import { getTodoById } from "@/client/TodoListHelper";
import { TodoItemType } from "../../types";
import FileImageUpload from "@/components/file-image-handle/file-image-upload";
import FileListBox from "@/components/file-image-handle/file-list-box";

interface IProps {
    activeTodo: TodoItemType;
    refreshData: Function;
    isOnlyShow?: boolean;
    width?: string;
}

const TodoImageFile: React.FC<IProps> = (props) => {
    const { activeTodo, refreshData, isOnlyShow = false, width = '120px' } = props;

    useEffect(() => {
        activeTodo && setTodo(activeTodo);
    }, [activeTodo]);

    const [todo, setTodo] = useState<TodoItemType>();
    const getTodo = async () => {
        if (activeTodo?.todo_id) {
            const res = await getTodoById(activeTodo.todo_id);
            setTodo(res.data);
            // 这边数据改变之后要刷新外部的数据，避免下次进来数据有问题
            refreshData();
        }
    };

    return (
        <>
            {!isOnlyShow && (
                <FileImageUpload
                    other_id={activeTodo?.todo_id}
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