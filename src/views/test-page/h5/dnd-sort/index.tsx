import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./index.module.scss";
import { useDrag, useDrop, DndProvider, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { XYCoord } from "dnd-core";
import update from "immutability-helper";
import { CardType } from "../index";

export interface CardProps {
    id: any; // 必须有 id，才能排序
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    children?: any;
}

interface DragItem {
    index: number;
    id: string;
    type: string;
}

const DragType = "box";

// 拖动和判断排序事件封装在这里
const ComponentWrapper = (props: CardProps) => {
    const { id, index, moveCard } = props;

    const ref = useRef<HTMLDivElement>(null);
    const [{ handlerId }, drop] = useDrop({
        accept: DragType,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: DragType,
        item: () => {
            return { id, index };
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));
    return (
        <span
            className={styles.handleMove}
            ref={ref}
            style={{ opacity }}
            data-handler-id={handlerId}
        >
            {props.children}
        </span>
    );
};

interface Props {
    cards: CardType[];
    setCards: Function;
    children: (card: CardType) => React.ReactNode;
}

// 提供拖动上下文和根据拖动结果修改传入数组
const DndSort = (props: Props) => {
    const { cards, setCards } = props;

    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const dragCard = cards[dragIndex];
            setCards(
                update(cards, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragCard],
                    ],
                })
            );
        },
        [cards]
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                组件库
            </div>
            <div>
                {cards.map((card, index: number) => (
                    <ComponentWrapper
                        key={card.id}
                        index={index}
                        id={card.id}
                        moveCard={moveCard}
                    >
                        {props.children(card)}
                    </ComponentWrapper>
                ))}                
            </div>
        </DndProvider>
    );
};

export default DndSort;
