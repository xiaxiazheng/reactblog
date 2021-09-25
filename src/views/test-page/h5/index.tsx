import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./index.module.scss";
import map from "./components";
import DndSort from "./dnd-sort";
import { Button, Input } from "antd";
import ZoomWrapper from './zoom-wrapper';

export interface CardType {
    id: any; // 必须有 id 才能排序
    type: "Input" | "Button";
    style: Object;
    props: Object;
}

// 渲染具体组件
const render = (card: CardType) => {
    const { type, ...rest } = card;
    const Comp = map[type];

    return (
        <ZoomWrapper>
            {(width: number, height: number) => <Comp {...rest} style={{ width, height }} />}
        </ZoomWrapper>
    );
};

const H5: React.FC = () => {
    const [cards, setCards] = useState<CardType[]>([
        {
            id: 1,
            type: "Input",
            style: {},
            props: {},
        },
        {
            id: 2,
            type: "Button",
            style: {},
            props: {},
        },
        {
            id: 3,
            type: "Button",
            style: {},
            props: {},
        },
    ]);

    useEffect(() => {
        console.log("cards", cards);
    }, [cards]);

    const [activeCard, setActiveCard] = useState<CardType>();
    useEffect(() => {
        console.log("activeCard", activeCard);
        setStyle(JSON.stringify(activeCard?.style || ""));
    }, [activeCard]);

    const [style, setStyle] = useState<string>();
    const handleStyle = () => {
        console.log(style);
        const list = [...cards];
        list.forEach((item) => {
            if (item.id === activeCard?.id && style) {
                item.style = JSON.parse(style);
            }
        });
        setCards(list);
    };

    return (
        <div className={styles.h5}>
            <div>
                <DndSort cards={cards} setCards={setCards}>
                    {(card) => {
                        return (
                            <span
                                onClick={() => {
                                    setActiveCard(card);
                                }}
                            >
                                {render(card)}
                            </span>
                        );
                    }}
                </DndSort>
            </div>
            <div>
                <div>编辑样式</div>
                <Input
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                />
                <Button
                    onClick={() => {
                        handleStyle();
                    }}
                >
                    提交修改
                </Button>
            </div>
        </div>
    );
};

export default H5;
