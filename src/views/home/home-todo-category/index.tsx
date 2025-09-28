import { TodoItem, TodoItemType, TodoDescription, HomeTodoList, HomeTodoCategoryList, getHomeTodoByCategoryTodoId, HomeTodoCategoryChildList } from '@xiaxiazheng/blog-libs';
import { Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

interface IProps {
    flag?: number;
    onClick?: (item: TodoItemType) => void;
}

const HomeTodoCategory: React.FC<IProps> = (params) => {
    const { flag = 0, onClick = () => { } } = params;

    const ref = useRef<HTMLDivElement>(null);

    const [keyword, setKeyword] = useState('');

    const [refreshFlag, setRefreshFlag] = useState<number>(0);
    const handleSearch = () => {
        setRefreshFlag(prev => prev + 1);
    }

    useEffect(() => {
        handleSearch();
    }, [flag]);

    const [activeCategory, setActiveCategory] = useState<TodoItemType | null | undefined>(null);
    const [activeTodo, setActiveTodo] = useState<TodoItemType | null | undefined>(null);

    return (
        <div className={styles.homeTodo}>
            {/* 搜索框 */}
            <Input.Search
                className={styles.input}
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onPressEnter={handleSearch}
                onSearch={handleSearch}
                placeholder='请输入搜索关键词'
            />
            {/* 内容 */}
            <div className={styles.todoBox}>
                <div className={`${styles.boxLeft} ScrollBar`}>
                    <HomeTodoCategoryList onClick={setActiveCategory} />
                </div>
                <div className={`${styles.boxMiddle} ScrollBar`}>
                    <HomeTodoCategoryChildList categroy_todo_id={activeCategory?.todo_id} onClick={setActiveTodo} />
                </div>
                <div className={`${styles.boxRight} ScrollBar`} ref={ref}>
                    {activeTodo && <>
                        <div style={{ textAlign: 'left' }}>
                            <TodoItem
                                item={activeTodo}
                                keyword={keyword}
                                showDoneStrinkLine={false} />
                        </div>
                        <div>
                            <TodoDescription todoDescription={activeTodo.description} keyword={keyword} />
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default HomeTodoCategory;