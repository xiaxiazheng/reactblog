import { TodoItem, TodoItemType, TodoDescription, HomeTodoDirectoryList, HomeTodoDirectoryChildList, getTodoById, Loading } from '@xiaxiazheng/blog-libs';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

interface IProps {
    type?: 'home' | 'all';
    flag?: number;
    /** 把当前的 activeTodo 往上层组件传 */
    getActiveTodo?: (item?: TodoItemType) => void;
}

const HomeTodoDirectory: React.FC<IProps> = (params) => {
    const { type, flag = 0, getActiveTodo = () => { } } = params;

    const ref = useRef<HTMLDivElement>(null);

    const [activeCategory, setActiveCategory] = useState<TodoItemType | undefined>();
    const [activeTodo, setActiveTodo] = useState<TodoItemType | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getActiveTodo?.(activeTodo);
    }, [activeTodo]);

    useEffect(() => {
        getNewActiveTodo();
    }, [flag]);

    const getNewActiveTodo = async () => {
        if (activeTodo) {
            // 边界 case，用于已经点开的 todo，但编辑弹窗编辑后更新了
            // 要从接口拿一份新的
            setLoading(true);
            const res = await getTodoById(activeTodo.todo_id);
            // 边界 case：如果删除了，也要能成功重置这个已经点击的 todo
            if (res?.data?.todo_id) {
                setActiveTodo(res?.data);
            } else {
                setActiveTodo(undefined);
            }
            setLoading(false);
        }
    }

    const [middleKeyword, setMiddleKeyword] = useState<string>('');

    return (
        <div className={styles.homeTodo}>
            {/* 内容 */}
            <div className={styles.todoBox}>
                {/* 左边 */}
                <div className={`${styles.boxLeft} ScrollBar`}>
                    <HomeTodoDirectoryList
                        type={type}
                        flag={flag}
                        onClick={setActiveCategory}
                    />
                </div>
                {/* 中间 */}
                <div className={`${styles.boxMiddle} ScrollBar`}>
                    <HomeTodoDirectoryChildList
                        type={type}
                        flag={flag}
                        categroy_todo_id={activeCategory?.todo_id}
                        onClick={(item) => {
                            ref?.current?.scroll?.({
                                top: 0,
                                behavior: 'smooth',
                            });
                            setActiveTodo(item);
                        }}
                        onKeywordChange={(key) => setMiddleKeyword(key || '')}
                    />
                </div>
                {/* 右边 */}
                <div className={`${styles.boxRight} ScrollBar`} ref={ref}>
                    {loading && <Loading />}
                    {activeTodo && <>
                        <div style={{ textAlign: 'left' }}>
                            <TodoItem
                                item={activeTodo}
                                showDoneStrinkLine={false}
                                keyword={middleKeyword}
                            />
                        </div>
                        <div>
                            <TodoDescription
                                keyword={middleKeyword}
                                todoDescription={activeTodo.description}
                            />
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default HomeTodoDirectory;