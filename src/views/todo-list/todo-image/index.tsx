import React, { useEffect, useState } from "react";
import ImageBox from "@/components/image-box";
import { ImgType } from "@/client/ImgHelper";
import { staticUrl } from "@/env_config";
import { getTodoById } from "@/client/TodoListHelper";
import { TodoItemType } from "../types";

interface IProps {
    activeTodo: TodoItemType;
    refreshData: Function;
}

const TodoImage: React.FC<IProps> = (props) => {
    const { activeTodo, refreshData } = props;

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
            <ImageBox
                otherId={activeTodo?.todo_id}
                type="todo"
                imageUrl=""
                imageMinUrl=""
                initImgList={getTodo}
                width="120px"
                imageData={{}}
            />
            {/* 图片列表 */}
            {todo?.imgList?.map((jtem: ImgType) => {
                return (
                    <ImageBox
                        key={jtem.img_id}
                        type="todo"
                        imageId={jtem.img_id}
                        imageName={jtem.imgname}
                        imageFileName={jtem.filename}
                        imageUrl={`${staticUrl}/img/todo/${jtem.filename}`}
                        imageMinUrl={
                            jtem.has_min === "1"
                                ? `${staticUrl}/min-img/${jtem.filename}`
                                : `${staticUrl}/img/todo/${jtem.filename}`
                        }
                        initImgList={getTodo}
                        width="120px"
                        imageData={jtem}
                    />
                );
            })}
        </>
    );
};

export default TodoImage;
