import { TodoItem, TodoItemType, TodoDescription, HomeTodoCategoryList, HomeTodoCategoryChildList } from '@xiaxiazheng/blog-libs';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

interface IProps {
    type?: 'home' | 'all';
    flag?: number;
    onClick?: (item?: TodoItemType) => void;
}

const HomeTodoCategory: React.FC<IProps> = (params) => {
    const { type, flag = 0, onClick = () => { } } = params;

    const ref = useRef<HTMLDivElement>(null);

    const [activeCategory, setActiveCategory] = useState<TodoItemType | null | undefined>(null);
    const [activeTodo, setActiveTodo] = useState<TodoItemType | null | undefined>(null);

    return (
        <div className={styles.homeTodo}>
            {/* 内容 */}
            <div className={styles.todoBox}>
                <div className={`${styles.boxLeft} ScrollBar`}>
                    <HomeTodoCategoryList
                        type={type}
                        flag={flag}
                        onClick={setActiveCategory}
                    />
                </div>
                <div className={`${styles.boxMiddle} ScrollBar`}>
                    <HomeTodoCategoryChildList
                        type={type}
                        flag={flag}
                        categroy_todo_id={activeCategory?.todo_id}
                        onClick={(item) => {
                            ref?.current?.scroll?.({
                                top: 0,
                                behavior: 'smooth',
                            });
                            setActiveTodo(item);
                            onClick?.(item);
                        }}
                    />
                </div>
                <div className={`${styles.boxRight} ScrollBar`} ref={ref}>
                    {activeTodo && <>
                        <div style={{ textAlign: 'left' }}>
                            <TodoItem
                                item={activeTodo}
                                showDoneStrinkLine={false} />
                        </div>
                        <div>
                            <TodoDescription todoDescription={activeTodo.description} />
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default HomeTodoCategory;