import React from "react";
import {
    useDrag,
    useDrop,
    DndProvider,
    DragSourceMonitor,
    DropTargetMonitor,
} from "react-dnd";

const FormItemType = "formItem";

// 拖拽 drag 源
export interface CreateSourceWrapperType {
    item: any;
    children?: any;
}
export const CreateSourceWrapper: React.FC<CreateSourceWrapperType> = (
    props
) => {
    const { item } = props;
    const [collectedProps, drag] = useDrag({
        type: FormItemType,
        item,
    });

    return <div ref={drag}>{props.children}</div>;
};

// 拖拽 drop 目标
export interface CreateTargetWrapperType {
    handleDrop: (item: any) => void;
    children?: any;
}
export const CreateTargetWrapper: React.FC<CreateTargetWrapperType> = (
    props
) => {
    const { handleDrop } = props;

    const [{ isOver }, drop] = useDrop({
        accept: FormItemType,
        drop: (item, monitor) => {
            handleDrop(item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div ref={drop} style={isOver ? { background: "#ccc" } : {}}>
            {props.children}
        </div>
    );
};
