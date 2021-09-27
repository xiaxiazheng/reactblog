import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./index.module.scss";
import DndSort from "./dnd-sort";
import { Button, Form } from "antd";
import ZoomWrapper from "./zoom-wrapper";
import { ComponentsType } from "./components";
import { renderFormItems } from "./form-items";

export interface CardType extends ComponentsType {
    id: any; // 必须有 id 才能排序
}

// 渲染具体组件
const render = (card: CardType) => {
    const { type, ...rest } = card;
    const Comp = React.lazy(() => import(`./components/${type}`));

    return (
        <ZoomWrapper
            render={(width, height) => (
                <Comp {...rest} style={{ width, height }} />
            )}
        />
    );
};

const H5: React.FC = () => {
    const [form] = Form.useForm();

    const [cards, setCards] = useState<CardType[]>([]);

    useEffect(() => {
        console.log("cards", cards);
    }, [cards]);

    const [activeCardId, setActiveCardId] = useState<CardType>();

    const onFinish = (value: any) => {
        console.log("activeCardId", activeCardId);
        console.log(value);

        const list = cards.map((item) => {
            if (item.id !== activeCardId) {
                return item;
            } else {
                return {
                    ...item,
                    formData: value,
                };
            }
        });
        setCards(list);
    };

    return (
        <div className={styles.h5}>
            <div>
                <DndSort
                    cards={cards}
                    setCards={setCards}
                    render={(card) => {
                        return (
                            <span
                                onClick={() => {
                                    setActiveCardId(card.id);
                                    form.setFieldsValue(
                                        cards.find(
                                            (item) => item.id === card.id
                                        )?.formData || {}
                                    );
                                }}
                            >
                                {render(card)}
                            </span>
                        );
                    }}
                />
            </div>
            <div>
                <div style={{ padding: 30 }}>
                    <div style={{ marginBottom: 50 }}>编辑属性</div>
                    {activeCardId && (
                        <Form form={form} onFinish={onFinish}>
                            {renderFormItems(
                                cards.find((item) => item.id === activeCardId)
                                    ?.formItems || []
                            )}
                            <Button htmlType="submit">提交修改</Button>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default H5;
